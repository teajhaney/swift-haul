"use client";

import { ComingSoon } from "@/components/shared/coming-soon";
import { notify } from "@/lib/toast";
import { TOAST } from "@/constants/messages";

/**
 * Demo page — previews the Coming Soon component and all 4 toast variants.
 * This route will be removed once the dashboard shell is built and
 * Coming Soon is embedded inside real feature pages.
 */
export default function ComingSoonDemoPage() {
  const fireAllToasts = () => {
    notify.warning(
      TOAST.DELIVERY_FAILED.title,
      TOAST.DELIVERY_FAILED.description("SH-b7x2e4p1")
    );
    notify.info(
      TOAST.ORDER_ASSIGNED.title,
      TOAST.ORDER_ASSIGNED.description("SH-c4e1k8n3")
    );
    notify.error(
      TOAST.ASSIGNMENT_FAILED.title,
      TOAST.ASSIGNMENT_FAILED.description
    );
    notify.success(
      TOAST.ORDER_CREATED.title,
      TOAST.ORDER_CREATED.description("SH-a8f5x9k2")
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Toast trigger bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#E2E8F0]">
        <span className="text-sm text-[#64748B] font-medium">
          Toast preview — click to fire all 4 variants
        </span>
        <button
          onClick={fireAllToasts}
          className="px-4 py-2 bg-[#1A6FB5] hover:bg-[#145A94] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Fire Toasts
        </button>
      </div>

      {/* Coming Soon component */}
      <ComingSoon
        feature="Route Optimization"
        description="We're working on this feature. It will be available in a future update. Our engineering team is currently perfecting the route-solving algorithms to ensure maximum efficiency for your fleet."
      />
    </div>
  );
}
