export default function registerBookingSocket(_io, socket) {
  socket.on('booking:watch', (bookingId) => {
    if (bookingId) socket.join(`booking:${bookingId}`);
  });
}
