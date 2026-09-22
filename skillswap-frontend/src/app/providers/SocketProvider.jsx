import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { selectCurrentUser, selectIsAuthenticated } from '../store/slices/authSlice.js';
import { triggerPulse } from '../store/slices/notificationSlice.js';
import { connectSocket, disconnectSocket } from '../../services/socket.js';
import { QUERY_KEYS } from '../../lib/constants.js';
import { toastInfo, toastSuccess, toastWarning } from '../../services/toast.js';

/**
 * Owns the realtime connection lifecycle and translates every backend socket
 * event into the two things the rest of the app cares about: an
 * invalidated React Query cache entry, and a toast. No component ever talks
 * to the socket directly for reads — React Query remains the single source
 * of truth for server data, this provider just tells it when to refetch.
 */
export default function SocketProvider({ children }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      disconnectSocket();
      return undefined;
    }

    const socket = connectSocket(userId);
    if (!socket) return undefined;

    const invalidate = (keys) => keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));

    const handlers = {
      'notification:new': (notification) => {
        invalidate([QUERY_KEYS.notifications, QUERY_KEYS.unreadNotifications]);
        dispatch(triggerPulse());
        toastInfo(notification?.title || 'You have a new notification.');
      },
      'booking:new': (payload) => {
        invalidate([['incomingBookings'], QUERY_KEYS.booking(payload?.bookingId)]);
        toastInfo(payload?.message || 'New booking request received.');
      },
      'booking:accepted': (payload) => {
        invalidate([['myBookings'], QUERY_KEYS.booking(payload?.bookingId), ['gigs']]);
        toastSuccess('Your booking was accepted.');
      },
      'booking:declined': (payload) => {
        invalidate([['myBookings'], QUERY_KEYS.booking(payload?.bookingId)]);
        toastWarning('Your booking was declined.');
      },
      'booking:cancelled': (payload) => {
        invalidate([['myBookings'], ['incomingBookings'], QUERY_KEYS.booking(payload?.bookingId), ['gigs']]);
        toastInfo('A booking was cancelled.');
      },
      'booking:completed': (payload) => {
        invalidate([['myBookings'], QUERY_KEYS.booking(payload?.bookingId)]);
        toastSuccess('Booking marked as completed.');
      },
      'payment:created': (payload) => {
        invalidate([QUERY_KEYS.booking(payload?.bookingId)]);
      },
      'payment:success': (payload) => {
        invalidate([QUERY_KEYS.booking(payload?.bookingId), ['myBookings'], ['incomingBookings']]);
        toastSuccess('Payment received.');
      },
    };

    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => socket.off(event, handler));
    };
  }, [isAuthenticated, userId, dispatch, queryClient]);

  return children;
}
