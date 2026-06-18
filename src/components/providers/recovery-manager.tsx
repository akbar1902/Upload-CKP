"use client";

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

/**
 * RecoveryManager — centralized idle-state recovery system.
 *
 * Handles browser events that indicate the user has returned after inactivity:
 *   1. visibilitychange  — tab becomes visible again
 *   2. online/offline    — network drops/reconnects (laptop sleep/wake)
 *
 * On each event it:
 *   - Validates the Supabase session (refreshing if needed)
 *   - Marks React Query caches as stale (WITHOUT immediately refetching)
 *   - Shows toast notifications for network status changes
 *
 * KEY DESIGN DECISION: We do NOT call refetchQueries after invalidation.
 * Calling refetchQueries immediately sets isPending=true → skeleton flash.
 * Instead, data refetches lazily when the user interacts with the page,
 * while showing the cached (possibly stale) data in the meantime.
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
   * Core recovery routine. Debounced to 30s to prevent multiple rapid firings.
   */
  const recover = useCallback(async (reason: string) => {
    // Debounce: skip if we recovered in the last 30 seconds
    const now = Date.now();
    if (now - lastRecoveryRef.current < 30_000) return;
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
        sessionValid = true; // Assume true to allow query invalidation
      }

      if (!sessionValid) {
        console.log('[Recovery] No valid session — user will be redirected by auth');
        return;
      }

      // Step 2: Mark all caches as stale WITHOUT triggering a refetch.
      // refetchType: 'none' means isPending stays false → no skeleton flash.
      // Data refetches lazily on next user interaction or component mount.
      await queryClient.invalidateQueries({ refetchType: 'none' });
      console.log('[Recovery] All queries marked stale (lazy refetch on next interaction)');

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

    // ── Online ─────────────────────────────────────────
    const handleOnline = () => {
      console.log('[Recovery] Network restored');
      wasOfflineRef.current = false;

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

    // ── Offline ────────────────────────────────────────
    const handleOffline = () => {
      console.log('[Recovery] Network lost');
      wasOfflineRef.current = true;

      offlineToastIdRef.current = toast.warning('Koneksi internet terputus', {
        description: 'Beberapa fitur mungkin tidak tersedia.',
        duration: Infinity,
      });
    };

    // ── Unhandled rejections ───────────────────────────
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('[Recovery] Unhandled promise rejection:', event.reason);
    };

    // NOTE: window 'focus' handler intentionally omitted.
    // visibilitychange covers tab-return reliably. A separate focus handler
    // caused double-recovery and skeleton flashes on tab switch.

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [recover]);

  return <>{children}</>;
}
