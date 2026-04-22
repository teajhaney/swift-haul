"use client";

import { Toaster as Sonner } from "sonner";

/**
 * Global toast container — added once in root layout.
 * Styled to match the SwiftHaul design system.
 */
export function Toaster() {
  return (
    <Sonner
      position="top-right"
      expand
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: "var(--font-sans)",
          fontSize: "0.875rem",
          borderRadius: "0.75rem",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          padding: "14px 16px",
          gap: "10px",
        },
        classNames: {
          title: "font-semibold text-[#1E293B] text-sm",
          description: "text-[#64748B] text-xs mt-0.5",
          closeButton:
            "!text-[#94A3B8] hover:!text-[#64748B] !bg-transparent !border-0",
          actionButton:
            "!bg-[#1A6FB5] hover:!bg-[#145A94] !text-white !text-xs !font-bold !rounded-lg !px-3 !py-1.5 transition-colors",
        },
      }}
    />
  );
}
