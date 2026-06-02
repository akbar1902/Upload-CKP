"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser, AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { User } from '@/types/database';

interface AuthContextType {
  supabaseUser: SupabaseUser | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  supabaseUser: null,
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => { },
  refreshUser: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Stable reference — createClient() is a singleton, but we memoize
  // to guarantee the same object identity across renders.
  const supabase = useMemo(() => createClient(), []);
  const mountedRef = useRef(true);

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
      role: (authUser.user_metadata?.role as User['role']) ?? 'pegawai',
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
        setUser(buildFallbackUser(authUser));
        return;
      }

      setUser(data as User);
    } catch {
      if (mountedRef.current) setUser(buildFallbackUser(authUser));
    }
  }, [supabase, buildFallbackUser]);

  useEffect(() => {
    mountedRef.current = true;

    // Safety timeout: never stay in loading state forever (10s for slow connections)
    const safetyTimeout = setTimeout(() => {
      if (mountedRef.current) {
        console.warn('[Auth] Safety timeout: forcing loading=false');
        setLoading(false);
      }
    }, 10000);

    const init = async () => {
      try {
        // getSession() reads from local cache — instant, no network call
        const { data: { session } } = await supabase.auth.getSession();
        if (!mountedRef.current) return;

        if (session?.user) {
          // Set UI immediately from cached session
          setSupabaseUser(session.user);
          await fetchUserProfile(session.user);
          if (mountedRef.current) setLoading(false);

          // Then validate with server in background (security check)
          void (async () => {
            try {
              const bgResult = await supabase.auth.getUser();
              if (!mountedRef.current) return;
              if (!bgResult.data?.user) {
                setSupabaseUser(null);
                setUser(null);
              }
            } catch { /* ignore */ }
          })();
        } else {
          if (mountedRef.current) setLoading(false);
        }
      } catch (err) {
        console.error('[Auth] Init error:', err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mountedRef.current) return;
        setSupabaseUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

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
    // Force redirect after 3s no matter what (prevents stuck logout)
    const forceRedirect = setTimeout(() => {
      window.location.replace('/login');
    }, 3000);

    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[Auth] SignOut error:', err);
    }

    // Clear state
    setUser(null);
    setSupabaseUser(null);

    // Clear all Supabase storage keys
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

    clearTimeout(forceRedirect);
    window.location.replace('/login');
  }, [supabase]);

  const refreshUser = useCallback(async () => {
    if (supabaseUser) await fetchUserProfile(supabaseUser);
  }, [supabaseUser, fetchUserProfile]);

  const value = useMemo(() => ({
    supabaseUser, user, loading, signIn, signOut, refreshUser
  }), [supabaseUser, user, loading, signIn, signOut, refreshUser]);

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
