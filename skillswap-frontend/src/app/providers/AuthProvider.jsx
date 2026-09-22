import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useCurrentUser } from '../../features/users/userHooks.js';
import { clearUser, setUser } from '../store/slices/authSlice.js';
import { queryClient } from '../../lib/queryClient.js';
import { ROLE_CHANGED_EVENT } from '../../lib/constants.js';

/**
 * There's no login any more — this resolves the demo user for whichever
 * role is currently selected (`GET /users/me`, which the backend always
 * succeeds for) and keeps Redux's authSlice in sync with it. It also
 * refetches whenever the Client/Creator switch fires ROLE_CHANGED_EVENT, so
 * switching tabs immediately swaps in the other role's demo user.
 */
export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { data: user, isSuccess, isError, isFetched, refetch } = useCurrentUser();
  const hasSyncedOnce = useRef(false);

  useEffect(() => {
    if (!isFetched) return;
    if (isSuccess && user) {
      dispatch(setUser(user));
    } else if (isError) {
      dispatch(clearUser());
    }
    hasSyncedOnce.current = true;
  }, [isFetched, isSuccess, isError, user, dispatch]);

  useEffect(() => {
    function handleRoleChanged() {
      queryClient.clear();
      refetch();
    }

    window.addEventListener(ROLE_CHANGED_EVENT, handleRoleChanged);
    return () => window.removeEventListener(ROLE_CHANGED_EVENT, handleRoleChanged);
  }, [refetch]);

  return children;
}
