"use client";

import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";


const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          fontFamily: "Vazirmatn, sans-serif",
          direction: "rtl",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
