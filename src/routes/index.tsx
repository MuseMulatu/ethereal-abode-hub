import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { brand, images, posts } from "@/data/site";
import { fetchSiteSettings, getSiteSettings } from "@/lib/cms-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anteniguss Home — Handcrafted Furniture, Made for Living" },
      {
        name: "description",
        content:
          "Handcrafted luxury furniture for modern living in Addis Ababa. Bespoke linen sofas, solid wood dining tables, and tailored lounge pieces made to your room dimensions.",
      },
      {
        property: "og:title",
        content: "Anteniguss Home — Handcrafted Furniture, Made for Living",
      },
      {
        property: "og:description",
        content:
          "Bespoke sofas, dining tables, armchairs, and beds made to order in Addis Ababa. Visit our showroom at Abkem Tower.",
      },
    ],
  }),
  component: Home,
});

/* Sixpenny-exact Category Silhouettes with Superscript Counts */
const SIXPENNY_CATEGORIES = [
  {
    title: "SOFAS",
    count: "18",
    image: images.curvedBoucleSofa,
    to: "/shop",
    search: { category: "sofas" },
  },
  {
    title: "CHAIRS",
    count: "33",
    image: images.boucleArmchair,
    to: "/shop",
    search: { category: "armchairs" },
  },
  {
    title: "SECTIONALS",
    count: "72",
    image: images.curvedSectional,
    to: "/shop",
    search: { category: "sofas" },
  },
  {
    title: "BEDS",
    count: "09",
    image: images.bedVelvet,
    to: "/shop",
    search: { category: "living-kids" },
  },
  {
    title: "DINING",
    count: "24",
    image: images.diningOval,
    to: "/shop",
    search: { category: "dining" },
  },
  {
    title: "TABLES",
    count: "16",
    image: images.consoleSculpted,
    to: "/shop",
    search: { category: "dining" },
  },
];

function Home() {
  const [settings, setSettings] = useState(getSiteSettings());
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSettings(getSiteSettings());
    fetchSiteSettings().then((s) => {
      if (s) setSettings(s);
    });
    const handler = () => setSettings(getSiteSettings());
    window.addEventListener("ante-settings-updated", handler);
    return () => window.removeEventListener("ante-settings-updated", handler);
  }, []);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const distance = 420;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-[#FAF8F5] text-[#2C2F3C] min-h-screen selection:bg-[#2C2F3C] selection:text-[#FAF8F5]">
      {/* 0. Top Promo / Announcement Bar */}
      <div className="border-b border-[#EAE6DE] bg-[#F4F0E8] py-2 text-center">
        <p className="font-serif text-[11px] sm:text-xs tracking-[0.18em] uppercase text-[#555A68]">
          Bespoke Furniture Crafted in Addis Ababa · Visit Our Showroom at Abkem Tower
        </p>
      </div>

      {/* 1. HERO SECTION — Sixpenny "THE GREAT INDOORS" Exact Asymmetric Split */}
      <section className="mx-auto max-w-[125rem] px-6 sm:px-10 lg:px-16 pt-8 pb-16 sm:pt-14 sm:pb-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Spaced Serif Title, Subtitle, Arrow Link */}
          <div className="lg:col-span-5 flex flex-col justify-center py-4 lg:py-12 pr-0 lg:pr-8">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[4.25rem] font-normal tracking-[0.1em] uppercase text-[#2C2F3C] leading-[1.08]">
              {settings.hero?.headline ? (
                settings.hero.headline
              ) : (
                <>
                  THE GREAT
                  <br />
                  INDOORS
                </>
              )}
            </h1>

            <p className="font-serif text-sm sm:text-base text-[#555A68] mt-6 sm:mt-8 leading-relaxed max-w-sm">
              {settings.hero?.subheadline ||
                "Extraordinary comfort. Timeless designs. Handcrafted in Addis Ababa in your preferred dimensions and fabrics."}
            </p>

            <div className="mt-8 sm:mt-10">
              <Link
                to="/shop"
                search={{ category: "sofas" }}
                className="group inline-flex items-center gap-2 font-serif text-xs sm:text-sm tracking-[0.18em] uppercase text-[#2C2F3C] hover:opacity-60 transition-opacity"
              >
                <span>{settings.hero?.ctaLabel || "Shop Seating"}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Generous Landscape Photography */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden aspect-[16/11] w-full bg-[#EAE6DE]">
              <img
                src={settings.hero?.backgroundImage || images.heroImg5171}
                alt="Anteniguss Home Living Suite"
                className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-103"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY CAROUSEL — Sixpenny Exact Gallery with Superscript Item Counts */}
      <section className="border-t border-[#EAE6DE] py-14 sm:py-20">
        <div className="mx-auto max-w-[125rem] px-6 sm:px-10 lg:px-16">
          {/* Scrollable Track */}
          <div
            ref={carouselRef}
            className="flex gap-5 sm:gap-7 overflow-x-auto scrollbar-none scroll-smooth pb-4 select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {SIXPENNY_CATEGORIES.map((cat) => (
              <Link
                key={cat.title}
                to={cat.to}
                search={cat.search}
                className="group flex-none w-[70vw] sm:w-[38vw] lg:w-[22vw] block cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE6DE]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex items-start gap-1">
                  <span className="font-serif text-2xl sm:text-3xl font-light tracking-[0.08em] uppercase text-[#2C2F3C] group-hover:opacity-75 transition-opacity">
                    {cat.title}
                  </span>
                  <sup className="font-serif text-xs tracking-normal text-[#555A68] opacity-80 mt-1">
                    {cat.count}
                  </sup>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Bar: "Explore all categories →" + Arrow Buttons */}
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-[#EAE6DE]/70">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 font-serif text-xs sm:text-sm tracking-[0.16em] uppercase text-[#2C2F3C] hover:opacity-60 transition-opacity"
            >
              <span>Explore all categories</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollCarousel("left")}
                aria-label="Scroll left"
                className="flex h-9 w-9 items-center justify-center text-[#2C2F3C] hover:opacity-50 transition-opacity cursor-pointer text-lg font-serif"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel("right")}
                aria-label="Scroll right"
                className="flex h-9 w-9 items-center justify-center text-[#2C2F3C] hover:opacity-50 transition-opacity cursor-pointer text-lg font-serif"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SPLIT SECTION 1 — Sixpenny Exact "IN STOCK" / "MADE TO ORDER" */}
      <section className="border-t border-[#EAE6DE] py-16 sm:py-24">
        <div className="mx-auto max-w-[125rem] px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left Photo */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-[#EAE6DE]">
                <img
                  src={images.bedVelvet}
                  alt="Anteniguss Home Bedroom Piece"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-1000 hover:scale-103"
                />
              </div>
            </div>

            {/* Right Centered Text */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center text-center px-4 sm:px-12">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[0.15em] uppercase text-[#2C2F3C]">
                IN STOCK
              </h2>
              <p className="font-serif text-sm sm:text-base text-[#555A68] mt-6 leading-relaxed max-w-md">
                Don't rush, but our signature showroom pieces are handcrafted and ready to deliver to your residence within 1–2 weeks.
              </p>
              <Link
                to="/shop"
                search={{ category: "all" }}
                className="group inline-flex items-center gap-2 font-serif text-xs sm:text-sm tracking-[0.18em] uppercase text-[#2C2F3C] mt-8 hover:opacity-60 transition-opacity"
              >
                <span>Shop in stock</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FULL-WIDTH ATMOSPHERIC BANNER — Sixpenny Exact "SWATCHES" */}
      <section className="border-t border-[#EAE6DE] bg-[#9E9689] text-[#FAF8F5]">
        <div className="mx-auto max-w-[125rem] px-6 sm:px-10 lg:px-16 py-20 sm:py-28 flex flex-col md:flex-row md:items-baseline md:justify-between gap-6">
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-[0.18em] uppercase text-white/95">
            SWATCHES
          </h2>
          <a
            href="#visit"
            className="group inline-flex items-center gap-2 font-serif text-xs sm:text-sm tracking-[0.16em] uppercase text-white/90 hover:text-white transition-colors"
          >
            <span>Touch and test 20+ Belgian linens, bouclés, and full-grain leathers at our showroom</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </section>

      {/* 5. SPLIT SECTION 2 — Sixpenny Exact "CUSTOMIZATION" */}
      <section className="border-t border-[#EAE6DE] py-16 sm:py-24">
        <div className="mx-auto max-w-[125rem] px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left Centered Text */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center text-center px-4 sm:px-12 order-2 lg:order-1">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[0.15em] uppercase text-[#2C2F3C]">
                CUSTOMIZATION
              </h2>
              <p className="font-serif text-sm sm:text-base text-[#555A68] mt-6 leading-relaxed max-w-md">
                Make it just the way you want it. Solid dried hardwood carpentry, high-resilience comfort layers, and dimensions tailored to your room layout.
              </p>
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 font-serif text-xs sm:text-sm tracking-[0.18em] uppercase text-[#2C2F3C] mt-8 hover:opacity-60 transition-opacity"
              >
                <span>Explore customization</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            {/* Right Photo */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE6DE]">
                <img
                  src={images.curvedSectional}
                  alt="Custom Modular Sectional"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-1000 hover:scale-103"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SPLIT SECTION 3 — Sixpenny Exact "THE LIBRARY" */}
      <section className="border-t border-[#EAE6DE] py-16 sm:py-24">
        <div className="mx-auto max-w-[125rem] px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left Centered Text */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center text-center px-4 sm:px-12">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[0.15em] uppercase text-[#2C2F3C]">
                THE LIBRARY
              </h2>
              <p className="font-serif text-sm sm:text-base text-[#555A68] mt-6 leading-relaxed max-w-md">
                Unsure where to begin? Here's our master craftsmen's guide to fabrics, room proportions, and living in contemporary Addis Ababa.
              </p>
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 font-serif text-xs sm:text-sm tracking-[0.18em] uppercase text-[#2C2F3C] mt-8 hover:opacity-60 transition-opacity"
              >
                <span>Learn more</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            {/* Right Tall Still-Life Photo */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative aspect-[3/4] max-w-md w-full overflow-hidden bg-[#EAE6DE]">
                <img
                  src={images.journalFeature}
                  alt="Anteniguss Home Design Journal"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-1000 hover:scale-103"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SHOWROOM EXPERIENCE — "VISIT US" at Abkem Tower */}
      <section id="visit" className="border-t border-[#EAE6DE] py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <span className="font-serif text-xs tracking-[0.2em] uppercase text-[#555A68]">
            Meskel Flower · Addis Ababa
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-[0.12em] uppercase text-[#2C2F3C] mt-3">
            VISIT THE SHOWROOM
          </h2>
          <p className="font-serif text-sm sm:text-base text-[#555A68] mt-5 leading-relaxed">
            Experience our full collection of sofas, dining sets, and fabrics in person at Abkem Tower. Compare soft Belgian linen against textured bouclé, and consult directly with our furniture designers.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-serif tracking-widest uppercase">
            <a
              href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
                "Hello Anteniguss Home, I would like to schedule a visit to the Abkem Tower showroom.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#2C2F3C] bg-[#2C2F3C] px-8 py-3.5 text-[#FAF8F5] hover:opacity-90 transition-opacity cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Abkem+Tower+Meskel+Flower+Addis+Ababa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#2C2F3C] px-8 py-3.5 text-[#2C2F3C] hover:bg-[#2C2F3C] hover:text-[#FAF8F5] transition-colors"
            >
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
