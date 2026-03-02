import prisma from '../../config/prisma';

export class BlocksService {
    static async blockUser(blockerId: string, blockedId: string) {
        if (blockerId === blockedId) {
            throw new Error('Cannot block yourself');
        }

        const existing = await prisma.block.findUnique({
            where: { blockerId_blockedId: { blockerId, blockedId } },
        });
        if (existing) {
            throw new Error('User already blocked');
        }

        const block = await prisma.block.create({
            data: { blockerId, blockedId },
        });

        // Also cancel any pending friend requests between these users
        await prisma.friendRequest.updateMany({
            where: {
                OR: [
                    { senderId: blockerId, receiverId: blockedId, status: 'PENDING' },
                    { senderId: blockedId, receiverId: blockerId, status: 'PENDING' },
                ],
            },
            data: { status: 'CANCELED' },
        });

        return block;
    }

    static async unblockUser(blockerId: string, blockedId: string) {
        await prisma.block.delete({
            where: { blockerId_blockedId: { blockerId, blockedId } },
        });
        return { success: true };
    }

    static async getBlocks(blockerId: string) {
        const blocks = await prisma.block.findMany({
            where: { blockerId },
            orderBy: { createdAt: 'desc' },
        });

        // Get profile info for blocked users
        const blockedIds = blocks.map((b: { blockedId: string }) => b.blockedId);
        const profiles = await prisma.profile.findMany({
            where: { userId: { in: blockedIds } },
            select: { userId: true, username: true },
        });

        return blocks.map((b: { id: string; blockerId: string; blockedId: string; createdAt: Date }) => ({
            ...b,
            blockedUser: profiles.find((p: { userId: string; username: string }) => p.userId === b.blockedId),
        }));
    }
}
