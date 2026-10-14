"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOTION, EASE } from "@/lib/motion";
import { X } from "lucide-react";

interface DialogContextType {
  open: boolean;
  onClose: () => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const DialogContext = React.createContext<DialogContextType>({
  open: false,
  onClose: () => {},
  contentRef: { current: null },
});

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.tabIndex !== -1 && el.getAttribute("aria-hidden") !== "true" && el.offsetParent !== null
  );
}

// Stack sederhana: hanya dialog teratas yang menangani Escape/Tab agar
// dialog bersarang (mis. konfirmasi di atas modal) tidak saling menutup.
const openDialogs: symbol[] = [];

const emptySubscribe = () => () => {};

/** True hanya setelah hydration (portal aman dirender di client). */
function useIsClient() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Dialog({ open, onClose, children }: DialogProps) {
  const mounted = useIsClient();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const dialogId = React.useRef<symbol>(Symbol("dialog"));
  const onCloseRef = React.useRef(onClose);

  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Kunci scroll body saat terbuka, pulihkan nilai sebelumnya saat tutup.
  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Fokus awal, focus trap (Tab/Shift+Tab), Escape, + restore fokus ke pemicu.
  React.useEffect(() => {
    if (!open || !mounted) return;
    const id = dialogId.current;
    openDialogs.push(id);
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const raf = requestAnimationFrame(() => {
      const panel = contentRef.current;
      if (!panel) return;
      if (!panel.contains(document.activeElement)) {
        const first = getFocusable(panel)[0];
        (first ?? panel).focus();
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      // Hanya dialog teratas yang bereaksi (dukung dialog bersarang).
      if (openDialogs[openDialogs.length - 1] !== id) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;
      const panel = contentRef.current;
      if (!panel) return;

      const focusables = getFocusable(panel);
      if (focusables.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const inside = panel.contains(active);

      if (event.shiftKey) {
        if (!inside || active === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKeyDown);
      const index = openDialogs.lastIndexOf(id);
      if (index !== -1) openDialogs.splice(index, 1);
      if (trigger && document.contains(trigger)) trigger.focus();
    };
  }, [open, mounted]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="sikap-dialog"
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          <DialogContext.Provider value={{ open, onClose, contentRef }}>
            {/* Backdrop — scrim datar (MOTION-SPEC §D G3: blur-x dihapus) */}
            <motion.div
              className="fixed inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: MOTION.fast / 1000, ease: EASE.outStrong } }}
              exit={{ opacity: 0, transition: { duration: MOTION.exit / 1000, ease: EASE.apple } }}
              onClick={onClose}
              aria-hidden="true"
            />
            {/* Content — enter 220ms / exit 150ms (MOTION-SPEC §C5) */}
            <motion.div
              className="relative z-50 flex flex-col w-full items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: MOTION.panelEnter / 1000, ease: EASE.outStrong } }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: MOTION.exit / 1000, ease: EASE.apple } }}
            >
              {children}
            </motion.div>
          </DialogContext.Provider>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function DialogContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { onClose, contentRef } = React.useContext(DialogContext);

  return (
    <div
      ref={contentRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className={cn(
        "w-full max-w-lg bg-[var(--card-bg)] rounded-3xl shadow-[var(--shadow-elevated)] border border-[var(--border)] max-h-[85vh] overflow-y-auto relative focus:outline-none",
        className
      )}
      {...props}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--sand-subtle)] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-[var(--duration-fast)] z-10"
      >
        <X className="h-[18px] w-[18px]" />
      </button>
      {children}
    </div>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-7 pt-7 pb-2", className)} {...props} />
  );
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-xl font-semibold text-[var(--text-primary)] tracking-tight", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-[15px] text-[var(--text-secondary)] mt-1.5", className)} {...props} />
  );
}

function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-7 py-5", className)} {...props} />
  );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-end gap-3 px-7 py-5 border-t border-[var(--border)]", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
};
