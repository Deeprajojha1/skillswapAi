import registerBookingSocket from './booking.socket.js';
import registerNotificationSocket from './notification.socket.js';
import registerPaymentSocket from './payment.socket.js';

export default function registerSockets(io) {
  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (userId) socket.join(`user:${userId}`);
    registerBookingSocket(io, socket);
    registerNotificationSocket(io, socket);
    registerPaymentSocket(io, socket);
  });
}
