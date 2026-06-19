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
  if (failureCount >= 1) return false;

  const message = error instanceof Error ? error.message.toLowerCase() : '';

  // ── Timeout errors: do NOT reload the page ──
  // A hard reload destroys the React Query cache causing full skeleton flash.
  // Instead, let the query fail gracefully so the user sees an error state
  // with a "Coba Lagi" button that refetches without losing other cached data.
  if (message.includes('timeout') || message.includes('took too long') || message.includes('aborted')) {
    console.warn('[Query] Request timeout — letting query fail gracefully (no reload)');
    return false;
  }

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

  // Retry everything else (network, 5xx, abort, etc.)
  return true;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,        // 5 minutes — data stays fresh longer, avoids skeleton on navigation
            gcTime: 1000 * 60 * 30,           // 30 minutes garbage collection — keeps cache warm for background return
            retry: shouldRetry,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000), // exponential backoff: 1s, 2s, 4s (capped at 10s)
            // Disabled: RecoveryManager centralises tab-visible/reconnect recovery.
            // Keeping these on caused double-refetch which triggered isPending=true
            // and showed a skeleton flash every time the user switched back to the tab.
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
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
