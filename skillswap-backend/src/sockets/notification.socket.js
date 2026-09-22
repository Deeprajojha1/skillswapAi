export default function registerNotificationSocket(_io, socket) {
  socket.on('notification:read', (notificationId) => {
    socket.emit('notification:ack', { notificationId });
  });
}
