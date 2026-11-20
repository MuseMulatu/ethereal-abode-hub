import { Link, useRouterState } from "@tanstack/react-router";
import { Download, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import anteLogo from "@/assets/ante-logo.png";
import { QuoteBagDrawer } from "@/components/site/QuoteBagDrawer";
import { brand } from "@/data/site";
import { getQuoteBag } from "@/lib/cms-store";
import { cn } from "@/lib/utils";

export const navLinks: { to: string; search?: Record<string, string>; label: string }[] = [
  { to: "/", label: "Home" },
  { to: "/shop", search: { category: "all" }, label: "Products" },
  { to: "/shop", search: { category: "sofas" }, label: "Sofas & Chairs" },
  { to: "/shop", search: { category: "dining" }, label: "Dining" },
  { to: "/shop", search: { category: "living-kids" }, label: "Living & Bed" },
  { to: "/blog", label: "Journal" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

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
          "fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-cinematic border-b border-[#EAE6DE] bg-[#FAF8F5]/95 backdrop-blur-md text-[#2C2F3C]",
          scrolled ? "h-16 shadow-xs" : "h-20 sm:h-24",
        )}
      >
        <div className="mx-auto flex h-full max-w-[120rem] items-center justify-between px-6 sm:px-10 lg:px-16">

          <Link to="/" className="z-50 flex items-center">
            <img
              src={anteLogo}
              alt="Anteniguss Home Logo"
              className={cn(
                "w-auto object-contain transition-all duration-500 ease-cinematic",
                scrolled ? "h-[52px] sm:h-[72px]" : "h-[64px] sm:h-[90px]",
              )}
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex font-serif">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                search={link.search}
                className="text-xs tracking-[0.14em] uppercase text-[#2C2F3C]/80 hover:text-[#2C2F3C] transition-colors"
                activeProps={{ className: "text-[#2C2F3C] font-semibold" }}
              >
                {link.label}
              </Link>
            ))}

            {/* Quote Bag Button */}
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              className="inline-flex items-center gap-2 rounded-xs border border-[#2C2F3C] px-3.5 py-1.5 transition-all hover:bg-[#2C2F3C] hover:text-[#FAF8F5] text-xs tracking-wider uppercase ml-2 cursor-pointer"
              title="Open Bespoke Quote Bag"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Quote</span>
              {bagCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2C2F3C] text-[10px] font-bold text-[#FAF8F5]">
                  {bagCount}
                </span>
              )}
            </button>
          </nav>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              className="p-2 transition-opacity text-[#2C2F3C]"
              aria-label="Open Quote Bag"
            >
              <div className="relative">
                <ShoppingBag className="h-5 w-5" />
                {bagCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#2C2F3C] text-[10px] font-bold text-[#FAF8F5]">
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
              className="text-xs uppercase tracking-widest z-50 font-serif text-[#2C2F3C]"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-border bg-white transition-[max-height] duration-700 ease-cinematic lg:hidden",
            open ? "max-h-[38rem] border-t" : "max-h-0",
          )}
        >
          <nav className="flex flex-col px-6 py-6 sm:px-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                search={link.search}
                className="display border-b border-border py-3.5 text-2xl text-foreground last:border-b-0 hover:text-foreground/75"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              className="eyebrow mt-5 text-xs tracking-widest text-muted-foreground uppercase hover:text-foreground"
            >
              Showroom Staff Portal →
            </Link>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-background transition-opacity hover:opacity-85"
            >
              <ShoppingBag className="h-4 w-4" />
              Browse Products & Customize
            </Link>
          </nav>
        </div>
      </header>

      {/* Quote Drawer */}
      <QuoteBagDrawer isOpen={bagOpen} onClose={() => setBagOpen(false)} />
    </>
  );
}
