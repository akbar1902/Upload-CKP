"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { runSafeRead, createReadClient, withTimeoutRetry } from '@/lib/supabase/read';
import { useAuth } from '@/hooks/use-auth';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  upload_id: string | null;
  is_read: boolean;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'baru saja';
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} hari lalu`;
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function notifLink(n: Notification, role?: string): string {
  if (n.upload_id) {
    if (role === 'anggota') return `/pegawai/ckp/${n.upload_id}`;
    return `/penilaian/${n.upload_id}`;
  }
  return role === 'anggota' ? '/pegawai' : role === 'ketua_tim' ? '/ketua_tim' : '/pimpinan';
}

export function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  const unread = items.filter((i) => !i.is_read).length;

  // Muat 20 terbaru
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    void runSafeRead(async (sb) => {
      const { data, error } = await sb
        .from('notifications')
        .select('id, type, title, body, upload_id, is_read, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw new Error(error.message);
      return (data || []) as Notification[];
    })
      .then((rows) => {
        if (!cancelled) setItems(rows);
      })
      .catch(() => {
        /* gagal memuat notifikasi tidak boleh mengganggu UI */
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Realtime: notifikasi baru masuk tanpa refresh
  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase
      .channel(`notif-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: { new: Record<string, unknown> }) => {
          setItems((prev) => [payload.new as unknown as Notification, ...prev].slice(0, 20));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user?.id, supabase]);

  // Tutup saat klik di luar
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const markAllRead = async () => {
    if (!user?.id || unread === 0) return;
    setItems((prev) => prev.map((i) => ({ ...i, is_read: true })));
    try {
      await withTimeoutRetry(
        async () => {
          const sb = createReadClient();
          await sb
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);
        },
        { attempts: 1, timeoutMs: 8000 }
      );
    } catch {
      /* optimistic UI sudah diperbarui; kegagalan update tidak memblokir */
    }
  };

  const openItem = async (n: Notification) => {
    setOpen(false);
    if (!n.is_read) {
      setItems((prev) => prev.map((i) => (i.id === n.id ? { ...i, is_read: true } : i)));
      try {
        await withTimeoutRetry(
          async () => {
            const sb = createReadClient();
            await sb.from('notifications').update({ is_read: true }).eq('id', n.id);
          },
          { attempts: 1, timeoutMs: 8000 }
        );
      } catch {
        /* abaikan */
      }
    }
    router.push(notifLink(n, user?.role));
  };

  return (
    <div ref={boxRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2.5 rounded-full transition-colors"
        style={
          unread > 0
            ? { background: 'var(--accent-soft)', color: 'var(--accent-strong)' }
            : { background: 'var(--sand-subtle)', color: 'var(--text-secondary)' }
        }
        aria-label={unread > 0 ? `Notifikasi, ${unread} belum dibaca` : 'Notifikasi'}
        aria-expanded={open}
        aria-haspopup="dialog"
        title="Notifikasi"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-0.5 rounded-full bg-[var(--accent-strong)] text-white text-[9px] font-bold flex items-center justify-center"
            aria-hidden="true"
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-[340px] max-w-[85vw] rounded-2xl overflow-hidden z-50 animate-scale-in"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--sand-border)',
            boxShadow: 'var(--shadow-elevated)',
          }}
          role="dialog"
          aria-label="Riwayat notifikasi"
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid var(--sand-border)' }}
          >
            <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>
              Notifikasi
            </p>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[11px] font-semibold transition-opacity hover:opacity-70"
                style={{ color: 'var(--primary)' }}
              >
                <CheckCheck size={13} /> Tandai dibaca
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto">
            {items.length === 0 ? (
              <p
                className="text-center text-[13px] px-6 py-10"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Belum ada notifikasi.
              </p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => openItem(n)}
                  className="w-full text-left px-4 py-3 transition-colors flex gap-3"
                  style={{
                    background: n.is_read ? 'transparent' : 'var(--primary-soft)',
                    borderBottom: '1px solid var(--sand-border)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--sand-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = n.is_read
                      ? 'transparent'
                      : 'var(--primary-soft)';
                  }}
                >
                  {!n.is_read && (
                    <span
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: 'var(--accent)' }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="min-w-0 flex-1">
                    <span
                      className="block text-[13px] font-semibold leading-snug"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {n.title}
                    </span>
                    {n.body && (
                      <span
                        className="block text-[12px] mt-0.5 leading-snug line-clamp-2"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {n.body}
                      </span>
                    )}
                    <span
                      className="block text-[11px] mt-1"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {timeAgo(n.created_at)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>

          <Link
            href={user?.role === 'anggota' ? '/pegawai' : user?.role === 'ketua_tim' ? '/ketua_tim' : '/pimpinan'}
            prefetch={true}
            onClick={() => setOpen(false)}
            className="block text-center text-[12px] font-semibold py-2.5 transition-opacity hover:opacity-70"
            style={{ color: 'var(--primary)', borderTop: '1px solid var(--sand-border)' }}
          >
            Lihat dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
