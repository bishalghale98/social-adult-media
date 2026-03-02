import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { ChatService } from './chat.service';

export class ChatController {
    static async getConversations(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await ChatService.getConversations(req.userId!);
            res.status(200).json(result);
        } catch {
            res.status(500).json({ error: 'Failed to get conversations' });
        }
    }

    static async getMessages(req: AuthRequest, res: Response): Promise<void> {
        try {
            const cursor = req.query.cursor as string | undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
            const result = await ChatService.getMessages(
                req.params.id as string,
                req.userId!,
                cursor,
                limit
            );
            res.status(200).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : '';
            if (message === 'Conversation not found') {
                res.status(404).json({ error: message });
                return;
            }
            res.status(500).json({ error: 'Failed to get messages' });
        }
    }

    static async sendMessage(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await ChatService.sendMessage(
                req.params.id as string,
                req.userId!,
                req.body.bodyText
            );
            res.status(201).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : '';
            if (message === 'Conversation not found' || message === 'Cannot send message to this user') {
                res.status(400).json({ error: message });
                return;
            }
            res.status(500).json({ error: 'Failed to send message' });
        }
    }
}
