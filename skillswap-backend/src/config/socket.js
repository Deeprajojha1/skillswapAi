import { Server } from 'socket.io';
import { env } from './env.js';
import registerSockets from '../sockets/index.js';
import { setSocketServer } from '../services/socket.service.js';

export function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.clientUrl, credentials: true },
  });
  registerSockets(io);
  setSocketServer(io);
  return io;
}
