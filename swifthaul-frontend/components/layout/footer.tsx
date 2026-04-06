import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { FOOTER } from "@/constants/marketing";

export function Footer() {
  return (
    <footer className="bg-[#0F2B46] border-t border-white/10">
      <div className="section-container py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Logo size={28} dark />

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {FOOTER.LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[#64748B] hover:text-white text-xs transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center sm:text-left text-[#475569] text-xs">
          {FOOTER.COPYRIGHT}
        </p>
      </div>
    </footer>
  );
}
