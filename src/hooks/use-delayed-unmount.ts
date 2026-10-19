"use client";

import { useEffect, useState } from "react";

/**
 * Menahan elemen tetap ter-mount sesaat setelah `show` berubah menjadi false,
 * supaya animasi keluar berbasis CSS sempat dimainkan.
 *
 * Ini pengganti ringan `AnimatePresence` dari framer-motion (framer-motion
 * dihapus dari bundle karena bobotnya ~122 KB dan hanya dipakai untuk efek
 * fade/pop sederhana).
 *
 * `mounted` naik pada frame berikutnya (bukan langsung), supaya elemen baru
 * yang muncul sempat dirender dalam keadaan "belum tampil" — tanpa itu,
 * animasi masuk tidak punya state awal dan tidak bisa dimainkan.
 */
export function useDelayedUnmount(show: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(show);

  useEffect(() => {
    if (show) {
      const raf = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(raf);
    }
    const timer = setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(timer);
  }, [show, exitMs]);

  return { mounted, leaving: mounted && !show };
}
