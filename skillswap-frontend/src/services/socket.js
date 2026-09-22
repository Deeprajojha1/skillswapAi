import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

/**
 * Connects the realtime socket for a given user. The backend does NOT
 * authenticate sockets via the HTTP-only cookie — it reads
 * `socket.handshake.auth.userId` directly (see
 * skillswap-backend/src/sockets/index.js) and joins the socket to a
 * `user:{userId}` room. We only ever connect once `GET /users/me` has
 * resolved, so this is safe: the userId still came from the authenticated
 * backend response, not from anything the client invented.
 */
export function connectSocket(userId) {
  if (!userId) return null;

  if (socket?.connected && socket.auth?.userId === userId) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    autoConnect: true,
    withCredentials: true,
    auth: { userId },
    transports: ['websocket', 'polling'],
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
