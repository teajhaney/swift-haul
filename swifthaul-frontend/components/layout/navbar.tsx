"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { NAVBAR } from "@/constants/marketing";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0]">
      <nav className="section-container h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo size={32} />

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAVBAR.NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[#64748B] hover:text-[#1E293B] text-sm font-medium transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ size: "default" }),
              "hidden md:inline-flex bg-[#1A6FB5] hover:bg-[#145A94] text-white font-semibold border-transparent"
            )}
          >
            {NAVBAR.SIGN_IN}
          </Link>

          {/* Mobile hamburger / close */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-md text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition-colors"
            aria-label={isOpen ? NAVBAR.CLOSE_MENU_ARIA_LABEL : NAVBAR.OPEN_MENU_ARIA_LABEL}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-[#E2E8F0]",
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="section-container pb-4 pt-2 flex flex-col gap-1">
          {NAVBAR.NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-md text-[#1E293B] text-sm font-medium hover:bg-[#F8FAFC] transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="mt-2 pt-3 border-t border-[#E2E8F0]">
            <Link
              href="/login"
              onClick={closeMenu}
              className={cn(
                buttonVariants({ size: "default" }),
                "w-full justify-center bg-[#1A6FB5] hover:bg-[#145A94] text-white font-semibold border-transparent"
              )}
            >
              {NAVBAR.SIGN_IN}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
