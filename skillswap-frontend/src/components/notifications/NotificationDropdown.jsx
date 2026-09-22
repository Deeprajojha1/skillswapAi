import { Link } from 'react-router-dom';
import { CheckCheck } from 'lucide-react';
import NotificationList from './NotificationList.jsx';
import { useMarkAllNotificationsRead, useNotifications } from '../../features/notifications/notificationHooks.js';
import { ROUTES } from '../../lib/constants.js';

export default function NotificationDropdown({ onNavigate, notificationsRoute }) {
  const { data: notifications, isLoading, isError, error, refetch } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();

  const hasUnread = notifications?.some((n) => !n.isRead);

  return (
    <div className="w-80 sm:w-96">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">Notifications</p>
        <button
          type="button"
          onClick={() => markAllRead.mutate()}
          disabled={!hasUnread || markAllRead.isPending}
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-40"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          {markAllRead.isPending ? 'Marking…' : 'Mark all read'}
        </button>
      </div>

      <NotificationList
        notifications={notifications}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        onNavigate={onNavigate}
        compact
      />

      <div className="border-t border-slate-100 px-4 py-2.5 text-center">
        <Link
          to={notificationsRoute || ROUTES.notifications}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
}
