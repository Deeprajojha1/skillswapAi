import { bookingQueue } from './index.js';

export function enqueueBookingEvent(payload) {
  return bookingQueue.add('booking:event', payload);
}
