import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser, updateCurrentUser } from './userApi.js';
import { QUERY_KEYS } from '../../lib/constants.js';
import { toastSuccess } from '../../services/toast.js';

/**
 * Resolves the demo user for whichever role is currently selected (Client/
 * Creator tab — see Navbar/MobileNav). There's no login any more, so this
 * always succeeds. Consumed by `AuthProvider` to sync the result into
 * `authSlice`, and re-run whenever the role tab changes.
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEYS.currentUser,
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (user) => {
      queryClient.setQueryData(QUERY_KEYS.currentUser, user);
      toastSuccess('Profile updated.');
    },
  });
}
