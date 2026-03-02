import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { FriendsService } from './friends.service';

export class FriendsController {
    static async sendRequest(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await FriendsService.sendRequest(req.userId!, req.body.receiverId);
            res.status(201).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            const clientErrors = [
                'Cannot send request to yourself',
                'Cannot send request to this user',
                'Already friends',
                'A pending request already exists',
            ];
            if (clientErrors.includes(message)) {
                res.status(400).json({ error: message });
                return;
            }
            res.status(500).json({ error: 'Failed to send request' });
        }
    }

    static async getIncoming(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await FriendsService.getIncomingRequests(req.userId!);
            res.status(200).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to get requests' });
        }
    }

    static async getOutgoing(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await FriendsService.getOutgoingRequests(req.userId!);
            res.status(200).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to get requests' });
        }
    }

    static async accept(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await FriendsService.acceptRequest(req.params.id as string, req.userId!);
            res.status(200).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to accept request';
            res.status(400).json({ error: message });
        }
    }

    static async reject(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await FriendsService.rejectRequest(req.params.id as string, req.userId!);
            res.status(200).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to reject request';
            res.status(400).json({ error: message });
        }
    }

    static async cancel(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await FriendsService.cancelRequest(req.params.id as string, req.userId!);
            res.status(200).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to cancel request';
            res.status(400).json({ error: message });
        }
    }

    static async getFriends(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await FriendsService.getFriends(req.userId!);
            res.status(200).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to get friends' });
        }
    }
}
