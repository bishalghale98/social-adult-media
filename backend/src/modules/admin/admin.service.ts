import prisma from '../../config/prisma';
import { decryptMessage } from '../../utils/encryption';

/**
 * Safely decrypt a stored message row, returning null if fields are missing.
 */
function decryptRow(msg: {
    bodyCiphertext: string | null;
    nonce: string | null;
    authTag: string | null;
    keyVersion: number;
}): string | null {
    if (!msg.bodyCiphertext || !msg.nonce || !msg.authTag) return null;
    try {
        return decryptMessage({
            ciphertext: msg.bodyCiphertext,
            nonce: msg.nonce,
            authTag: msg.authTag,
            keyVersion: msg.keyVersion,
        });
    } catch {
        return '[decryption error]';
    }
}

export class AdminService {
    /**
     * List reports with optional status filter.
     */
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

    /**
     * Get report detail with decrypted evidence messages.
     * Admin can ONLY decrypt messages that are linked to an OPEN or REVIEWED report.
     * Every access is audit-logged.
     */
    static async getReportDetail(reportId: string, adminId: string) {
        const report = await prisma.report.findUnique({
            where: { id: reportId },
            include: {
                reporter: {
                    include: { profile: { select: { username: true } } },
                },
            },
        });

        if (!report) {
            throw new Error('Report not found');
        }

        if (report.status === 'CLOSED') {
            throw new Error('Report is closed');
        }

        // Decrypt only the evidence messages
        let decryptedMessages: Array<{
            id: string;
            senderId: string;
            bodyText: string | null;
            createdAt: Date;
            isReportedMessage: boolean;
        }> = [];

        if (report.evidenceMessageIds.length > 0) {
            const messages = await prisma.message.findMany({
                where: { id: { in: report.evidenceMessageIds } },
                orderBy: { createdAt: 'asc' },
                select: {
                    id: true,
                    senderId: true,
                    bodyCiphertext: true,
                    nonce: true,
                    authTag: true,
                    keyVersion: true,
                    createdAt: true,
                },
            });

            decryptedMessages = messages.map((m) => ({
                id: m.id,
                senderId: m.senderId,
                bodyText: decryptRow(m),
                createdAt: m.createdAt,
                isReportedMessage: m.id === report.messageId,
            }));
        }

        // Get reported user profile
        let reportedUser = null;
        if (report.targetType === 'USER' || report.targetType === 'MESSAGE') {
            // targetId is the reported user's ID
            reportedUser = await prisma.user.findUnique({
                where: { id: report.targetId },
                select: {
                    id: true,
                    email: true,
                    status: true,
                    profile: { select: { username: true } },
                },
            });
        }

        // AUDIT LOG: admin viewed report content
        await prisma.auditLog.create({
            data: {
                actorId: adminId,
                action: 'VIEW_REPORT_CONTENT',
                metadata: {
                    reportId,
                    messageIds: report.evidenceMessageIds,
                    timestamp: new Date().toISOString(),
                },
            },
        });

        return {
            report,
            messages: decryptedMessages,
            reportedUser,
        };
    }

    /**
     * Mark report as reviewed.
     */
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

    /**
     * Close a report.
     */
    static async closeReport(reportId: string, actorId: string) {
        const report = await prisma.report.update({
            where: { id: reportId },
            data: { status: 'CLOSED' },
        });

        await prisma.auditLog.create({
            data: {
                actorId,
                action: 'CLOSE_REPORT',
                metadata: { reportId },
            },
        });

        return report;
    }

    /**
     * Warn a user (creates an audit log entry; actual notification is future work).
     */
    static async warnUser(userId: string, actorId: string, reportId?: string) {
        await prisma.auditLog.create({
            data: {
                actorId,
                action: 'WARN_USER',
                metadata: { targetUserId: userId, reportId: reportId || null },
            },
        });

        return { success: true };
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
