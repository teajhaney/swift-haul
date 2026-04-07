"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { NAVBAR } from "@/constants/marketing";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <nav className="section-container h-16 flex items-center justify-between">

          <Logo size={32} />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAVBAR.NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "default" }),
                "hidden md:inline-flex bg-primary-light hover:bg-primary-hover text-white font-semibold border-transparent"
              )}
            >
              {NAVBAR.SIGN_IN}
            </Link>

            {/* Hamburger / close toggle — mobile only */}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="md:hidden icon-btn"
              aria-label={isOpen ? NAVBAR.CLOSE_MENU_ARIA_LABEL : NAVBAR.OPEN_MENU_ARIA_LABEL}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Backdrop */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-30 bg-black/40 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Drop-down panel — slides out from below the navbar */}
      <div
        id="mobile-menu"
        aria-hidden={!isOpen}
        className={cn(
          "fixed top-16 left-0 right-0 z-40 bg-surface shadow-lg md:hidden",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        {/* Nav links */}
        <nav className="px-4 pt-3 pb-2 flex flex-col gap-1">
          {NAVBAR.NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-md text-text-primary text-sm font-medium hover:bg-hover-bg transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Sign in CTA */}
        <div className="px-4 pb-5 pt-2 border-t border-border">
          <Link
            href="/login"
            onClick={closeMenu}
            className={cn(
              buttonVariants({ size: "default" }),
              "w-full justify-center bg-primary-light hover:bg-primary-hover text-white font-semibold border-transparent"
            )}
          >
            {NAVBAR.SIGN_IN}
          </Link>
        </div>
      </div>
    </>
  );
}
