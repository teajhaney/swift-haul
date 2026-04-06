import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** "full" = icon + wordmark, "icon" = icon mark only */
  variant?: "full" | "icon";
  /** Use on dark backgrounds — renders wordmark in white */
  dark?: boolean;
  /** Icon size in pixels (default 32) */
  size?: number;
}

/** Reusable SwiftHaul logo. Wraps in a Link to "/" by default. */
export function Logo({
  className,
  variant = "full",
  dark = false,
  size = 32,
}: LogoProps) {
  const iconSize = size;
  const fontSize = Math.round(iconSize * 0.56); // proportional wordmark
  const gap = Math.round(iconSize * 0.25);

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center shrink-0", className)}
      style={{ gap }}
    >
      <LogoIcon size={iconSize} />
      {variant === "full" && (
        <span
          className={cn(
            "font-bold tracking-tight leading-none select-none",
            dark ? "text-white" : "text-[#0F2B46]"
          )}
          style={{ fontSize }}
        >
          SwiftHaul
        </span>
      )}
    </Link>
  );
}

/** Icon mark only — not wrapped in a Link. */
export function LogoIcon({ size = 32, className }: { size?: number; className?: string }) {
  const rx = Math.round(size * 0.25); // proportional border radius

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect width="32" height="32" rx={rx} fill="#1A6FB5" />
      <g
        transform="translate(6,6) scale(0.8333)"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </g>
    </svg>
  );
}
