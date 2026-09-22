import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsInitializing } from '../app/store/slices/authSlice.js';
import { FullScreenLoader } from '../components/ui/Spinner.jsx';

/**
 * There is no login any more — every visitor resolves to a demo user (see
 * `requireAuth` in the backend), so this no longer gates on "are you logged
 * in". It only holds the route until the initial `GET /users/me` bootstrap
 * (which resolves the current demo user for the active role) has finished,
 * so pages like Profile never render with a null user for a frame.
 */
export default function ProtectedRoute() {
  const isInitializing = useSelector(selectIsInitializing);

  if (isInitializing) return <FullScreenLoader />;

  return <Outlet />;
}
