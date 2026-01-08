import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query';

/**
 * Creates a new QueryClient instance with optimized defaults
 * for the Foodbook application
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 1 minute
        staleTime: 60 * 1000,

        // Unused data is garbage collected after 5 minutes
        gcTime: 5 * 60 * 1000,

        // Disable automatic refetch on window focus
        // (user can manually refresh if needed)
        refetchOnWindowFocus: false,

        // Retry logic: don't retry on 4xx errors (client errors)
        retry: (failureCount, error) => {
          // Don't retry more than 2 times
          if (failureCount >= 2) return false;

          // Don't retry on 4xx errors (client errors)
          if (error instanceof Error && 'status' in error) {
            const status = (error as any).status;
            if (status >= 400 && status < 500) return false;
          }

          // Retry on network errors and 5xx errors
          return true;
        },

        // Exponential backoff: 1s, 2s, 4s
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Don't retry mutations by default
        retry: false,
      },
      dehydrate: {
        // Include pending queries when dehydrating on the server
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  });
}

/**
 * Browser singleton pattern for QueryClient
 * On the server, always create a new instance
 */
let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always create a new QueryClient
    return makeQueryClient();
  } else {
    // Browser: use singleton pattern
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}
