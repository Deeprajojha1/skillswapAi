import Notification from '../models/Notification.js';
import { emitToUser } from './socket.service.js';

// In-app notifications only: persist to the DB and push over the socket.
// (Email sending and the BullMQ/Redis queue layer that used to sit in
// front of it have been removed.)
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

// Kept as the call site's name across the codebase (booking/payment
// services call `queueNotification`) even though nothing is queued
// anymore — it just creates the notification directly.
export const queueNotification = createNotification;

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
