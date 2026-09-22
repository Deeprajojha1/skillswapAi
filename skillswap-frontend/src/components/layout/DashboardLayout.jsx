import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../app/store/slices/authSlice.js';
import { getDashboardNavItems } from './Sidebar.jsx';
import Sidebar from './Sidebar.jsx';
import PageContainer from './PageContainer.jsx';
import { cn } from '../../utils/helpers.js';

/**
 * Shared chrome for every authenticated "app" page (dashboards, bookings,
 * notifications, profile). Desktop gets a persistent sidebar; mobile gets a
 * fixed bottom tab bar instead of trying to squeeze a sidebar onto a small
 * screen.
 */
export default function DashboardLayout({ children, title, description, actions }) {
  const user = useSelector(selectCurrentUser);
  const items = getDashboardNavItems(user?.role).slice(0, 4);

  return (
    <div className="flex flex-1">
      <Sidebar role={user?.role} />
      <div className="min-w-0 flex-1 pb-20 lg:pb-0">
        <PageContainer>
          {(title || actions) && (
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {title ? <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1> : null}
                {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
              </div>
              {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
            </div>
          )}
          {children}
        </PageContainer>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 flex items-stretch justify-around border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Primary"
      >
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium',
                isActive ? 'text-indigo-700' : 'text-slate-500',
              )
            }
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
