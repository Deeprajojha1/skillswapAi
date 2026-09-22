import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import { selectCurrentUser } from '../../app/store/slices/authSlice.js';
import { setMobileNavOpen } from '../../app/store/slices/uiSlice.js';
import { ROUTES, USER_ROLES } from '../../lib/constants.js';
import { useRoleSwitch } from '../../hooks/useRoleSwitch.js';
import { cn } from '../../utils/helpers.js';
import { getDashboardNavItems } from './Sidebar.jsx';
import Avatar from '../ui/Avatar.jsx';

/**
 * There's no login/logout any more — just a Client/Creator switch (mirrors
 * the one in `Navbar`; both go through `useRoleSwitch`, which persists the
 * choice and notifies `AuthProvider` to refetch the demo user for it).
 */
export default function MobileNav({ open }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isCreator = user?.role === USER_ROLES.CREATOR;
  const doSwitchRole = useRoleSwitch();

  const close = () => dispatch(setMobileNavOpen(false));

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const items = getDashboardNavItems(user?.role);

  function switchRole(role) {
    close();
    doSwitchRole(role);
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/50"
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <span className="text-sm font-semibold text-slate-900">Menu</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 border-b border-slate-100 p-4">
              <Avatar name={user?.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
                <p className="truncate text-xs capitalize text-slate-500">{user?.role || 'client'} mode</p>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 mx-4 mt-4">
              <button
                type="button"
                onClick={() => switchRole(USER_ROLES.CLIENT)}
                className={cn(
                  'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition',
                  !isCreator ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600',
                )}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => switchRole(USER_ROLES.CREATOR)}
                className={cn(
                  'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition',
                  isCreator ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600',
                )}
              >
                Creator
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              <NavLink
                to={ROUTES.marketplace}
                onClick={close}
                className={({ isActive }) =>
                  cn(
                    'block rounded-lg px-3 py-2.5 text-sm font-medium',
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50',
                  )
                }
              >
                Marketplace
              </NavLink>
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={close}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50',
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
