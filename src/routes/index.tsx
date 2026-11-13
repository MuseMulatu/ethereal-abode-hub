import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Hammer, MessageCircle, Ruler, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { useEffect, useState } from "react";

import { HeroBanner } from "@/components/site/HeroBanner";
import { Reveal } from "@/components/site/Reveal";
import { brand, catalogueSofas, images, posts, type Product } from "@/data/site";
import { fetchSiteSettings, getProducts, getSiteSettings } from "@/lib/cms-store";
import { cn } from "@/lib/utils";

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

/* Sixpenny-inspired Category Gateways — Direct to Shop */
const categoryGateways = [
  {
    to: "/shop",
    search: { category: "sofas" },
    label: "Sofas & Sectionals",
    amharicLabel: "ሶፋዎች እና ሴክሽናሎች",
    desc: "Curved modulars, deep 4 & 5-seaters, relaxed linen lounging",
    image: images.creamSofaHome,
    count: "36+ Silhouettes",
  },
  {
    to: "/shop",
    search: { category: "dining" },
    label: "Dining & Tables",
    amharicLabel: "የመመገቢያ ጠረጴዛዎች",
    desc: "Solid turned-wood tables, dining suites, and credenzas",
    image: images.diningShowroom,
    count: "24+ Designs",
  },
  {
    to: "/shop",
    search: { category: "armchairs" },
    label: "Armchairs & Lounges",
    amharicLabel: "ነጠላ ወንበሮች",
    desc: "Bouclé reading chairs, wingbacks, and accent seating",
    image: images.wingbackReading,
    count: "18+ Pieces",
  },
  {
    to: "/shop",
    search: { category: "living-kids" },
    label: "Living & Bedroom",
    amharicLabel: "የመኝታ እና የሳሎን እቃዎች",
    desc: "Tailored upholstered beds, consoles, and storage pieces",
    image: images.bedVelvet,
    count: "16+ Pieces",
  },
] as const;

const trustPillars = [
  {
    icon: Ruler,
    title: "Bespoke Room Dimensions",
    desc: "Custom scaled to fit your exact floor plan",
  },
  {
    icon: Hammer,
    title: "Handcrafted in Addis Ababa",
    desc: "Solid hardwood frames & master upholstery",
  },
  {
    icon: Sparkles,
    title: "20+ Washable Linens & Bouclés",
    desc: "Touch and test fabric samples at our showroom",
  },
  {
    icon: Truck,
    title: "White-Glove Delivery & Setup",
    desc: "Delivered & assembled directly into your room",
  },
];

function Home() {
  const [settings, setSettings] = useState(getSiteSettings());
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(catalogueSofas.slice(0, 6));

  useEffect(() => {
    setSettings(getSiteSettings());
    fetchSiteSettings().then((s) => {
      if (s) setSettings(s);
    });
    const handler = () => setSettings(getSiteSettings());
    window.addEventListener("ante-settings-updated", handler);
    return () => window.removeEventListener("ante-settings-updated", handler);
  }, []);

  useEffect(() => {
    getProducts({ top_picks: true }).then((items) => {
      if (items && items.length > 0) {
        setFeaturedProducts(
          items.slice(0, 6).map((bp) => ({
            id: String(bp.id),
            title: bp.title,
            amharicName: bp.amharic_name || undefined,
            category: bp.category,
            seatingCapacity: bp.seating_capacity || undefined,
            dimensions: bp.dimensions || undefined,
            description: bp.description || undefined,
            detail: bp.detail || `${bp.seating_capacity || ""} · ${bp.dimensions || ""}`,
            price: bp.price_display,
            image: bp.image_url,
            span: bp.span || "normal",
          })),
        );
      }
    });
  }, []);

  return (
    <div className="bg-white text-foreground">
      {/* 1. Hero Section — Sixpenny-style serene, calm, confident */}
      <HeroBanner
        variant="card"
        image={settings.hero?.backgroundImage || images.heroImg5171}
        amharicEyebrow={settings.hero?.kicker || "አንተ፡ንጉስ · Addis Ababa"}
        headline={settings.hero?.headline || "Furniture for the modern Ethiopian home."}
        sub={
          settings.hero?.subheadline ||
          "Sofas, armchairs, dining suites and beds, handcrafted in Addis Ababa in your preferred dimensions and fabrics."
        }
        ctaLabel="Shop All Collections"
        ctaTo="/shop"
        secondaryCtaLabel="Visit Showroom"
        secondaryCtaTo="#visit"
      />

      {/* 2. Direct Category Gateways (Immediately below Hero — Pure Sixpenny Style) */}
      <section className="mx-auto max-w-[110rem] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-10 border-b border-border">
            <div>
              <span className="eyebrow text-muted-foreground">Direct from the Atelier</span>
              <h2 className="display mt-2 text-3xl sm:text-4xl lg:text-5xl">Explore by Category</h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:opacity-75 transition-opacity"
            >
              <span>View All Pieces ({catalogueSofas.length + 50}+)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {categoryGateways.map((cat, idx) => (
            <Reveal key={cat.label} delay={idx * 80}>
              <Link
                to={cat.to}
                search={cat.search}
                className="group block overflow-hidden rounded-sm border border-border bg-white transition-all duration-300 hover:border-foreground/30 hover:shadow-md"
              >
                {/* Photo container with gentle Sixpenny zoom */}
                <div className="relative aspect-[3/4] overflow-hidden bg-stone">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />
                  <span className="absolute top-4 left-4 rounded bg-white/90 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground border border-border">
                    {cat.count}
                  </span>
                </div>

                {/* Gateway Body */}
                <div className="p-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:underline">
                      {cat.label}
                    </h3>
                  </div>
                  {cat.amharicLabel && (
                    <p className="font-amharic text-xs text-muted-foreground mt-0.5" lang="am">
                      {cat.amharicLabel}
                    </p>
                  )}
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {cat.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <span>Shop {cat.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3. Curated Signature Silhouettes (Direct to Shop & Quote) */}
      <section className="border-t border-border bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[110rem] px-6 sm:px-10 lg:px-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-8">
              <div>
                <span className="eyebrow text-muted-foreground">Signature Silhouettes</span>
                <h2 className="display mt-2 text-3xl sm:text-4xl lg:text-5xl">
                  Bespoke Made-to-Order Pieces
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Each model is custom-scaled to your floor plan and upholstered in your choice of
                  heavy-duty textured bouclé or relaxed natural linen.
                </p>
              </div>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-85 transition-opacity"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Open Furniture Catalog</span>
              </Link>
            </div>
          </Reveal>

          {/* Curated 3-column clean white cards */}
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, idx) => (
              <Reveal key={product.id} delay={idx * 70}>
                <div className="group flex flex-col justify-between overflow-hidden rounded-sm border border-border bg-white transition-all duration-300 hover:border-foreground/30 hover:shadow-lg">
                  {/* Image container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
                    />
                    {product.seatingCapacity && (
                      <span className="absolute top-3 left-3 rounded bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground border border-border">
                        {product.seatingCapacity.replace(" (custom configuration)", "")}
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 rounded bg-ink/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white">
                      {product.price || "Made to Order"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <span className="eyebrow text-[10px] text-muted-foreground uppercase">
                        {product.category || "Living Suite"} · Made in Addis
                      </span>
                      <h3 className="display mt-2 text-xl text-foreground group-hover:underline">
                        {product.title}
                      </h3>
                      {product.amharicName && (
                        <p className="font-amharic text-xs text-muted-foreground mt-0.5" lang="am">
                          {product.amharicName}
                        </p>
                      )}
                      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {product.dimensions || product.detail || "Tailored dimensions with high-resilience foam and hardwood internal frame."}
                      </p>
                    </div>

                    {/* Action buttons directly into /shop */}
                    <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
                      <Link
                        to="/shop"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 border border-foreground bg-foreground py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-background transition-opacity hover:opacity-85"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Customize in Shop</span>
                      </Link>
                      <a
                        href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
                          `Hello Anteniguss Home, I would like to inquire about the ${product.title} and explore custom fabric options.`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 border border-border text-muted-foreground transition-colors hover:text-foreground hover:bg-stone rounded-sm"
                        title="Inquire directly on WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Atelier Craftsmanship Guarantee — Concise, Zero Fluff */}
      <section className="border-t border-border bg-stone py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[110rem] px-6 sm:px-10 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Visual */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border bg-white shadow-sm">
              <img
                src={settings.made_to_order?.imageUrl || (settings as any).madeToOrder?.imageUrl || images.curvedSectional}
                alt="Anteniguss Made to order furniture workshop in Addis Ababa"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Content */}
            <Reveal>
              <div className="flex flex-col gap-5">
                <span className="eyebrow text-muted-foreground">The Made-to-Order Promise</span>
                <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-foreground">
                  {settings.made_to_order?.title || (settings as any).madeToOrder?.title || "Custom Built to Fit Your Floor Plan."}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {settings.made_to_order?.description || (settings as any).madeToOrder?.description ||
                    "Unlike mass-produced imports, every sofa, armchair, and dining table at Anteniguss Home is individually built by our master craftsmen in Addis Ababa. You choose the exact length, cushion firmness, and upholstery fabric."}
                </p>

                {/* 4 Trust Pillars */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {trustPillars.map((tp) => {
                    const Icon = tp.icon;
                    return (
                      <div key={tp.title} className="flex items-start gap-3 rounded border border-border/70 bg-white p-4">
                        <Icon className="h-5 w-5 shrink-0 text-foreground stroke-[1.7] mt-0.5" />
                        <div>
                          <b className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                            {tp.title}
                          </b>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {tp.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-85 transition-opacity"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Browse All Shop Items</span>
                  </Link>
                  <a
                    href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
                      "Hello Anteniguss Home, I would like to send my room floor plan and get custom sizing recommendations.",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-border bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-stone transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Send Room Plan on WhatsApp</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. Showroom Experience (Abkem Tower, 22, Addis Ababa) */}
      <section id="visit" className="border-t border-border bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[110rem] px-6 sm:px-10 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <Reveal>
              <div className="flex flex-col gap-5">
                <span className="eyebrow text-muted-foreground">Showroom Experience</span>
                <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-foreground">
                  {settings.showroom?.headline || "Feel the Fabrics in Person."}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {settings.showroom?.subheadline ||
                    "Our showroom at Abkem Tower displays full living and dining suites. Sit on every sofa, compare soft linen against textured bouclé, and consult directly with our furniture designers."}
                </p>

                <div className="my-2 divide-y divide-border border-y border-border">
                  <div className="py-3.5">
                    <span className="eyebrow text-[10px] text-muted-foreground uppercase">Showroom Address</span>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {settings.showroom?.address || brand.address}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground font-amharic" lang="am">
                      {brand.addressAm}
                    </p>
                  </div>
                  <div className="py-3.5 flex flex-wrap gap-8">
                    <div>
                      <span className="eyebrow text-[10px] text-muted-foreground uppercase">Direct Concierge</span>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {settings.showroom?.phone || brand.phone}
                      </p>
                    </div>
                    <div>
                      <span className="eyebrow text-[10px] text-muted-foreground uppercase">Viewing Hours</span>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        Mon – Sat: 9:00 AM – 7:00 PM (Sun by Appt)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
                      "Hello Anteniguss Home, I would like to schedule a visit to the Abkem Tower showroom.",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-85 transition-opacity"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Abkem+Tower+Meskel+Flower+Addis+Ababa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-border bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-stone transition-colors"
                  >
                    <span>Get Directions (Google Maps)</span>
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Showroom Photo */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border bg-stone">
              <img
                src={settings.showroom?.imageUrl || images.bunaGuests}
                alt="Anteniguss Home Showroom, Abkem Tower Ground Floor"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Design Journal — Direct SEO-friendly links to /blog/$slug */}
      <section className="border-t border-border bg-stone py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[110rem] px-6 sm:px-10 lg:px-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-10 border-b border-border">
              <div>
                <span className="eyebrow text-muted-foreground">Design Journal & Guides</span>
                <h2 className="display mt-2 text-3xl sm:text-4xl lg:text-5xl">Notes on Living Well</h2>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:opacity-75 transition-opacity"
              >
                <span>Read All Journal Articles</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {posts.slice(0, 3).map((post, idx) => (
              <Reveal key={post.slug} delay={idx * 90}>
                {/* DIRECT SEMANTIC LINK TO /blog/$slug */}
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group block overflow-hidden rounded-sm border border-border bg-white transition-all duration-300 hover:border-foreground/30 hover:shadow-md"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-stone">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <span className="eyebrow text-[10px] text-muted-foreground">
                      {post.category} · {post.date}
                    </span>
                    <h3 className="display mt-2.5 text-xl text-foreground group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <span>Read Story</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Quiet Luxury Consultation Strip */}
      <section className="border-t border-border bg-white py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <Reveal>
            <span className="eyebrow text-muted-foreground">Tailored to Your Interior</span>
            <h2 className="display mt-3 text-3xl sm:text-4xl">Ready to Customize Your Living Space?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Explore our full catalogue of sofas, dining tables, and accent furniture, or request a custom quote with your exact room dimensions.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-85 transition-opacity"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Explore Full Catalog</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-border bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-stone transition-colors"
              >
                <span>Book a Consultation</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
