import { QueryClient } from '@tanstack/react-query';

function shouldRetry(failureCount, error) {
  const status = error?.status;
  // Never retry validation / auth / permission / not-found / conflict errors.
  if (status && status >= 400 && status < 500) return false;
  // Retry network errors and 5xx a couple of times.
  return failureCount < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: shouldRetry,
    },
    mutations: {
      retry: false,
    },
  },
});
