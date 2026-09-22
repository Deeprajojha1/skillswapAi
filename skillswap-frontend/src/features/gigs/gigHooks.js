import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createGig, deleteGig, fetchGig, fetchGigs, fetchMyGigs, fetchSimilarGigs, updateGig } from './gigApi.js';
import { QUERY_KEYS } from '../../lib/constants.js';
import { toastSuccess } from '../../services/toast.js';

// The backend has no `sort` query param (see gigQuerySchema — only
// search/category), so sorting is applied client-side over the already
// server-filtered result set via React Query's `select`, which is cheap and
// does not trigger a refetch when only the sort order changes.
function sortGigs(gigs, sort) {
  if (!Array.isArray(gigs)) return gigs;
  const copy = [...gigs];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.rate - b.rate);
    case 'price-desc':
      return copy.sort((a, b) => b.rate - a.rate);
    case 'newest':
    default:
      return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

export function useGigs({ search = '', category = '', sort = 'newest' } = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.gigs({ search, category }),
    queryFn: () => fetchGigs({ search, category }),
    select: (data) => sortGigs(data, sort),
    placeholderData: (previousData) => previousData,
    refetchOnMount: 'always',
  });
}

export function useGig(gigId) {
  return useQuery({
    queryKey: QUERY_KEYS.gig(gigId),
    queryFn: () => fetchGig(gigId),
    enabled: Boolean(gigId),
  });
}

export function useSimilarGigs(gigId) {
  return useQuery({
    queryKey: QUERY_KEYS.similarGigs(gigId),
    queryFn: () => fetchSimilarGigs(gigId),
    enabled: Boolean(gigId),
  });
}

export function useMyGigs() {
  return useQuery({
    queryKey: QUERY_KEYS.myGigs,
    queryFn: fetchMyGigs,
  });
}

export function useCreateGig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myGigs });
      toastSuccess('Gig published successfully.');
    },
  });
}

export function useUpdateGig(gigId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => updateGig(gigId, payload),
    onSuccess: (gig) => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myGigs });
      queryClient.setQueryData(QUERY_KEYS.gig(gigId), gig);
      toastSuccess('Gig updated successfully.');
    },
  });
}

export function useDeleteGig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gigs'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myGigs });
      toastSuccess('Gig deleted successfully.');
    },
  });
}
