import { Worker } from 'bullmq';
import { getRedis } from '../config/redis.js';
import { sendEmail } from '../services/email.service.js';

export const emailWorker = new Worker(
  'emails',
  async (job) => sendEmail(job.data),
  { connection: getRedis() },
);
