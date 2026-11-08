"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * Tombol ganti tema. Di browser yang mendukung View Transitions, tema baru
 * "tumbuh" sebagai lingkaran dari posisi tombol hingga menutupi layar.
 * Tanpa dukungan / dengan prefers-reduced-motion → ganti instan.
 */
let currentTransition: ViewTransition | null = null;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduce) {
      setTheme(next);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    // Kelas penanda: mematikan fade transisi-rute bawaan (globals.css)
    // supaya hanya animasi lingkaran yang terlihat.
    root.classList.add("theme-vt");
    const vt = document.startViewTransition(() => {
      // Terapkan kelas langsung agar snapshot "baru" sudah bertema baru.
      root.classList.remove("light", "dark");
      root.classList.add(next);
      root.style.colorScheme = next;
      flushSync(() => setTheme(next));
    });

    vt.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 700,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {});
    // Klik beruntun: hanya transisi terakhir yang boleh mencabut penanda.
    currentTransition = vt;
    vt.finished.finally(() => {
      if (currentTransition === vt) root.classList.remove("theme-vt");
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="relative overflow-hidden"
      onClick={toggle}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" style={{ color: 'var(--warning)' }} />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" style={{ color: 'var(--primary)' }} />
      <span className="sr-only">Ganti tema terang/gelap</span>
    </Button>
  );
}
