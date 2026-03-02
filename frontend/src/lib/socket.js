'use client';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export function getSocket() {
    if (!socket) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        socket = io(`${SOCKET_URL}/chat`, {
            auth: { token },
            transports: ['websocket', 'polling'],
        });
    }
    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
