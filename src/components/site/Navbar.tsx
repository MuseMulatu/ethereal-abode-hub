import { Link, useRouterState } from "@tanstack/react-router";
import { Download, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import anteLogo from "@/assets/ante-logo.png";
import { QuoteBagDrawer } from "@/components/site/QuoteBagDrawer";
import { brand } from "@/data/site";
import { getQuoteBag } from "@/lib/cms-store";
import { cn } from "@/lib/utils";

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Catalog" },
  { to: "/soft-furnishings", label: "Sofas & Chairs" },
  { to: "/kitchen", label: "Dining" },
  { to: "/kids", label: "Living & Bed" },
  { to: "/blog", label: "Journal" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [bagCount, setBagCount] = useState(0);

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

  // Sync Quote Bag Item Count
  useEffect(() => {
    const updateCount = () => {
      setBagCount(getQuoteBag().length);
    };
    updateCount();
    window.addEventListener("ante-bag-updated", updateCount);
    return () => window.removeEventListener("ante-bag-updated", updateCount);
  }, []);

  const solid = scrolled || !overHero || open;

  return (
    <>
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

          <nav className="hidden items-center gap-6 lg:flex">
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
              className="eyebrow inline-flex items-center gap-2 border border-current px-3 py-1.5 opacity-85 transition-opacity hover:opacity-100 text-xs"
            >
              <Download className="h-3 w-3" />
              <span>Look Book</span>
            </a>

            {/* Quote Bag Button */}
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              className="eyebrow inline-flex items-center gap-2 rounded border border-current px-3.5 py-1.5 transition-all hover:bg-current/10"
              title="Open Bespoke Quote Bag"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Quote</span>
              {bagCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                  {bagCount}
                </span>
              )}
            </button>
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              className="p-2 transition-opacity"
              aria-label="Open Quote Bag"
            >
              <div className="relative">
                <ShoppingBag className="h-5 w-5" />
                {bagCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                    {bagCount}
                  </span>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="eyebrow z-50"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-border bg-background transition-[max-height] duration-700 ease-cinematic lg:hidden",
            open ? "max-h-[38rem] border-t" : "max-h-0",
          )}
        >
          <nav className="flex flex-col px-6 py-6 sm:px-10">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="display border-b border-border py-3.5 text-2xl text-foreground last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className="eyebrow mt-4 text-xs tracking-widest text-muted-foreground uppercase hover:text-foreground"
            >
              Showroom Admin Portal →
            </Link>
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

      {/* Quote Drawer */}
      <QuoteBagDrawer isOpen={bagOpen} onClose={() => setBagOpen(false)} />
    </>
  );
}
