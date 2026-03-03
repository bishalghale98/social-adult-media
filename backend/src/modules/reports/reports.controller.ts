import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { ReportsService } from './reports.service';

export class ReportsController {
    static async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { targetType, targetId, reason, messageId, conversationId } = req.body;
            const result = await ReportsService.createReport(
                req.userId!,
                targetType,
                targetId,
                reason,
                messageId,
                conversationId
            );
            res.status(201).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : '';
            if (
                message === 'You are not a participant in this conversation' ||
                message === 'Message not found in this conversation'
            ) {
                res.status(400).json({ error: message });
                return;
            }
            res.status(500).json({ error: 'Failed to create report' });
        }
    }
}
