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

    static async getReportDetail(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await AdminService.getReportDetail(
                req.params.id as string,
                req.userId!
            );
            res.status(200).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : '';
            if (message === 'Report not found') {
                res.status(404).json({ error: message });
                return;
            }
            if (message === 'Report is closed') {
                res.status(403).json({ error: message });
                return;
            }
            res.status(500).json({ error: 'Failed to get report detail' });
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

    static async closeReport(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await AdminService.closeReport(req.params.id as string, req.userId!);
            res.status(200).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to close report' });
        }
    }

    static async warnUser(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { reportId } = req.body;
            const result = await AdminService.warnUser(
                req.params.id as string,
                req.userId!,
                reportId
            );
            res.status(200).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to warn user' });
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
