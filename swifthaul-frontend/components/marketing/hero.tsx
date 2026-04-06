import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DashboardMockup } from "@/components/marketing/dashboard-mockup";
import { HERO } from "@/constants/marketing";

export function Hero() {
  return (
    <section className="bg-[#0F2B46] overflow-hidden">
      <div className="section-container py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
          {/* Text */}
          <div className="flex-1 lg:max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-[1.1] tracking-tight">
              {HERO.HEADING}
            </h1>
            <p className="mt-5 text-[#94A3B8] text-base sm:text-lg leading-relaxed max-w-lg">
              {HERO.SUBHEADING}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-[#1A6FB5] hover:bg-[#145A94] text-white font-semibold shadow-lg border-transparent w-full sm:w-auto justify-center"
                )}
              >
                {HERO.CTA_PRIMARY}
              </Link>
              <Link
                href="#how-it-works"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-white/25 hover:border-white/50 hover:bg-white/5 bg-transparent text-white font-semibold w-full sm:w-auto justify-center"
                )}
              >
                {HERO.CTA_SECONDARY}
              </Link>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="flex-1 mt-12 lg:mt-0 flex justify-center lg:justify-end">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
