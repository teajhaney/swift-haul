import { HOW_IT_WORKS } from "@/constants/marketing";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex gap-5 items-start">
      <div className="w-10 h-10 rounded-full bg-[#1A6FB5] text-white font-bold text-base flex items-center justify-center shrink-0 shadow-md">
        {number}
      </div>
      <div>
        <h3 className="text-[#1E293B] font-semibold text-base mb-1">{title}</h3>
        <p className="text-[#64748B] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white">
      <div className="section-container">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1E293B]">
            {HOW_IT_WORKS.HEADING}
          </h2>
          <p className="mt-3 text-[#64748B] text-base lg:text-lg">
            {HOW_IT_WORKS.SUBHEADING}
          </p>
        </div>

        {/* 3-col desktop / stacked mobile */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-6 max-w-4xl mx-auto">
          {HOW_IT_WORKS.STEPS.map((step, i) => (
            <>
              <div key={step.number} className="flex-1">
                <StepCard {...step} />
              </div>
              {/* Connector (desktop only, not after last) */}
              {i < HOW_IT_WORKS.STEPS.length - 1 && (
                <div className="hidden lg:flex items-start pt-5">
                  <div className="w-12 h-px bg-[#E2E8F0] mt-5" />
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
