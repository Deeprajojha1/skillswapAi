import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Handshake, LayoutDashboard, Menu, User } from 'lucide-react';
import { selectCurrentUser } from '../../app/store/slices/authSlice.js';
import { toggleMobileNav } from '../../app/store/slices/uiSlice.js';
import { ROUTES, USER_ROLES } from '../../lib/constants.js';
import { useRoleSwitch } from '../../hooks/useRoleSwitch.js';
import { cn } from '../../utils/helpers.js';
import Avatar from '../ui/Avatar.jsx';
import Dropdown from '../ui/Dropdown.jsx';
import NotificationBell from '../notifications/NotificationBell.jsx';

const navLinkClass = ({ isActive }) =>
  cn(
    'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
    isActive
      ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200'
      : 'text-slate-600 hover:bg-white/80 hover:text-slate-950',
  );

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isCreator = user?.role === USER_ROLES.CREATOR;
  const switchRole = useRoleSwitch();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/[0.03] backdrop-blur">
      <nav className="mx-auto flex h-20 w-full max-w-[1500px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <div className="flex min-w-0 flex-1 items-center gap-10">
          <Link to={ROUTES.home} className="flex shrink-0 items-center gap-2 font-bold text-slate-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
              <Handshake className="h-4 w-4" />
            </span>
            <span className="text-xl tracking-tight">SkillSwap</span>
          </Link>

          <div className="hidden items-center gap-1 rounded-2xl bg-slate-100/80 p-1 md:flex">
            <NavLink to={ROUTES.marketplace} className={navLinkClass}>
              Marketplace
            </NavLink>
            {isCreator ? (
              <NavLink to={ROUTES.creatorDashboard} className={navLinkClass}>
                Dashboard
              </NavLink>
            ) : (
              <NavLink to={ROUTES.clientBookings} className={navLinkClass}>
                My Bookings
              </NavLink>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-4">
          <div className="hidden items-center rounded-2xl bg-slate-100 p-1 sm:flex">
            <button
              type="button"
              onClick={() => switchRole(USER_ROLES.CLIENT)}
              className={cn(
                'rounded-xl px-4 py-2 text-sm font-semibold transition',
                !isCreator ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900',
              )}
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => switchRole(USER_ROLES.CREATOR)}
              className={cn(
                'rounded-xl px-4 py-2 text-sm font-semibold transition',
                isCreator ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900',
              )}
            >
              Creator
            </button>
          </div>

          <NotificationBell />

          <Dropdown
            align="right"
            trigger={
              <button
                type="button"
                className="flex items-center gap-3 rounded-2xl border border-transparent bg-white px-2.5 py-2 transition hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm"
                aria-label="Open account menu"
              >
                <Avatar name={user?.name} size="sm" />
                <span className="hidden max-w-32 truncate text-sm font-semibold text-slate-700 sm:inline">
                  {user?.name?.split(' ')[0] || (isCreator ? 'Creator' : 'Client')}
                </span>
              </button>
            }
          >
            <div className="w-56 py-1.5">
              <div className="border-b border-slate-100 px-3.5 py-2.5">
                <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="truncate text-xs capitalize text-slate-500">{user?.role || 'client'} mode</p>
              </div>
              {isCreator ? (
                <Link
                  to={ROUTES.creatorDashboard}
                  className="flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
              ) : null}
              <Link
                to={ROUTES.profile}
                className="flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                <User className="h-4 w-4" /> Profile
              </Link>
            </div>
          </Dropdown>

          <button
            type="button"
            onClick={() => dispatch(toggleMobileNav())}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </header>
  );
}
