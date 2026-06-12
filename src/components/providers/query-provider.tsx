"use client";

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/**
 * Smart retry function: retries transient errors but not auth errors.
 * - Retries: network failures, 5xx, connection resets, aborts after idle
 * - Does NOT retry: 401, 403, 404, validation errors
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 3) return false;

  const message = error instanceof Error ? error.message.toLowerCase() : '';

  // Don't retry auth or permission errors
  if (
    message.includes('jwt') ||
    message.includes('unauthorized') ||
    message.includes('forbidden') ||
    message.includes('not found') ||
    message.includes('row-level security') ||
    message.includes('permission') ||
    message.includes('invalid') ||
    message.includes('pgrst')  // PostgREST specific errors
  ) {
    return false;
  }

  // Retry everything else (network, timeout, 5xx, abort, etc.)
  return true;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 2,        // 2 minutes
            gcTime: 1000 * 60 * 10,           // 10 minutes garbage collection
            retry: shouldRetry,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // exponential backoff: 1s, 2s, 4s (capped at 10s)
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
