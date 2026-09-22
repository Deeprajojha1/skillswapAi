import { BellOff } from 'lucide-react';
import NotificationItem from './NotificationItem.jsx';
import { useMarkNotificationRead } from '../../features/notifications/notificationHooks.js';
import EmptyState from '../ui/EmptyState.jsx';
import ErrorState from '../ui/ErrorState.jsx';
import { Skeleton } from '../ui/Skeleton.jsx';
import { getErrorMessage } from '../../utils/getErrorMessage.js';
import { cn } from '../../utils/helpers.js';

export default function NotificationList({
  notifications,
  isLoading,
  isError,
  error,
  onRetry,
  onNavigate,
  compact = false,
}) {
  const markRead = useMarkNotificationRead();

  function handleClick(notification) {
    if (!notification.isRead) {
      markRead.mutate(notification._id);
    }
    onNavigate?.(notification);
  }

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <ErrorState
          title="Couldn't load notifications"
          message={getErrorMessage(error)}
          onRetry={onRetry}
          className="py-8"
        />
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <EmptyState
        icon={BellOff}
        title="No notifications yet"
        description="Booking and payment updates will show up here."
        className="border-none py-10"
      />
    );
  }

  return (
    <ul className={cn('divide-y divide-slate-100', compact && 'max-h-96 overflow-y-auto scrollbar-thin')}>
      {notifications.map((notification) => (
        <li key={notification._id}>
          <NotificationItem notification={notification} onClick={handleClick} />
        </li>
      ))}
    </ul>
  );
}
