"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogContextType {
  open: boolean;
  onClose: () => void;
}

const DialogContext = React.createContext<DialogContextType>({
  open: false,
  onClose: () => {},
});

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Dialog({ open, onClose, children }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ open, onClose }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop — Apple glassmorphism */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xl"
          style={{ animation: 'fadeIn 0.2s cubic-bezier(0.25, 0.1, 0.25, 1) both' }}
          onClick={onClose}
        />
        {/* Content */}
        <div
          className="relative z-50 w-full max-w-lg mx-4"
          style={{ animation: 'scaleIn 0.25s cubic-bezier(0.25, 0.1, 0.25, 1) both' }}
        >
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  );
}

function DialogContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { onClose } = React.useContext(DialogContext);

  return (
    <div
      className={cn(
        "bg-[var(--card-bg)] rounded-3xl shadow-[var(--shadow-elevated)] border border-[var(--border)] max-h-[85vh] overflow-y-auto",
        className
      )}
      {...props}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all duration-200 z-10"
      >
        <X className="h-4 w-4" />
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
