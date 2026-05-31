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

  client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return client;
}
