import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { DiscoveryService } from './discovery.service';

export class DiscoveryController {
    static async search(req: AuthRequest, res: Response): Promise<void> {
        try {
            const filters = {
                gender: req.query.gender as string,
                interestedIn: req.query.interestedIn as string,
                city: req.query.city as string,
                minAge: req.query.minAge ? parseInt(req.query.minAge as string) : undefined,
                maxAge: req.query.maxAge ? parseInt(req.query.maxAge as string) : undefined,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
            };
            const result = await DiscoveryService.searchUsers(req.userId!, filters);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: 'Discovery search failed' });
        }
    }
}
