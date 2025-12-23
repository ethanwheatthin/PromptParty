import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyToken, generateToken } from '../services/auth';
import { redis } from '../server';

interface AuthPayload {
  token?: string;
  displayName?: string;
  roomId?: string;
  joinCode?: string;
}

interface SocketWithAuth extends Socket {
  playerId?: string;
  roomId?: string;
}

export function registerSocketHandlers(io: SocketIOServer): void {
  io.on('connection', (socket: SocketWithAuth) => {
    console.log('Client connected:', socket.id);

    // Auth handler - must be called first
    socket.on('auth', async (payload: AuthPayload, callback) => {
      try {
        let playerId: string | undefined;
        let roomId: string | undefined;

        // If token provided, verify it
        if (payload.token) {
          const decoded = verifyToken(payload.token);
          playerId = decoded.playerId;
          roomId = decoded.roomId;
        }

        // For now, just accept the auth and return placeholder data
        // Full implementation will come in later PRs
        socket.playerId = playerId;
        socket.roomId = roomId;

        // Store presence in Redis
        if (playerId && roomId) {
          await redis.setex(`presence:${roomId}:${playerId}`, 300, socket.id);
        }

        callback({
          success: true,
          playerId,
          roomId,
          roomState: {
            players: [],
            currentRound: null,
            phase: 'waiting',
          },
        });
      } catch (error) {
        console.error('Auth error:', error);
        callback({
          success: false,
          error: 'Authentication failed',
        });
      }
    });

    // Placeholder for other socket events
    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);
      
      // Remove presence from Redis
      if (socket.playerId && socket.roomId) {
        await redis.del(`presence:${socket.roomId}:${socket.playerId}`);
      }
    });
  });
}
