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

  // ── Auto-Recovery for Supabase Deadlocks ──
  // If the error is our injected timeout, gotrue-js is likely deadlocked.
  // The ONLY way to recover a locked client is a hard reload.
  if (message.includes('timeout')) {
    if (typeof window !== 'undefined') {
      const lastReload = sessionStorage.getItem('last_timeout_reload');
      const now = Date.now();
      // Prevent infinite reload loops (max 1 reload per 10 seconds)
      if (!lastReload || now - parseInt(lastReload) > 10000) {
        sessionStorage.setItem('last_timeout_reload', now.toString());
        console.warn('[Auto-Recovery] Supabase request timeout. Force reloading page to clear deadlock...');
        window.location.reload();
      }
    }
    return false; // Don't retry, we are reloading
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
