import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { ProfileService } from './profile.service';

export class ProfileController {
    static async getMe(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await ProfileService.getMyProfile(req.userId!);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    static async updateMe(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await ProfileService.updateProfile(req.userId!, req.body);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }
}
