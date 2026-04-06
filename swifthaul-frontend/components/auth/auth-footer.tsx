import Link from "next/link";
import { AUTH_FOOTER } from "@/constants/auth";

export function AuthFooter() {
  return (
    <footer className="py-6 text-center">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mb-2">
        {AUTH_FOOTER.LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="text-[#94A3B8] hover:text-[#64748B] text-xs transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
      <p className="text-[#94A3B8] text-xs">{AUTH_FOOTER.COPYRIGHT}</p>
    </footer>
  );
}
