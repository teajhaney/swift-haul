import Image from "next/image";
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

/** Reusable SwiftHaul logo. Wraps in a Link to "/". */
export function Logo({
  className,
  variant = "full",
  dark = false,
  size = 32,
}: LogoProps) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 shrink-0", className)}>
      <LogoIcon size={size} />
      {variant === "full" && (
        <span className={cn("text-base font-bold tracking-tight leading-none select-none", dark ? "text-white" : "text-primary")}>
          SwiftHaul
        </span>
      )}
    </Link>
  );
}

/** Icon mark only — not wrapped in a Link. Uses /public/logo-icon.svg. */
export function LogoIcon({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo-icon.svg"
      alt="SwiftHaul"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      priority
    />
  );
}
