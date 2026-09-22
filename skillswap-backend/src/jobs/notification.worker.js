import { Worker } from 'bullmq';
import { getRedis } from '../config/redis.js';
import { processNotificationJob } from '../services/notification.service.js';

export const notificationWorker = new Worker(
  'notifications',
  async (job) => {
    await processNotificationJob(job.data);
  },
  { connection: getRedis() },
);
