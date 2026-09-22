import { NavLink } from 'react-router-dom';
import {
  Bell,
  Briefcase,
  CalendarCheck,
  LayoutDashboard,
  PlusCircle,
  ShoppingBag,
  User,
} from 'lucide-react';
import { ROUTES, USER_ROLES } from '../../lib/constants.js';
import { cn } from '../../utils/helpers.js';

/** Single source of truth for role-based dashboard navigation — reused by
 * both the desktop Sidebar and the mobile drawer/bottom nav so the link set
 * never drifts between the two. */
export function getDashboardNavItems(role) {
  if (role === USER_ROLES.CREATOR) {
    return [
      { to: ROUTES.creatorDashboard, label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: ROUTES.creatorGigs, label: 'My Gigs', icon: Briefcase },
      { to: ROUTES.creatorNewGig, label: 'Create Gig', icon: PlusCircle },
      { to: ROUTES.creatorBookings, label: 'Bookings', icon: CalendarCheck },
      { to: ROUTES.creatorNotifications, label: 'Notifications', icon: Bell },
      { to: ROUTES.profile, label: 'Profile', icon: User },
    ];
  }

  return [
    { to: ROUTES.marketplace, label: 'Marketplace', icon: ShoppingBag },
    { to: ROUTES.clientBookings, label: 'My Bookings', icon: CalendarCheck },
    { to: ROUTES.clientNotifications, label: 'Notifications', icon: Bell },
    { to: ROUTES.profile, label: 'Profile', icon: User },
  ];
}

export default function Sidebar({ role }) {
  const items = getDashboardNavItems(role);

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-slate-200 bg-white lg:block">
      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )
            }
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
