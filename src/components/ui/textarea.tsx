import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "neu-field flex min-h-[100px] w-full rounded-xl border border-[var(--sand-border)] bg-[var(--card-bg)] px-4 py-3 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-all duration-200 focus:outline-none focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
