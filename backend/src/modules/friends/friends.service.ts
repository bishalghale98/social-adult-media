import prisma from '../../config/prisma';
import { pairKey } from '../../utils/pairKey';

export class FriendsService {
    static async sendRequest(senderId: string, receiverId: string) {
        if (senderId === receiverId) {
            throw new Error('Cannot send request to yourself');
        }

        // Check if blocked
        const blocked = await prisma.block.findFirst({
            where: {
                OR: [
                    { blockerId: senderId, blockedId: receiverId },
                    { blockerId: receiverId, blockedId: senderId },
                ],
            },
        });
        if (blocked) {
            throw new Error('Cannot send request to this user');
        }

        // Check if already friends
        const [u1, u2] = pairKey(senderId, receiverId);
        const existingFriendship = await prisma.friendship.findUnique({
            where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
        });
        if (existingFriendship) {
            throw new Error('Already friends');
        }

        // Check for existing pending request
        const existingRequest = await prisma.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId, receiverId, status: 'PENDING' },
                    { senderId: receiverId, receiverId: senderId, status: 'PENDING' },
                ],
            },
        });
        if (existingRequest) {
            throw new Error('A pending request already exists');
        }

        const request = await prisma.friendRequest.create({
            data: { senderId, receiverId },
        });
        return request;
    }

    static async getIncomingRequests(userId: string) {
        return prisma.friendRequest.findMany({
            where: { receiverId: userId, status: 'PENDING' },
            include: {
                sender: {
                    include: { profile: { select: { username: true, gender: true, city: true, bio: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async getOutgoingRequests(userId: string) {
        return prisma.friendRequest.findMany({
            where: { senderId: userId, status: 'PENDING' },
            include: {
                receiver: {
                    include: { profile: { select: { username: true, gender: true, city: true, bio: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async acceptRequest(requestId: string, userId: string) {
        const request = await prisma.friendRequest.findUnique({
            where: { id: requestId },
        });
        if (!request || request.receiverId !== userId) {
            throw new Error('Request not found');
        }
        if (request.status !== 'PENDING') {
            throw new Error('Request is no longer pending');
        }

        const [u1, u2] = pairKey(request.senderId, request.receiverId);

        // Use transaction: update request, create friendship, create conversation
        const result = await prisma.$transaction(async (tx) => {
            await tx.friendRequest.update({
                where: { id: requestId },
                data: { status: 'ACCEPTED' },
            });

            const friendship = await tx.friendship.create({
                data: { user1Id: u1, user2Id: u2 },
            });

            const conversation = await tx.conversation.create({
                data: { user1Id: u1, user2Id: u2 },
            });

            return { friendship, conversation };
        });

        return result;
    }

    static async rejectRequest(requestId: string, userId: string) {
        const request = await prisma.friendRequest.findUnique({
            where: { id: requestId },
        });
        if (!request || request.receiverId !== userId) {
            throw new Error('Request not found');
        }
        if (request.status !== 'PENDING') {
            throw new Error('Request is no longer pending');
        }

        return prisma.friendRequest.update({
            where: { id: requestId },
            data: { status: 'REJECTED' },
        });
    }

    static async cancelRequest(requestId: string, userId: string) {
        const request = await prisma.friendRequest.findUnique({
            where: { id: requestId },
        });
        if (!request || request.senderId !== userId) {
            throw new Error('Request not found');
        }
        if (request.status !== 'PENDING') {
            throw new Error('Request is no longer pending');
        }

        return prisma.friendRequest.update({
            where: { id: requestId },
            data: { status: 'CANCELED' },
        });
    }

    static async getFriends(userId: string) {
        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [{ user1Id: userId }, { user2Id: userId }],
            },
        });

        const friendIds = friendships.map((f: { user1Id: string; user2Id: string }) =>
            f.user1Id === userId ? f.user2Id : f.user1Id
        );

        const friends = await prisma.profile.findMany({
            where: { userId: { in: friendIds } },
            select: {
                userId: true,
                username: true,
                gender: true,
                city: true,
                bio: true,
                lastActiveAt: true,
            },
        });

        // Get conversation IDs
        const conversations = await prisma.conversation.findMany({
            where: {
                OR: friendIds.map((fId: string) => {
                    const [cu1, cu2] = pairKey(userId, fId);
                    return { user1Id: cu1, user2Id: cu2 };
                }),
            },
            select: { id: true, user1Id: true, user2Id: true },
        });

        // Merge conversation IDs with friends
        return friends.map((f: { userId: string; username: string; gender: string; city: string; bio: string | null; lastActiveAt: Date | null }) => {
            const conv = conversations.find(
                (c: { id: string; user1Id: string; user2Id: string }) =>
                    (c.user1Id === userId && c.user2Id === f.userId) ||
                    (c.user2Id === userId && c.user1Id === f.userId)
            );
            return { ...f, conversationId: conv?.id };
        });
    }
}
