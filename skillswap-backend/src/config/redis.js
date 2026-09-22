import IORedis from 'ioredis';
import { env } from './env.js';

let redis;

export function getRedis() {
  if (!redis) {
    redis = new IORedis(env.redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
      enableOfflineQueue: false,
    });
    redis.on('error', (error) => {
      console.warn('Redis unavailable:', error.message);
    });
  }
  return redis;
}

export async function closeRedis() {
  if (redis) await redis.quit();
}
