import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "neu-field flex h-12 w-full rounded-xl border border-[var(--sand-border)] bg-[var(--card-bg)] px-4 py-3 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-all duration-200 focus:outline-none focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
