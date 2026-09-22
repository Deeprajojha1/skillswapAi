import apiClient from '../../services/apiClient.js';

// GET /api/notifications
export async function fetchNotifications() {
  const { data } = await apiClient.get('/notifications');
  return data.data;
}

// GET /api/notifications/unread-count -> { count }
export async function fetchUnreadCount() {
  const { data } = await apiClient.get('/notifications/unread-count');
  return data.data;
}

// PATCH /api/notifications/:id/read
export async function markNotificationRead(notificationId) {
  const { data } = await apiClient.patch(`/notifications/${notificationId}/read`);
  return data.data;
}

// PATCH /api/notifications/read-all
export async function markAllNotificationsRead() {
  const { data } = await apiClient.patch('/notifications/read-all');
  return data.data;
}
