import React, { useState, forwardRef } from "react";
import { cn } from "./utils";

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, type, label, value, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    const hasValue = value !== '' && value !== undefined && value !== null;
    const shouldFloat = focused || hasValue;

    return (
      <div className={cn("relative w-full", className)}>
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-right transition-all duration-200",
            shouldFloat ? "pt-6 pb-2" : "pt-3 pb-3",
            /^[0-9۰-۹]*$/.test(value || '') && value ? "persian-nums" : ""
          )}
          ref={ref}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={shouldFloat ? (props.placeholder || "") : label}
          {...props}
        />
        <label className={cn(
          "absolute right-3 text-muted-foreground pointer-events-none transition-all duration-200 ease-in-out",
          shouldFloat ? "top-2 text-xs opacity-100" : "top-1/2 -translate-y-1/2 text-sm opacity-0"
        )}>
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };