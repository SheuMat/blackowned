"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Lock, Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav, moreNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { InstagramIcon, TikTokIcon } from "@/components/icons/SocialIcons";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation (adjust state during render, per React docs)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setMoreOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      // Keep Tab inside the open drawer (it is a modal dialog)
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = [...dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!dialogRef.current.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // The drawer is hidden from lg up, so close it if the window grows
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  useEffect(() => {
    if (!moreOpen) return;
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMoreOpen(false);
      // Don't strand keyboard focus on a link that is about to unmount
      if (moreRef.current?.contains(document.activeElement)) moreButtonRef.current?.focus();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled ? "bg-cream/90 shadow-[0_1px_0_rgb(42_25_16/0.08)] backdrop-blur-md" : "bg-cream",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative inline-flex h-11 items-center gap-1.5 rounded-full px-3.5 font-heading text-[15px] font-semibold text-espresso transition-colors hover:bg-espresso/5",
                  isActive(item.href) && "bg-espresso/[0.07]",
                )}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.href === "/business-support" && <Lock className="h-3.5 w-3.5 text-rose" aria-hidden />}
                {item.label}
                {item.href === "/business-support" && <span className="sr-only"> (members)</span>}
              </Link>
            ))}
            <div
              className="relative"
              ref={moreRef}
              onBlur={(e) => {
                // Close once keyboard focus moves somewhere outside the dropdown
                if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) setMoreOpen(false);
              }}
            >
              <button
                ref={moreButtonRef}
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-controls="more-menu"
                className={cn(
                  "inline-flex h-11 items-center gap-1 rounded-full px-3.5 font-heading text-[15px] font-semibold text-espresso transition-colors hover:bg-espresso/5",
                  (moreOpen || moreNav.some((item) => isActive(item.href))) && "bg-espresso/[0.07]",
                )}
              >
                More
                <ChevronDown className={cn("h-4 w-4 transition-transform", moreOpen && "rotate-180")} aria-hidden />
              </button>
              {moreOpen && (
                <div
                  id="more-menu"
                  className="absolute top-full right-0 mt-2 w-[440px] rounded-3xl border-2 border-espresso bg-cream p-3 shadow-pop"
                >
                  <ul className="grid grid-cols-2 gap-1">
                    {moreNav.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive(item.href) ? "page" : undefined}
                          className={cn(
                            "block rounded-2xl px-3 py-2.5 transition-colors hover:bg-blush",
                            isActive(item.href) && "bg-blush/70",
                          )}
                        >
                          <span className="block font-heading text-[15px] font-bold text-espresso">{item.label}</span>
                          {item.description && <span className="block text-xs text-cocoa">{item.description}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/directory"
              className="hidden h-11 w-11 items-center justify-center rounded-full border-2 border-espresso/15 text-espresso transition-colors hover:border-espresso sm:inline-flex lg:hidden xl:inline-flex"
              aria-label="Search the directory"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>
            <ButtonLink href="/join" variant="pink" size="md" className="hidden sm:inline-flex">
              Join us
            </ButtonLink>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-espresso text-espresso lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer. Lives outside <header>: the header's backdrop-filter
          would otherwise become the containing block for this fixed layer. */}
      <div
        className={cn(
          "fixed inset-0 z-[60] overflow-hidden lg:hidden",
          open ? "pointer-events-auto visible" : "pointer-events-none invisible transition-[visibility] delay-300",
        )}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          className={cn("absolute inset-0 bg-espresso/40 transition-opacity", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <div
          ref={dialogRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-cream transition-transform duration-300 sm:border-l-2 sm:border-espresso",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="sticky top-0 z-10 flex h-[72px] shrink-0 items-center justify-between bg-cream px-4">
            <Logo />
            <button
              ref={closeRef}
              type="button"
              onClick={() => {
                setOpen(false);
                menuButtonRef.current?.focus();
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-espresso"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 px-4 pb-8">
            <ul className="space-y-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3 font-heading text-2xl font-extrabold text-espresso hover:bg-blush",
                      isActive(item.href) && "bg-blush",
                    )}
                  >
                    <span>
                      {item.label}
                      {item.href === "/business-support" && <span className="sr-only"> (members)</span>}
                    </span>
                    {item.href === "/business-support" && <Lock className="h-5 w-5 text-rose" aria-hidden />}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="my-5 h-px bg-espresso/10" />
            <ul className="grid grid-cols-2 gap-1">
              {moreNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center rounded-xl px-4 py-2 font-heading text-base font-semibold leading-snug text-cocoa hover:bg-blush",
                      isActive(item.href) && "bg-blush text-espresso",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3">
              <ButtonLink href="/join" variant="pink" size="lg">
                Join Black Owned Sheffield
              </ButtonLink>
              <ButtonLink href="/directory" variant="primary" size="lg">
                Find a business
              </ButtonLink>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-espresso text-cream"
                aria-label="Instagram (opens in a new tab)"
              >
                <InstagramIcon />
              </a>
              <a
                href={site.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-espresso text-cream"
                aria-label="TikTok (opens in a new tab)"
              >
                <TikTokIcon />
              </a>
              <span className="text-sm text-cocoa">{site.instagramHandle}</span>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
