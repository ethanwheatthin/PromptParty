import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySocketIO from 'fastify-socket.io';
import { Server as SocketIOServer } from 'socket.io';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { registerSocketHandlers } from './sockets/handlers';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const NODE_ENV = process.env.NODE_ENV || 'development';

export const prisma = new PrismaClient({
  log: NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const redis = new Redis(REDIS_URL);

const server = Fastify({
  logger: {
    level: NODE_ENV === 'development' ? 'info' : 'warn',
  },
});

// Register CORS
void server.register(fastifyCors, {
  origin: NODE_ENV === 'development' ? '*' : process.env.FRONTEND_URL,
  credentials: true,
});

// Register Socket.IO
void server.register(fastifySocketIO, {
  cors: {
    origin: NODE_ENV === 'development' ? '*' : process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Health check endpoint
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register socket handlers after server is ready
server.ready((err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }

  const io: SocketIOServer = server.io;
  registerSocketHandlers(io);
  server.log.info('Socket.IO handlers registered');
});

async function start(): Promise<void> {
  try {
    // Test database connection
    await prisma.$connect();
    server.log.info('Database connected');

    // Test Redis connection
    await redis.ping();
    server.log.info('Redis connected');

    await server.listen({ port: PORT, host: '0.0.0.0' });
    server.log.info(`Server listening on port ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

// Graceful shutdown
const gracefulShutdown = async (): Promise<void> => {
  server.log.info('Shutting down gracefully...');
  await server.close();
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
};

process.on('SIGTERM', () => void gracefulShutdown());
process.on('SIGINT', () => void gracefulShutdown());

// Start server
void start();
