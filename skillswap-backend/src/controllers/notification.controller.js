import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  unreadCount,
} from '../services/notification.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const getNotifications = asyncHandler(async (req, res) => {
  sendSuccess(res, await listNotifications(req.user.id));
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  sendSuccess(res, { count: await unreadCount(req.user.id) });
});

export const readNotification = asyncHandler(async (req, res) => {
  sendSuccess(res, await markNotificationRead(req.params.id, req.user.id), 'Notification marked read');
});

export const readAllNotifications = asyncHandler(async (req, res) => {
  sendSuccess(res, await markAllNotificationsRead(req.user.id), 'Notifications marked read');
});
