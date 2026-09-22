import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { emailQueue, notificationQueue, safeAdd } from '../queues/index.js';
import { sendEmail } from './email.service.js';
import { emitToUser } from './socket.service.js';

export async function createNotification(payload) {
  const notification = await Notification.create({
    user: payload.userId,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    booking: payload.bookingId ?? null,
    gig: payload.gigId ?? null,
    payment: payload.paymentId ?? null,
  });

  emitToUser(payload.userId, 'notification:new', notification);
  if (payload.socketEvent) emitToUser(payload.userId, payload.socketEvent, payload);
  return notification;
}

export async function queueNotification(payload) {
  const notification = await createNotification(payload);
  await safeAdd(notificationQueue, payload.type, { ...payload, alreadyPersisted: true }, async () => notification);
  if (payload.email !== false) {
    const user = await User.findById(payload.userId);
    await queueEmail({
      to: user?.email,
      subject: payload.title,
      text: payload.message,
      html: `<p>${payload.message}</p>`,
    });
  }
  return notification;
}

export async function queueEmail(payload) {
  return safeAdd(emailQueue, 'email:send', payload, sendEmail);
}

export async function processNotificationJob(data) {
  if (data.alreadyPersisted) return data;
  const notification = await createNotification(data);
  if (data.email !== false) {
    const user = await User.findById(data.userId);
    await queueEmail({
      to: user?.email,
      subject: data.title,
      text: data.message,
      html: `<p>${data.message}</p>`,
    });
  }
  return notification;
}

export function listNotifications(userId) {
  return Notification.find({ user: userId }).sort({ createdAt: -1 });
}

export function unreadCount(userId) {
  return Notification.countDocuments({ user: userId, isRead: false });
}

export async function markNotificationRead(id, userId) {
  return Notification.findOneAndUpdate({ _id: id, user: userId }, { isRead: true }, { new: true });
}

export function markAllNotificationsRead(userId) {
  return Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
}
