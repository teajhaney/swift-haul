import { MapPin, Zap, Camera, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FEATURES_LIST, FEATURES_SECTION } from "@/constants/marketing";

/** Maps feature keys to their Lucide icons. Icons are visual assets, not text — kept here in the component. */
const ICON_MAP: Record<string, LucideIcon> = {
  tracking: MapPin,
  dispatch: Zap,
  pod: Camera,
  analytics: BarChart3,
};

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="w-11 h-11 rounded-lg bg-[#E8F4FD] flex items-center justify-center text-[#1A6FB5] shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-[#1E293B] font-semibold text-base mb-1.5">{title}</h3>
        <p className="text-[#64748B] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-[#FAFBFC]">
      <div className="section-container">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1E293B]">
            {FEATURES_SECTION.HEADING}
          </h2>
          <p className="mt-3 text-[#64748B] text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            {FEATURES_SECTION.SUBHEADING}
          </p>
        </div>

        {/* 4-col desktop / 2-col tablet / 1-col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES_LIST.map((feature) => (
            <FeatureCard
              key={feature.key}
              icon={ICON_MAP[feature.key]}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
