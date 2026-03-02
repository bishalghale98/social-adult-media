import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors';
import { generalLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';

// Module routes
import authRoutes from './modules/auth/auth.routes';
import profileRoutes from './modules/profile/profile.routes';
import discoveryRoutes from './modules/discovery/discovery.routes';
import friendsRoutes from './modules/friends/friends.routes';
import chatRoutes from './modules/chat/chat.routes';
import blocksRoutes from './modules/blocks/blocks.routes';
import reportsRoutes from './modules/reports/reports.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();

// Global middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);

// Legal disclaimer header
app.use((_req, res, next) => {
    res.setHeader(
        'X-Platform-Disclaimer',
        'This platform only provides communication tools. Users are solely responsible for their interactions, decisions, and offline activities.'
    );
    next();
});

// Health check
app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', profileRoutes);
app.use('/api/v1', discoveryRoutes);
app.use('/api/v1/friends', friendsRoutes);
app.use('/api/v1/conversations', chatRoutes);
app.use('/api/v1/blocks', blocksRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/admin', adminRoutes);

// Global error handler
app.use(errorHandler);

export default app;
