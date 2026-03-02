import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import prisma from '../config/prisma';

export interface AuthRequest extends Request {
    userId?: string;
    userRole?: string;
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as {
            userId: string;
            role: string;
        };

        // Check user still exists and is active
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true, status: true },
        });

        if (!user || user.status === 'BANNED' || user.status === 'SUSPENDED') {
            res.status(403).json({ error: 'Account is not active' });
            return;
        }

        req.userId = decoded.userId;
        req.userRole = user.role;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
