import React, { useState, forwardRef } from "react";
import { cn } from "./utils";

export interface FloatingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ className, label, value, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    const hasValue = value !== '' && value !== undefined && value !== null;
    const shouldFloat = focused || hasValue;

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-right resize-none transition-all duration-200",
            shouldFloat ? "pt-6 pb-2" : "pt-4 pb-4",
            /^[0-9۰-۹]*$/.test(value?.toString() || '') && value ? "persian-nums" : "",
            className
          )}
          ref={ref}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={shouldFloat ? "" : label}
          style={{
            minHeight: '80px'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.max(80, target.scrollHeight) + 'px';
          }}
          {...props}
        />
        <label className={cn(
          "absolute right-3 text-muted-foreground pointer-events-none transition-all duration-200 ease-in-out",
          shouldFloat ? "top-2 text-xs opacity-100" : "top-6 text-sm opacity-0"
        )}>
          {label}
        </label>
      </div>
    );
  }
);

FloatingTextarea.displayName = "FloatingTextarea";

export { FloatingTextarea };