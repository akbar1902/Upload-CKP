"use client";

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';

/**
 * KeepAliveManager — prevents Supabase/Postgres cold start lag.
 *
 * Problem: Supabase uses serverless Postgres with connection pooling.
 * After ~5–10 minutes of no activity, the DB connection "sleeps".
 * The next query then takes 1–3 seconds to wake up (cold start),
 * causing skeleton flash even when the browser cache is warm.
 *
 * Solution: Send a lightweight "ping" query every 4 minutes to keep
 * the connection alive. The ping only runs when:
 *   1. The user is logged in (no unnecessary load for unauthenticated users)
 *   2. The document is visible (don't ping in background tabs)
 *   3. The browser is online
 *
 * The ping is a minimal SELECT (1 row, 1 column) designed to use
 * the minimum possible resources on the DB server.
 */
export function KeepAliveManager() {
  const { user } = useAuth();
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      // Not logged in — clear any existing interval and do nothing
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      return;
    }

    const ping = async () => {
      // Only ping when the tab is visible and the browser is online
      if (document.visibilityState !== 'visible' || !navigator.onLine) {
        return;
      }

      try {
        // Minimal query: 1 row, 1 column — negligible server load
        await supabase.from('users').select('id').eq('id', user.id).limit(1).single();
        console.debug('[KeepAlive] DB ping successful');
      } catch {
        // Ignore ping errors — they are non-critical
        // If the connection is truly dead, the next user action will handle recovery
      }
    };

    // Ping every 4 minutes (240 seconds)
    // Supabase free tier idles after ~5–10 min, so 4 min is a safe interval
    pingIntervalRef.current = setInterval(() => {
      void ping();
    }, 4 * 60 * 1000);

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    };
  }, [user, supabase]);

  // This component renders nothing — it's a pure side-effect manager
  return null;
}
