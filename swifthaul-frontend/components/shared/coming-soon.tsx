"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { COMING_SOON } from "@/constants/messages";

interface ComingSoonProps {
  /** Feature name shown in the small badge above the heading e.g. "ROUTE OPTIMIZATION" */
  feature: string;
  /** Optional override for the body description */
  description?: string;
}

/**
 * Reusable Coming Soon screen — drop inside any page that is not yet implemented.
 * Renders centered within whatever container it sits in.
 */
export function ComingSoon({ feature, description }: ComingSoonProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-24">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-[#E8F4FD] flex items-center justify-center mb-6">
        <Rocket className="w-8 h-8 text-[#1A6FB5]" />
      </div>

      {/* Feature badge */}
      <span className="inline-block px-3 py-1 rounded-full bg-[#F1F5F9] text-[#64748B] text-xs font-semibold tracking-widest uppercase mb-4">
        {feature}
      </span>

      {/* Heading */}
      <h1 className="text-3xl font-bold text-[#0F2B46] mb-4">{COMING_SOON.HEADING}</h1>

      {/* Description */}
      <p className="text-[#64748B] text-sm leading-relaxed max-w-md">
        {description ?? COMING_SOON.DEFAULT_DESCRIPTION}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto px-8 py-2.5 bg-[#1A6FB5] hover:bg-[#145A94] text-white font-semibold rounded-lg transition-colors text-sm"
        >
          {COMING_SOON.GO_TO_DASHBOARD}
        </Link>
        <button
          onClick={() => router.back()}
          className="text-sm text-[#64748B] hover:text-[#1E293B] font-medium transition-colors"
        >
          {COMING_SOON.GO_BACK}
        </button>
      </div>
    </div>
  );
}
