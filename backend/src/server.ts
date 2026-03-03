import http from 'http';
import app from './app';
import { env } from './config/env';
import { initSocketIO } from './socket/socket';
import { dbConnect } from './config/prisma';

const server = http.createServer(app);

// Initialize Socket.IO
initSocketIO(server);

server.listen(env.PORT, async () => {
    await dbConnect();
    console.log(`🚀 Server running on port ${env.PORT}`);
    console.log(`📡 Environment: ${env.NODE_ENV}`);
    console.log(`🔗 API: http://localhost:${env.PORT}/api/v1`);
});

export default server;
