import prisma from '../../config/prisma';

export class ReportsService {
    /**
     * Create a report for a message or user.
     * When reporting a MESSAGE, we also capture up to 10 surrounding messages
     * as evidence context for moderation.
     */
    static async createReport(
        reporterId: string,
        targetType: 'USER' | 'MESSAGE',
        targetId: string,
        reason: string,
        messageId?: string,
        conversationId?: string
    ) {
        let evidenceMessageIds: string[] = [];

        // If reporting a specific message, capture surrounding context
        if (targetType === 'MESSAGE' && messageId && conversationId) {
            // Verify reporter is participant of the conversation
            const conversation = await prisma.conversation.findUnique({
                where: { id: conversationId },
            });

            if (
                !conversation ||
                (conversation.user1Id !== reporterId && conversation.user2Id !== reporterId)
            ) {
                throw new Error('You are not a participant in this conversation');
            }

            // Get the reported message to find its timestamp
            const reportedMessage = await prisma.message.findUnique({
                where: { id: messageId },
                select: { createdAt: true, conversationId: true },
            });

            if (!reportedMessage || reportedMessage.conversationId !== conversationId) {
                throw new Error('Message not found in this conversation');
            }

            // Get up to 5 messages before and 5 after the reported message
            const [before, after] = await Promise.all([
                prisma.message.findMany({
                    where: {
                        conversationId,
                        createdAt: { lt: reportedMessage.createdAt },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    select: { id: true },
                }),
                prisma.message.findMany({
                    where: {
                        conversationId,
                        createdAt: { gt: reportedMessage.createdAt },
                    },
                    orderBy: { createdAt: 'asc' },
                    take: 5,
                    select: { id: true },
                }),
            ]);

            evidenceMessageIds = [
                ...before.map((m) => m.id).reverse(),
                messageId,
                ...after.map((m) => m.id),
            ];
        }

        const report = await prisma.report.create({
            data: {
                reporterId,
                targetType,
                targetId,
                reason,
                messageId: messageId || null,
                conversationId: conversationId || null,
                evidenceMessageIds,
            },
        });

        return report;
    }
}
