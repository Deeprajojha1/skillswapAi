import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckCheck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import NotificationList from '../../components/notifications/NotificationList.jsx';
import Button from '../../components/ui/Button.jsx';
import { useMarkAllNotificationsRead, useNotifications } from '../../features/notifications/notificationHooks.js';
import { selectCurrentUser } from '../../app/store/slices/authSlice.js';
import { ROUTES, USER_ROLES } from '../../lib/constants.js';

/** Shared full-page notification center for /notifications,
 * /client/notifications, and /creator/notifications. */
export default function Notifications() {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isCreator = user?.role === USER_ROLES.CREATOR;

  const { data: notifications, isLoading, isError, error, refetch } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();
  const hasUnread = notifications?.some((n) => !n.isRead);

  function handleNavigate(notification) {
    if (notification.booking) {
      navigate(
        isCreator ? ROUTES.creatorBookingDetails(notification.booking) : ROUTES.clientBookingDetails(notification.booking),
      );
    }
  }

  return (
    <DashboardLayout
      title="Notifications"
      description="Booking and payment updates."
      actions={
        <Button
          variant="secondary"
          size="sm"
          icon={CheckCheck}
          onClick={() => markAllRead.mutate()}
          disabled={!hasUnread}
          isLoading={markAllRead.isPending}
          loadingText="Marking…"
        >
          Mark all read
        </Button>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <NotificationList
          notifications={notifications}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          onNavigate={handleNavigate}
        />
      </div>
    </DashboardLayout>
  );
}
