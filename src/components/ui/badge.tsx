import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors tracking-wide",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--primary-soft)] text-[var(--primary)]",
        secondary: "border-[var(--sand-border)] bg-[var(--card-bg)] text-[var(--text-secondary)]",
        success: "border-transparent bg-[var(--success-soft)] text-[var(--success-text)]",
        destructive: "border-transparent bg-[var(--danger-soft)] text-[var(--danger-text)]",
        warning: "border-transparent bg-[var(--warning-soft)] text-[var(--warning-text)]",
        outline: "border-[var(--sand-border)] text-[var(--text-secondary)]",
        draft: "border-[var(--sand-border)] bg-[var(--sand-subtle)] text-[var(--text-secondary)]",
        submitted: "border-transparent bg-[var(--accent-soft)] text-[var(--accent-strong)]",
        scored: "border-transparent bg-[var(--sand-strong)] text-[var(--tertiary-text)]",
        approved: "border-transparent bg-[var(--success-soft)] text-[var(--success-text)]",
        rejected: "border-transparent bg-[var(--danger-soft)] text-[var(--danger-text)]",
        revision_required: "border-transparent bg-[var(--danger-soft)] text-[var(--danger-text)]",
        superseded: "border-transparent bg-[var(--sand-subtle)] text-[var(--text-tertiary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
