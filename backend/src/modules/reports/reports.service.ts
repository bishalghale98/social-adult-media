import prisma from '../../config/prisma';

export class ReportsService {
    static async createReport(
        reporterId: string,
        targetType: 'USER' | 'MESSAGE',
        targetId: string,
        reason: string
    ) {
        const report = await prisma.report.create({
            data: {
                reporterId,
                targetType,
                targetId,
                reason,
            },
        });
        return report;
    }
}
