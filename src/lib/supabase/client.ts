import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Returns a singleton Supabase browser client.
 * Using a singleton prevents infinite re-render loops when the client
 * is used inside React useEffect dependency arrays.
 */
export function createClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
      // During SSR/build, return a throwaway client
      return createBrowserClient(
        'https://placeholder.supabase.co',
        'placeholder-key'
      );
    }
    throw new Error('Supabase URL and Anon Key must be set in environment variables');
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
      lock: (name: string, acquireTimeout: number, fn: () => Promise<any>) => fn(),
    },
  });
  return client;
}

/**
 * Creates a FRESH (non-singleton) Supabase browser client.
 * Use this for critical operations (like upload) that happen after
 * the user has been idle. The singleton client can become stale/zombie
 * after browser tab suspension, causing operations to hang indefinitely.
 *
 * This client shares the same localStorage session but creates new
 * internal connections, avoiding the stale-connection hang.
 */
export function createFreshClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be set in environment variables');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false, // Don't fight with the singleton's auto-refresh
      detectSessionInUrl: false,
      persistSession: true, // Read from same localStorage
      lock: (name: string, acquireTimeout: number, fn: () => Promise<any>) => fn(),
    },
  });
}
