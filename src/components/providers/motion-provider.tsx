"use client";

import React from "react";
import { MotionConfig } from "framer-motion";

/**
 * Lapis koordinasi reduced-motion untuk JS motion (MOTION-TECH §3.4 lapis 2):
 * `reducedMotion="user"` membuat framer-motion otomatis menonaktifkan animasi
 * transform/x/y/scale saat `prefers-reduced-motion: reduce`, sambil
 * mempertahankan fade opacity. Dipasang sekali di root layout.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
