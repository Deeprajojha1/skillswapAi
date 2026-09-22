import { Worker } from 'bullmq';
import { getRedis } from '../config/redis.js';

export const bookingWorker = new Worker(
  'booking-events',
  async (job) => {
    console.log('Processed booking event', job.data);
  },
  { connection: getRedis() },
);
