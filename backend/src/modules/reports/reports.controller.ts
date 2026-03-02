import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { ReportsService } from './reports.service';

export class ReportsController {
    static async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { targetType, targetId, reason } = req.body;
            const result = await ReportsService.createReport(
                req.userId!,
                targetType,
                targetId,
                reason
            );
            res.status(201).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to create report' });
        }
    }
}
