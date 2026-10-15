import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState — tampilan kosong yang konsisten (ikon dalam lingkaran soft,
 * teks tengah). Memakai token semantik sehingga otomatis ikut light/dark.
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-6 py-12",
        className
      )}
    >
      {Icon && (
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{
            background: "var(--sand-subtle)",
            color: "var(--text-secondary)",
            boxShadow: "var(--neu-inset-sm)",
          }}
          aria-hidden="true"
        >
          <Icon size={24} strokeWidth={1.8} />
        </div>
      )}
      <h3 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
      {description && (
        <p className="text-[13px] mt-1 max-w-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
