import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CTA_BANNER } from "@/constants/marketing";

export function CtaBanner() {
  return (
    <section className="py-20 lg:py-24 bg-[#0F2B46]">
      <div className="section-container max-w-3xl text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white">
          {CTA_BANNER.HEADING}
        </h2>
        <p className="mt-4 text-[#94A3B8] text-base lg:text-lg leading-relaxed">
          {CTA_BANNER.SUBHEADING}
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-[#F27830] hover:bg-[#D96520] text-white font-bold shadow-lg border-transparent px-8"
            )}
          >
            {CTA_BANNER.CTA}
          </Link>
        </div>
      </div>
    </section>
  );
}
