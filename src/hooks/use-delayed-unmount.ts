"use client";

import { useEffect, useState } from "react";

/**
 * Menahan elemen tetap ter-mount sesaat setelah `show` berubah menjadi false,
 * supaya animasi keluar berbasis CSS sempat dimainkan.
 *
 * Ini pengganti ringan `AnimatePresence` dari framer-motion (framer-motion
 * dihapus dari bundle karena bobotnya ~122 KB dan hanya dipakai untuk efek
 * fade/pop sederhana).
 */
export function useDelayedUnmount(show: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(show);

  useEffect(() => {
    if (show) {
      setMounted(true);
      return;
    }
    const timer = setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(timer);
  }, [show, exitMs]);

  return { mounted, leaving: mounted && !show };
}
