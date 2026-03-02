import prisma from '../../config/prisma';

export class AdminService {
    static async getReports(status?: string, page = 1, limit = 20) {
        const where: any = {};
        if (status) where.status = status;

        const [reports, total] = await Promise.all([
            prisma.report.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    reporter: {
                        include: { profile: { select: { username: true } } },
                    },
                },
            }),
            prisma.report.count({ where }),
        ]);

        return { reports, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }

    static async reviewReport(reportId: string, actorId: string) {
        const report = await prisma.report.update({
            where: { id: reportId },
            data: { status: 'REVIEWED' },
        });

        await prisma.auditLog.create({
            data: {
                actorId,
                action: 'REVIEW_REPORT',
                metadata: { reportId },
            },
        });

        return report;
    }

    static async suspendUser(userId: string, actorId: string) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status: 'SUSPENDED' },
        });

        await prisma.auditLog.create({
            data: {
                actorId,
                action: 'SUSPEND_USER',
                metadata: { targetUserId: userId },
            },
        });

        return user;
    }

    static async banUser(userId: string, actorId: string) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status: 'BANNED' },
        });

        await prisma.auditLog.create({
            data: {
                actorId,
                action: 'BAN_USER',
                metadata: { targetUserId: userId },
            },
        });

        return user;
    }

    static async deleteMessage(messageId: string, actorId: string) {
        const message = await prisma.message.update({
            where: { id: messageId },
            data: { isDeleted: true },
        });

        await prisma.auditLog.create({
            data: {
                actorId,
                action: 'DELETE_MESSAGE',
                metadata: { messageId },
            },
        });

        return message;
    }

    static async getAuditLogs(page = 1, limit = 50) {
        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.auditLog.count(),
        ]);

        return { logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
}
