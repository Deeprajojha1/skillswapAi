import { notificationQueue } from './index.js';

export function enqueueNotification(payload) {
  return notificationQueue.add('notification:send', payload);
}
