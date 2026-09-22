import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from './notificationApi.js';
import { QUERY_KEYS } from '../../lib/constants.js';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../app/store/slices/authSlice.js';

export function useNotifications() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: fetchNotifications,
    enabled: isAuthenticated,
  });
}

export function useUnreadNotifications() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return useQuery({
    queryKey: QUERY_KEYS.unreadNotifications,
    queryFn: fetchUnreadCount,
    enabled: isAuthenticated,
    staleTime: 15 * 1000,
  });
}

function invalidateNotificationQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.unreadNotifications });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
}
