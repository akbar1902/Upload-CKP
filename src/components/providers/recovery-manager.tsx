"use client";

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

/**
 * RecoveryManager — centralized idle-state recovery system.
 *
 * Handles three browser events that indicate the user has returned
 * after a period of inactivity:
 *
 *   1. visibilitychange  — tab becomes visible again
 *   2. online/offline    — network drops/reconnects (laptop sleep/wake)
 *   3. focus             — window receives focus
 *
 * On each event it:
 *   - Validates the Supabase session (refreshing if needed)
 *   - Invalidates all React Query caches so data auto-refetches
 *   - Shows toast notifications for network status changes
 */
export function RecoveryManager({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);
  const { ensureSession } = useAuth();

  const isRecoveringRef = useRef(false);
  const lastRecoveryRef = useRef(0);
  const wasOfflineRef = useRef(false);
  const offlineToastIdRef = useRef<string | number | undefined>(undefined);

  /**
   * Core recovery routine. Debounced to prevent multiple rapid firings
   * (e.g., visibilitychange + focus firing together).
   */
  const recover = useCallback(async (reason: string) => {
    // Debounce: skip if we recovered in the last 5 seconds
    const now = Date.now();
    if (now - lastRecoveryRef.current < 5000) return;
    if (isRecoveringRef.current) return;

    isRecoveringRef.current = true;
    lastRecoveryRef.current = now;

    try {
      console.log(`[Recovery] Starting recovery (reason: ${reason})`);

      // Step 1: Validate/refresh session
      let sessionValid = false;
      try {
        sessionValid = await ensureSession();
      } catch {
        console.warn('[Recovery] Session validation failed, will try to continue');
        // Don't redirect here — let the auth layer handle it
        sessionValid = true; // Assume true to allow query invalidation
      }

      if (!sessionValid) {
        console.log('[Recovery] No valid session — user will be redirected by auth');
        return;
      }

      // Step 2: Mark all React Query caches as stale.
      // We use refetchType: 'none' to avoid immediately setting isPending=true
      // (which would cause skeleton flashes). Data will be refetched in the
      // background when components next render or on user interaction.
      await queryClient.invalidateQueries({ refetchType: 'none' });
      // Trigger a background refetch without blocking the UI
      void queryClient.refetchQueries({ type: 'active', stale: true });
      console.log('[Recovery] All queries invalidated, data will refetch in background');

    } catch (err) {
      console.error('[Recovery] Recovery failed:', err);
    } finally {
      isRecoveringRef.current = false;
    }
  }, [ensureSession, queryClient]);

  useEffect(() => {
    // ── Visibility change (tab becomes visible) ────────
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void recover('tab-visible');
      }
    };

    // ── Online / Offline ───────────────────────────────
    const handleOnline = () => {
      console.log('[Recovery] Network restored');
      wasOfflineRef.current = false;

      // Dismiss offline toast if it exists
      if (offlineToastIdRef.current) {
        toast.dismiss(offlineToastIdRef.current);
        offlineToastIdRef.current = undefined;
      }

      toast.success('Koneksi internet kembali', {
        description: 'Data akan dimuat ulang secara otomatis.',
        duration: 3000,
      });

      void recover('network-online');
    };

    const handleOffline = () => {
      console.log('[Recovery] Network lost');
      wasOfflineRef.current = true;

      offlineToastIdRef.current = toast.warning('Koneksi internet terputus', {
        description: 'Beberapa fitur mungkin tidak tersedia.',
        duration: Infinity, // Stay until dismissed or online
      });
    };

    // ── Focus (window receives focus) ──────────────────
    // Lighter than visibilitychange — only check session, not full recovery
    const handleFocus = () => {
      // Only recover on focus if we haven't recovered very recently
      // This acts as a safety net for cases where visibilitychange doesn't fire
      const timeSinceLastRecovery = Date.now() - lastRecoveryRef.current;
      if (timeSinceLastRecovery > 30_000) {
        void recover('window-focus');
      }
    };

    // ── Unhandled rejections ───────────────────────────
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('[Recovery] Unhandled promise rejection:', event.reason);
      // Don't prevent default — let the browser log it too
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [recover]);

  return <>{children}</>;
}
