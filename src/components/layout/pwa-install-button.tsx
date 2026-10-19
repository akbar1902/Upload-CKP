'use client';

import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Tombol "Pasang Aplikasi".
 *
 * Hanya muncul bila browser mengirim event `beforeinstallprompt` (Chrome/Edge
 * dan aplikasi belum terpasang) — jadi pengguna Firefox/Safari atau yang sudah
 * memasang aplikasi tidak melihat tombol ini sama sekali. Ini menjadikan SIKAP
 * bisa dipasang seperti aplikasi desktop/HP dengan sekali klik.
 */
export function PwaInstallButton({ collapsed = false }: { collapsed?: boolean }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    // Sudah dibuka sebagai aplikasi terpasang?
    if (window.matchMedia?.('(display-mode: standalone)').matches) {
      const raf = requestAnimationFrame(() => setInstalled(true));
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('beforeinstallprompt', onPrompt);
        window.removeEventListener('appinstalled', onInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || !deferred) return null;

  const handleInstall = async () => {
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } catch {
      /* pengguna menutup dialog — abaikan */
    } finally {
      setDeferred(null);
    }
  };

  return (
    <button
      onClick={handleInstall}
      title="Pasang aplikasi SIKAP di perangkat ini"
      aria-label="Pasang aplikasi SIKAP"
      className={
        'group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold' +
        ' transition-[background-color,color,border-color,transform] duration-200 ease-out' +
        ' border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-accent)]' +
        (collapsed ? ' justify-center' : '')
      }
      style={{
        color: 'var(--sidebar-text)',
        background: 'rgba(224, 146, 108, 0.14)',
        border: '1px solid rgba(224, 146, 108, 0.34)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(224, 146, 108, 0.24)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(224, 146, 108, 0.55)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(224, 146, 108, 0.14)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(224, 146, 108, 0.34)';
      }}
    >
      <span
        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--sidebar-accent)', color: '#0B2A24' }}
        aria-hidden="true"
      >
        <Download size={13} />
      </span>
      {!collapsed && <span>Pasang Aplikasi</span>}
    </button>
  );
}
