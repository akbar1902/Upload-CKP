import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyIllustration, type EmptyIllustrationKind } from "./empty-illustrations";

export interface EmptyStateProps {
  icon?: LucideIcon;
  /** Ilustrasi kecil bergaya ruko (dipakai menggantikan ikon bila diisi). */
  illustration?: EmptyIllustrationKind;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState — tampilan kosong yang konsisten. Utamakan `illustration`
 * (ruko tertutup / lampu jalan / ruko beres) agar senada dengan halaman
 * masuk; `icon` tetap didukung untuk konteks kecil.
 */
export function EmptyState({ icon: Icon, illustration, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-6 py-12",
        className
      )}
    >
      {illustration ? (
        <EmptyIllustration kind={illustration} className="mb-5 w-[176px]" />
      ) : Icon ? (
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: "var(--sand-subtle)", color: "var(--text-secondary)" }}
          aria-hidden="true"
        >
          <Icon size={24} strokeWidth={1.8} />
        </div>
      ) : null}
      <h3 className="text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
      {description && (
        <p className="text-[13.5px] mt-1 max-w-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
