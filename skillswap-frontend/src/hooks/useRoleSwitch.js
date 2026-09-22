import { useNavigate } from 'react-router-dom';
import { ROLE_CHANGED_EVENT, ROLE_STORAGE_KEY, ROUTES, USER_ROLES } from '../lib/constants.js';

/** Returns a `switchRole(role)` function: persists the choice, notifies
 * AuthProvider to refetch the demo user for it, and navigates to that
 * role's home screen. Used by Navbar, MobileNav, and the Landing page CTAs. */
export function useRoleSwitch() {
  const navigate = useNavigate();

  return function switchRole(role) {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    window.dispatchEvent(new Event(ROLE_CHANGED_EVENT));
    navigate(role === USER_ROLES.CREATOR ? ROUTES.creatorDashboard : ROUTES.marketplace);
  };
}
