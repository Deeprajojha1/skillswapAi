import { Queue } from 'bullmq';
import { getRedis } from '../config/redis.js';

function createQueue(name) {
  return new Queue(name, {
    connection: getRedis(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: 100,
      removeOnFail: 200,
    },
  });
}

export const bookingQueue = createQueue('booking-events');
export const notificationQueue = createQueue('notifications');
export const emailQueue = createQueue('emails');
export const paymentQueue = createQueue('payments');

export async function safeAdd(queue, name, data, fallback) {
  try {
    return await queue.add(name, data);
  } catch (error) {
    console.warn(`Queue ${name} unavailable, running fallback:`, error.message);
    return fallback?.(data);
  }
}
