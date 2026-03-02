import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AdminService } from './admin.service';

export class AdminController {
    static async getReports(req: AuthRequest, res: Response): Promise<void> {
        try {
            const status = req.query.status as string | undefined;
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const result = await AdminService.getReports(status, page);
            res.status(200).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to get reports' });
        }
    }

    static async reviewReport(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await AdminService.reviewReport(req.params.id as string, req.userId!);
            res.status(200).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to review report' });
        }
    }

    static async suspendUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await AdminService.suspendUser(req.params.id as string, req.userId!);
            res.status(200).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to suspend user' });
        }
    }

    static async banUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await AdminService.banUser(req.params.id as string, req.userId!);
            res.status(200).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to ban user' });
        }
    }

    static async deleteMessage(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await AdminService.deleteMessage(req.params.id as string, req.userId!);
            res.status(200).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to delete message' });
        }
    }

    static async getAuditLogs(req: AuthRequest, res: Response): Promise<void> {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const result = await AdminService.getAuditLogs(page);
            res.status(200).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to get audit logs' });
        }
    }
}
