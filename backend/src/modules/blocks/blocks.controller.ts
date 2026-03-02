import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { BlocksService } from './blocks.service';

export class BlocksController {
    static async block(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await BlocksService.blockUser(req.userId!, req.body.blockedId);
            res.status(201).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to block user';
            res.status(400).json({ error: message });
        }
    }

    static async unblock(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await BlocksService.unblockUser(req.userId!, req.params.blockedId as string);
            res.status(200).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to unblock user';
            res.status(400).json({ error: message });
        }
    }

    static async getBlocks(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await BlocksService.getBlocks(req.userId!);
            res.status(200).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to get blocks' });
        }
    }
}
