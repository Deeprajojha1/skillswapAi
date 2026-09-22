import { Worker } from 'bullmq';
import { getRedis } from '../config/redis.js';

export const paymentWorker = new Worker(
  'payments',
  async (job) => {
    console.log('Processed payment job', {
      name: job.name,
      paymentId: job.data?.paymentId,
      bookingId: job.data?.bookingId,
    });
  },
  { connection: getRedis() },
);
