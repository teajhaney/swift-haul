"use client";

import type { PasswordStrength } from "@/types/auth";

interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): PasswordStrength {
  if (password.length === 0) return "weak";
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return "weak";
  if (score === 2) return "fair";
  if (score === 3) return "good";
  return "strong";
}

const STRENGTH_CONFIG: Record<
  PasswordStrength,
  { label: string; bars: number; barColor: string; textColor: string }
> = {
  weak:   { label: "Weak password",   bars: 1, barColor: "bg-[#EF4444]", textColor: "text-[#EF4444]" },
  fair:   { label: "Fair password",   bars: 2, barColor: "bg-[#F59E0B]", textColor: "text-[#F59E0B]" },
  good:   { label: "Good password",   bars: 3, barColor: "bg-[#3B82F6]", textColor: "text-[#3B82F6]" },
  strong: { label: "Strong password", bars: 4, barColor: "bg-[#10B981]", textColor: "text-[#10B981]" },
};

export function PasswordStrengthBar({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const strength = getStrength(password);
  const { label, bars, barColor, textColor } = STRENGTH_CONFIG[strength];

  return (
    <div className="space-y-1.5 mt-1">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < bars ? barColor : "bg-[#E2E8F0]"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColor}`}>{label}</p>
    </div>
  );
}
