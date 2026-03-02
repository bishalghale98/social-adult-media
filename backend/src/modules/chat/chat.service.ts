import prisma from '../../config/prisma';
import { sanitize } from '../../utils/sanitize';

interface ConversationRow {
    id: string;
    user1Id: string;
    user2Id: string;
    lastMessageAt: Date | null;
    createdAt: Date;
}

interface MessageRow {
    bodyText: string | null;
    createdAt: Date;
    senderId: string;
}

export class ChatService {
    static async getConversations(userId: string) {
        const conversations: ConversationRow[] = await prisma.conversation.findMany({
            where: {
                OR: [{ user1Id: userId }, { user2Id: userId }],
            },
            orderBy: { lastMessageAt: 'desc' },
        });

        // Get profile info for the other user in each conversation
        const otherUserIds = conversations.map((c: ConversationRow) =>
            c.user1Id === userId ? c.user2Id : c.user1Id
        );

        const profiles = await prisma.profile.findMany({
            where: { userId: { in: otherUserIds } },
            select: { userId: true, username: true, lastActiveAt: true },
        });

        // Get last message for each conversation
        const lastMessages: (MessageRow | null)[] = await Promise.all(
            conversations.map((c: ConversationRow) =>
                prisma.message.findFirst({
                    where: { conversationId: c.id, isDeleted: false },
                    orderBy: { createdAt: 'desc' },
                    select: { bodyText: true, createdAt: true, senderId: true },
                })
            )
        );

        return conversations.map((c: ConversationRow, i: number) => {
            const otherUserId = c.user1Id === userId ? c.user2Id : c.user1Id;
            const profile = profiles.find((p: { userId: string }) => p.userId === otherUserId);
            return {
                id: c.id,
                otherUser: profile,
                lastMessage: lastMessages[i],
                lastMessageAt: c.lastMessageAt,
            };
        });
    }

    static async getMessages(
        conversationId: string,
        userId: string,
        cursor?: string,
        limit: number = 50
    ) {
        // Verify user is part of the conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (
            !conversation ||
            (conversation.user1Id !== userId && conversation.user2Id !== userId)
        ) {
            throw new Error('Conversation not found');
        }

        const where: Record<string, unknown> = {
            conversationId,
            isDeleted: false,
        };
        if (cursor) {
            where.createdAt = { lt: new Date(cursor) };
        }

        const messages = await prisma.message.findMany({
            where: where as any,
            orderBy: { createdAt: 'desc' },
            take: Math.min(limit, 100),
            select: {
                id: true,
                senderId: true,
                type: true,
                bodyText: true,
                createdAt: true,
            },
        });

        return {
            messages: messages.reverse(),
            nextCursor:
                messages.length > 0 ? messages[0].createdAt.toISOString() : null,
        };
    }

    static async sendMessage(
        conversationId: string,
        senderId: string,
        bodyText: string
    ) {
        // Verify user is part of the conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (
            !conversation ||
            (conversation.user1Id !== senderId && conversation.user2Id !== senderId)
        ) {
            throw new Error('Conversation not found');
        }

        // Check if blocked
        const otherUserId =
            conversation.user1Id === senderId
                ? conversation.user2Id
                : conversation.user1Id;

        const blocked = await prisma.block.findFirst({
            where: {
                OR: [
                    { blockerId: senderId, blockedId: otherUserId },
                    { blockerId: otherUserId, blockedId: senderId },
                ],
            },
        });
        if (blocked) {
            throw new Error('Cannot send message to this user');
        }

        const sanitizedText = sanitize(bodyText);

        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId,
                type: 'TEXT',
                bodyText: sanitizedText,
            },
        });

        // Update conversation lastMessageAt
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { lastMessageAt: new Date() },
        });

        return {
            ...message,
            otherUserId,
        };
    }
}
