export default function registerPaymentSocket(_io, socket) {
  socket.on('payment:watch', (paymentId) => {
    if (paymentId) socket.join(`payment:${paymentId}`);
  });
}
