import { Link, useRouterState } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

import anteLogo from "@/assets/ante-logo.png";
import { brand } from "@/data/site";
import { cn } from "@/lib/utils";

export const navLinks = [
  { to: "/", label: "Furniture" },
  { to: "/soft-furnishings", label: "Soft Furnishings" },
  { to: "/kids", label: "Kids" },
  { to: "/kitchen", label: "Kitchen" },
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
        <Link to="/" className="z-50 flex items-center">
          <img
            src={anteLogo}
            alt="Anteniguss Home Logo"
            className={cn(
              "h-[50px] w-auto object-contain transition-all duration-700 ease-cinematic sm:h-[80px]",
              !solid && "brightness-0 invert",
            )}
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="eyebrow link-quiet opacity-80 transition-opacity duration-500 hover:opacity-100"
              activeProps={{ className: "opacity-100" }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/anteniguss-look-book-2026.pdf"
            download="Anteniguss-Look-Book-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow inline-flex items-center gap-2 border border-current px-4 py-2 opacity-85 transition-opacity hover:opacity-100"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Catalog</span>
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="eyebrow z-50 lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-border bg-background transition-[max-height] duration-700 ease-cinematic lg:hidden",
          open ? "max-h-[36rem] border-t" : "max-h-0",
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
          <a
            href="/anteniguss-look-book-2026.pdf"
            download="Anteniguss-Look-Book-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
          >
            <Download className="h-4 w-4" />
            Download 2026 Look Book
          </a>
        </nav>
      </div>
    </header>
  );
}
