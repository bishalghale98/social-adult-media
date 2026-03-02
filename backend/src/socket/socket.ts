import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import prisma from '../config/prisma';
import { sanitize } from '../utils/sanitize';

interface AuthenticatedSocket extends Socket {
    userId?: string;
}

export function initSocketIO(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: env.CORS_ORIGIN,
            credentials: true,
        },
        path: '/socket.io',
    });

    // Namespace: /chat
    const chatNsp = io.of('/chat');

    // Authentication middleware
    chatNsp.use(async (socket: AuthenticatedSocket, next) => {
        try {
            const token =
                socket.handshake.auth.token ||
                socket.handshake.headers.authorization?.split(' ')[1];

            if (!token) {
                return next(new Error('Authentication required'));
            }

            const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as {
                userId: string;
            };

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, status: true },
            });

            if (!user || user.status !== 'ACTIVE') {
                return next(new Error('User not active'));
            }

            socket.userId = decoded.userId;
            next();
        } catch {
            next(new Error('Invalid token'));
        }
    });

    chatNsp.on('connection', (socket: AuthenticatedSocket) => {
        const userId = socket.userId!;
        console.log(`User connected: ${userId}`);

        // Join personal room
        socket.join(`user:${userId}`);

        // Handle message:send
        socket.on(
            'message:send',
            async (data: { conversationId: string; bodyText: string }) => {
                try {
                    // Verify conversation membership
                    const conversation = await prisma.conversation.findUnique({
                        where: { id: data.conversationId },
                    });

                    if (
                        !conversation ||
                        (conversation.user1Id !== userId && conversation.user2Id !== userId)
                    ) {
                        socket.emit('error', { message: 'Invalid conversation' });
                        return;
                    }

                    const otherUserId =
                        conversation.user1Id === userId
                            ? conversation.user2Id
                            : conversation.user1Id;

                    // Check block
                    const blocked = await prisma.block.findFirst({
                        where: {
                            OR: [
                                { blockerId: userId, blockedId: otherUserId },
                                { blockerId: otherUserId, blockedId: userId },
                            ],
                        },
                    });
                    if (blocked) {
                        socket.emit('error', { message: 'Cannot send message' });
                        return;
                    }

                    const sanitizedText = sanitize(data.bodyText);

                    const message = await prisma.message.create({
                        data: {
                            conversationId: data.conversationId,
                            senderId: userId,
                            type: 'TEXT',
                            bodyText: sanitizedText,
                        },
                    });

                    await prisma.conversation.update({
                        where: { id: data.conversationId },
                        data: { lastMessageAt: new Date() },
                    });

                    const messagePayload = {
                        id: message.id,
                        conversationId: message.conversationId,
                        senderId: message.senderId,
                        type: message.type,
                        bodyText: message.bodyText,
                        createdAt: message.createdAt,
                    };

                    // Emit to both users
                    chatNsp.to(`user:${userId}`).emit('message:new', messagePayload);
                    chatNsp.to(`user:${otherUserId}`).emit('message:new', messagePayload);

                    // Emit conversation update
                    chatNsp.to(`user:${otherUserId}`).emit('conversation:update', {
                        conversationId: data.conversationId,
                        lastMessageAt: message.createdAt,
                    });
                } catch (error) {
                    console.error('Socket message:send error:', error);
                    socket.emit('error', { message: 'Failed to send message' });
                }
            }
        );

        // Handle typing indicators
        socket.on('typing:start', async (data: { conversationId: string }) => {
            try {
                const conversation = await prisma.conversation.findUnique({
                    where: { id: data.conversationId },
                });
                if (!conversation) return;

                const otherUserId =
                    conversation.user1Id === userId
                        ? conversation.user2Id
                        : conversation.user1Id;

                chatNsp.to(`user:${otherUserId}`).emit('typing', {
                    conversationId: data.conversationId,
                    userId,
                    isTyping: true,
                });
            } catch { }
        });

        socket.on('typing:stop', async (data: { conversationId: string }) => {
            try {
                const conversation = await prisma.conversation.findUnique({
                    where: { id: data.conversationId },
                });
                if (!conversation) return;

                const otherUserId =
                    conversation.user1Id === userId
                        ? conversation.user2Id
                        : conversation.user1Id;

                chatNsp.to(`user:${otherUserId}`).emit('typing', {
                    conversationId: data.conversationId,
                    userId,
                    isTyping: false,
                });
            } catch { }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${userId}`);
        });
    });

    return io;
}
