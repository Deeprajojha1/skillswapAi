import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import Dropdown from '../ui/Dropdown.jsx';
import NotificationDropdown from './NotificationDropdown.jsx';
import { useUnreadNotifications } from '../../features/notifications/notificationHooks.js';
import { selectCurrentUser } from '../../app/store/slices/authSlice.js';
import { clearPulse, selectHasNewPulse } from '../../app/store/slices/notificationSlice.js';
import { ROUTES, USER_ROLES } from '../../lib/constants.js';

export default function NotificationBell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const hasNewPulse = useSelector(selectHasNewPulse);
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useUnreadNotifications();
  const unreadCount = data?.count ?? 0;

  const isCreator = user?.role === USER_ROLES.CREATOR;
  const notificationsRoute = isCreator ? ROUTES.creatorNotifications : ROUTES.clientNotifications;

  useEffect(() => {
    if (hasNewPulse) {
      const timer = setTimeout(() => dispatch(clearPulse()), 1200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [hasNewPulse, dispatch]);

  function handleNavigate(notification) {
    setIsOpen(false);
    if (notification.booking) {
      navigate(
        isCreator ? ROUTES.creatorBookingDetails(notification.booking) : ROUTES.clientBookingDetails(notification.booking),
      );
    } else {
      navigate(notificationsRoute);
    }
  }

  return (
    <Dropdown
      align="right"
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <button
          type="button"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
          className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100"
        >
          <motion.span animate={hasNewPulse ? { scale: [1, 1.25, 1] } : {}} transition={{ duration: 0.5 }}>
            <Bell className="h-5 w-5" />
          </motion.span>
          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : null}
        </button>
      }
    >
      <NotificationDropdown onNavigate={handleNavigate} notificationsRoute={notificationsRoute} />
    </Dropdown>
  );
}
