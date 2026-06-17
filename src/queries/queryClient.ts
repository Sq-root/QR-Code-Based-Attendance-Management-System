import { QueryClient } from '@tanstack/react-query';

// Configure TanStack Query Client with optimal development & production configurations
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent refetching when user toggles browser window tabs
      retry: 1, // Only retry failed requests once
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes before becoming stale
      gcTime: 1000 * 60 * 10, // Keep unused query data in garbage collector cache for 10 minutes
    },
    mutations: {
      retry: false, // Do not retry mutation operations (POST/PUT/DELETE)
    },
  },
});
