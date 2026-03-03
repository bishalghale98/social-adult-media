import prisma from '../../config/prisma';
import { env } from '../../config/env';

/**
 * Message retention job: hard-deletes messages older than the configured
 * retention period. Reported messages are kept for a longer period.
 *
 * Call this from a cron scheduler (e.g., node-cron) once per day.
 */
export async function runMessageRetentionCleanup(): Promise<{
    deletedCount: number;
}> {
    const now = new Date();

    // Normal retention cutoff
    const normalCutoff = new Date(now);
    normalCutoff.setDate(normalCutoff.getDate() - env.MESSAGE_RETENTION_DAYS);

    // Reported messages retention cutoff (longer)
    const reportedCutoff = new Date(now);
    reportedCutoff.setDate(reportedCutoff.getDate() - env.REPORTED_MESSAGE_RETENTION_DAYS);

    // Get all message IDs that are referenced by any non-CLOSED report
    const activeReports = await prisma.report.findMany({
        where: {
            status: { not: 'CLOSED' },
        },
        select: {
            messageId: true,
            evidenceMessageIds: true,
        },
    });

    // Collect protected message IDs
    const protectedIds = new Set<string>();
    for (const report of activeReports) {
        if (report.messageId) protectedIds.add(report.messageId);
        for (const id of report.evidenceMessageIds) {
            protectedIds.add(id);
        }
    }

    // Delete old messages that are NOT protected by active reports
    // First: delete unprotected messages older than normal cutoff
    const unprotectedResult = await prisma.message.deleteMany({
        where: {
            createdAt: { lt: normalCutoff },
            id: { notIn: Array.from(protectedIds) },
        },
    });

    // Second: delete protected messages that exceed the longer reported cutoff
    // (even evidence must eventually be deleted)
    const protectedResult = await prisma.message.deleteMany({
        where: {
            createdAt: { lt: reportedCutoff },
            id: { in: Array.from(protectedIds) },
        },
    });

    const deletedCount = unprotectedResult.count + protectedResult.count;

    console.log(
        `[Retention] Deleted ${deletedCount} messages ` +
        `(${unprotectedResult.count} normal, ${protectedResult.count} reported evidence)`
    );

    return { deletedCount };
}
