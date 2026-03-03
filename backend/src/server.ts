import http from 'http';
import cron from 'node-cron';
import app from './app';
import { env } from './config/env';
import { initSocketIO } from './socket/socket';
import { dbConnect } from './config/prisma';
import { runMessageRetentionCleanup } from './modules/jobs/retention.job';

const server = http.createServer(app);

// Initialize Socket.IO
initSocketIO(server);

server.listen(env.PORT, async () => {
    await dbConnect();
    console.log(`🚀 Server running on port ${env.PORT}`);
    console.log(`📡 Environment: ${env.NODE_ENV}`);
    console.log(`🔗 API: http://localhost:${env.PORT}/api/v1`);

    // Schedule daily message retention cleanup at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('[Cron] Running message retention cleanup...');
        try {
            await runMessageRetentionCleanup();
        } catch (error) {
            console.error('[Cron] Retention cleanup failed:', error);
        }
    });
    console.log('🗑️  Retention cleanup scheduled (daily at midnight)');
});

export default server;
