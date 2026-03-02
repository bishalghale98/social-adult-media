import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../middleware/auth';

export class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const result = await AuthService.register(req.body);
            res.status(201).json(result);
        } catch (error: any) {
            if (
                error.message === 'Email already registered' ||
                error.message === 'Username already taken'
            ) {
                res.status(409).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Registration failed' });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const result = await AuthService.login(req.body);
            res.status(200).json(result);
        } catch (error: any) {
            if (
                error.message === 'Invalid email or password' ||
                error.message === 'Your account has been banned' ||
                error.message === 'Your account has been suspended'
            ) {
                res.status(401).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Login failed' });
        }
    }

    static async refresh(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;
            const result = await AuthService.refresh(refreshToken);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: 'Invalid refresh token' });
        }
    }

    static async logout(_req: Request, res: Response): Promise<void> {
        // Client should discard tokens. If using a token blacklist, add logic here.
        res.status(200).json({ message: 'Logged out successfully' });
    }

    static async acceptConsent(req: AuthRequest, res: Response): Promise<void> {
        try {
            const result = await AuthService.acceptConsent(req.userId!);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to accept consent' });
        }
    }
}
