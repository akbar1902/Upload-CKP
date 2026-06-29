"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser, AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { User } from '@/types/database';

let globalRefreshPromise: Promise<any> | null = null;

interface AuthContextType {
  supabaseUser: SupabaseUser | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  /** Call this whenever you navigate or need fresh auth state */
  ensureSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  supabaseUser: null,
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => { },
  refreshUser: async () => { },
  ensureSession: async () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Stable reference — createClient() is a singleton, but we memoize
  // to guarantee the same object identity across renders.
  const supabase = useMemo(() => createClient(), []);
  const mountedRef = useRef(true);
  const initCompletedRef = useRef(false);
  // Track current user ref to avoid stale closures in ensureSession
  const currentUserRef = useRef<User | null>(null);

  /**
   * Build a fallback User from Supabase Auth metadata.
   */
  const buildFallbackUser = useCallback((authUser: SupabaseUser): User => {
    return {
      id: authUser.id,
      email: authUser.email ?? '',
      full_name:
        authUser.user_metadata?.full_name ??
        authUser.email?.split('@')[0] ??
        'User',
      role: (authUser.user_metadata?.role as User['role']) ?? 'anggota',
      nip: authUser.user_metadata?.nip ?? null,
      unit_kerja: authUser.user_metadata?.unit_kerja ?? null,
      is_active: true,
      created_at: authUser.created_at,
      updated_at: authUser.updated_at ?? authUser.created_at,
    };
  }, []);

  const fetchUserProfile = useCallback(async (authUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!mountedRef.current) return;

      if (error || !data) {
        console.warn('[Auth] Profile fetch issue, using fallback:', error?.message);
        const fallback = buildFallbackUser(authUser);
        currentUserRef.current = fallback;
        setUser(fallback);
        return;
      }

      currentUserRef.current = data as User;
      setUser(data as User);
    } catch {
      if (mountedRef.current) {
        const fallback = buildFallbackUser(authUser);
        currentUserRef.current = fallback;
        setUser(fallback);
      }
    }
  }, [supabase, buildFallbackUser]);

  /**
   * ensureSession: Attempts to refresh the session if stale.
   * Returns true if we have a valid session, false otherwise.
   * This is the KEY fix — call this on navigation to prevent stuck states.
   *
   * NOTE: `user` is intentionally NOT in the dependency array.
   * Including it caused stale closures where ensureSession would
   * be recreated on every user state change, leading to race conditions.
   */
  const ensureSession = useCallback(async (): Promise<boolean> => {
    const doEnsure = async (): Promise<boolean> => {
      try {
        // First try the fast path: local cache
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Check if the token is about to expire (within 60 seconds)
          const expiresAt = session.expires_at;
          const now = Math.floor(Date.now() / 1000);
          const isExpiringSoon = expiresAt ? (expiresAt - now) < 60 : false;

          if (isExpiringSoon) {
            console.log('[Auth] Session expiring soon, refreshing...');
            if (!globalRefreshPromise) {
              globalRefreshPromise = Promise.race([
                supabase.auth.refreshSession(),
                new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Refresh timeout')), 8000))
              ]).finally(() => {
                globalRefreshPromise = null;
              });
            }
            const { data: refreshed, error: refreshError } = await globalRefreshPromise;
            if (refreshError || !refreshed?.session) {
              console.warn('[Auth] Session refresh failed:', refreshError?.message);
              // Token expired and can't refresh — force re-auth
              if (mountedRef.current) {
                setSupabaseUser(null);
                setUser(null);
                setLoading(false);
              }
              return false;
            }
            if (mountedRef.current) {
              setSupabaseUser(refreshed.session.user);
              await fetchUserProfile(refreshed.session.user);
            }
            return true;
          }

          // Session is still valid — ensure user state is populated
          if (mountedRef.current) {
            setSupabaseUser(session.user);
            // Only re-fetch profile if user state is not already populated
            // (avoids unnecessary network call during tab-visible recovery)
            if (!currentUserRef.current) {
              await fetchUserProfile(session.user);
            }
            setLoading(false);
          }
          return true;
        }

        // No cached session — try server validation
        const { data: { user: serverUser } } = await supabase.auth.getUser();
        if (serverUser) {
          if (mountedRef.current) {
            setSupabaseUser(serverUser);
            await fetchUserProfile(serverUser);
            setLoading(false);
          }
          return true;
        }

        // No valid session at all
        if (mountedRef.current) {
          setSupabaseUser(null);
          setUser(null);
          setLoading(false);
        }
        return false;
      } catch (err) {
        console.error('[Auth] ensureSession error:', err);
        if (mountedRef.current) setLoading(false);
        return false;
      }
    };

    try {
      return await Promise.race([
        doEnsure(),
        new Promise<boolean>((_, reject) => 
          setTimeout(() => reject(new Error('ensureSession timed out')), 15000)
        )
      ]);
    } catch (err) {
      console.warn('[Auth] ensureSession failed or timed out:', err);
      // We throw so that callers know it failed, rather than returning false 
      // which would incorrectly trigger a "session expired" logout.
      throw err;
    }
  }, [supabase, fetchUserProfile]); // NOTE: `user` intentionally excluded

  useEffect(() => {
    mountedRef.current = true;

    // Safety timeout: never stay in loading state forever (15s for slow connections)
    const safetyTimeout = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.warn('[Auth] Safety timeout: forcing loading=false');
        setLoading(false);
      }
    }, 15000);

    const init = async () => {
      try {
        // getSession() reads from local cache — instant, no network call
        const { data: { session } } = await supabase.auth.getSession();
        if (!mountedRef.current) return;

        if (session?.user) {
          // Check if token is expired
          const expiresAt = session.expires_at;
          const now = Math.floor(Date.now() / 1000);
          const isExpired = expiresAt ? (expiresAt - now) < 0 : false;

          if (isExpired) {
            console.log('[Auth] Cached session expired, attempting refresh...');
            if (!globalRefreshPromise) {
              globalRefreshPromise = Promise.race([
                supabase.auth.refreshSession(),
                new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Refresh timeout')), 8000))
              ]).finally(() => {
                globalRefreshPromise = null;
              });
            }
            const { data: refreshed } = await globalRefreshPromise;
            if (!mountedRef.current) return;

            if (refreshed?.session?.user) {
              setSupabaseUser(refreshed.session.user);
              // Set fallback immediately so loading can be cleared, then fetch full profile
              const fallback = buildFallbackUser(refreshed.session.user);
              currentUserRef.current = fallback;
              setUser(fallback);
              setLoading(false);
              // Full profile fetch in background
              void fetchUserProfile(refreshed.session.user);
            } else {
              // Can't refresh — clear state
              setSupabaseUser(null);
              setUser(null);
              setLoading(false);
            }
          } else {
            // FAST PATH: set auth state immediately from cached session + auth metadata
            // so queries can start right away (authLoading=false immediately).
            setSupabaseUser(session.user);
            const fallback = buildFallbackUser(session.user);
            currentUserRef.current = fallback;
            setUser(fallback);
            setLoading(false); // ← unblock queries immediately

            // Then fetch full profile in background (updates name/NIP/unit_kerja)
            void fetchUserProfile(session.user);
          }

          // Validate with server in background (security check)
          if (!isExpired) {
            void (async () => {
              try {
                const bgResult = await supabase.auth.getUser();
                if (!mountedRef.current) return;
                if (!bgResult.data?.user) {
                  setSupabaseUser(null);
                  currentUserRef.current = null;
                  setUser(null);
                }
              } catch { /* ignore */ }
            })();
          }
        } else {
          if (mountedRef.current) setLoading(false);
        }
      } catch (err) {
        console.error('[Auth] Init error:', err);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          initCompletedRef.current = true;
        }
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mountedRef.current) return;

        console.log('[Auth] Auth state changed:', event);

        if (event === 'TOKEN_REFRESHED' && session?.user) {
          setSupabaseUser(session.user);
          // Token refresh doesn't change profile data — skip re-fetch if user is loaded
          if (!currentUserRef.current) {
            await fetchUserProfile(session.user);
          }
          setLoading(false);
          return;
        }

        if (event === 'SIGNED_OUT') {
          currentUserRef.current = null;
          setSupabaseUser(null);
          setUser(null);
          setLoading(false);
          return;
        }

        setSupabaseUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          currentUserRef.current = null;
          setUser(null);
        }
        setLoading(false);
      }
    );

    // NOTE: Periodic token refresh via setInterval is intentionally removed.
    // Browsers throttle timers in background tabs (to once per minute or slower),
    // making setInterval unreliable for token refresh during idle.
    // The RecoveryManager uses visibilitychange/online events instead,
    // which fire reliably when the user returns.

    // NOTE: visibilitychange handler is intentionally removed from here.
    // It is now centralized in RecoveryManager to avoid duplicate handlers.

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
    // supabase and fetchUserProfile are stable — safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, [supabase]);

  const signOut = useCallback(async () => {
    // 1. Clear local state instantly
    currentUserRef.current = null;
    setUser(null);
    setSupabaseUser(null);

    // 2. Clear LocalStorage and SessionStorage
    if (typeof window !== 'undefined') {
      try {
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('sb-') || k.startsWith('supabase'))) keys.push(k);
        }
        keys.forEach(k => localStorage.removeItem(k));
        sessionStorage.clear();
      } catch { /* ignore */ }
    }

    // 3. Clear Cookies explicitly (crucial for @supabase/ssr)
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (name.startsWith('sb-') || name.startsWith('supabase')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      }
    }

    // 4. Fire and forget server signout (don't wait for it)
    supabase.auth.signOut().catch(() => {});

    // 5. Instant redirect
    window.location.replace('/login');
  }, [supabase]);

  const refreshUser = useCallback(async () => {
    if (supabaseUser) await fetchUserProfile(supabaseUser);
  }, [supabaseUser, fetchUserProfile]);

  const value = useMemo(() => ({
    supabaseUser, user, loading, signIn, signOut, refreshUser, ensureSession
  }), [supabaseUser, user, loading, signIn, signOut, refreshUser, ensureSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
