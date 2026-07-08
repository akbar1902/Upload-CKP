import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[0_0_0_4px_var(--primary-ring)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-white rounded-full hover:bg-[var(--primary-hover)]",
        destructive: "bg-[var(--danger)] text-white rounded-full hover:opacity-90",
        outline: "border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-secondary)]",
        secondary: "bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-full hover:text-[var(--text-primary)]",
        ghost: "text-[var(--text-secondary)] rounded-xl hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline rounded-xl",
        success: "bg-[var(--success)] text-white rounded-full hover:opacity-90",
        warning: "bg-[var(--warning)] text-white rounded-full hover:opacity-90",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-[52px] px-8 text-base",
        icon: "h-11 w-11 rounded-full",
        "icon-sm": "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4 opacity-70" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
