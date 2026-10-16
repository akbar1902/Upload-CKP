import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     * - berkas statis/PWA (manifest, service worker, robots) — jangan
     *   diproses middleware supaya tidak dialihkan ke /login (dulu
     *   manifest.webmanifest kena 307 untuk pengguna yang belum login)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|workbox-|swe-worker-|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|webmanifest)$).*)',
  ],
};
