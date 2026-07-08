import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors tracking-wide",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--primary-soft)] text-[var(--primary)]",
        secondary: "border-transparent bg-[var(--bg-secondary)] text-[var(--text-secondary)]",
        success: "border-transparent bg-[var(--success-soft)] text-[#248A3D] dark:text-[#30D158]",
        destructive: "border-transparent bg-[var(--danger-soft)] text-[#D70015] dark:text-[#FF453A]",
        warning: "border-transparent bg-[var(--warning-soft)] text-[#A05A00] dark:text-[#FF9F0A]",
        outline: "border-[var(--border)] text-[var(--text-secondary)]",
        draft: "border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]",
        submitted: "border-transparent bg-[var(--primary-soft)] text-[var(--primary)]",
        approved: "border-transparent bg-[var(--success-soft)] text-[#248A3D] dark:text-[#30D158]",
        rejected: "border-transparent bg-[var(--danger-soft)] text-[#D70015] dark:text-[#FF453A]",
        revision_required: "border-transparent bg-[var(--warning-soft)] text-[#A05A00] dark:text-[#FF9F0A]",
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
