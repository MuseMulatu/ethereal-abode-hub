import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { brand } from "@/data/site";
import { cn } from "@/lib/utils";

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/kitchen", label: "Kitchen & More" },
  { to: "/kids", label: "Kids" },
  { to: "/soft-furnishings", label: "Soft Furnishings" },
  { to: "/blog", label: "Journal" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const overHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || !overHero || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-700 ease-cinematic",
        solid
          ? "border-b border-border bg-background/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[110rem] items-center justify-between px-6 transition-all duration-700 ease-cinematic sm:px-10 lg:px-16",
          solid ? "h-16" : "h-24",
          solid ? "text-foreground" : "text-ink-foreground",
        )}
      >
        <Link to="/" className="display text-xl tracking-[0.32em] uppercase sm:text-[1.35rem]">
          {brand.name}
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="eyebrow link-quiet opacity-80 transition-opacity duration-500 hover:opacity-100"
              activeProps={{ className: "opacity-100" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="eyebrow lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-border bg-background transition-[max-height] duration-700 ease-cinematic lg:hidden",
          open ? "max-h-[32rem] border-t" : "max-h-0",
        )}
      >
        <nav className="flex flex-col px-6 py-6 sm:px-10">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="display border-b border-border py-4 text-2xl text-foreground last:border-b-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
