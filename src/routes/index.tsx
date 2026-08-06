import { createFileRoute, Link } from "@tanstack/react-router";

import { HeroBanner } from "@/components/site/HeroBanner";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal, useParallax } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { images, newArrivals, posts } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ante Design — Ultra-Luxury Furniture & Interiors" },
      {
        name: "description",
        content:
          "A cinematic showroom of modular sofas, stone kitchens, nursery pieces and soft furnishings. Private viewings and VIP concierge in Addis-Ababa.",
      },
      { property: "og:title", content: "Ante Design — Ultra-Luxury Furniture & Interiors" },
      {
        property: "og:description",
        content:
          "A cinematic showroom of modular sofas, stone kitchens, nursery pieces and soft furnishings.",
      },
    ],
  }),
  component: Home,
});

const collections = [
  { to: "/kitchen", label: "Kitchen & More", image: images.catKitchen, count: "24 pieces" },
  { to: "/kids", label: "Kids", image: images.catKids, count: "18 pieces" },
  { to: "/soft-furnishings", label: "Soft Furnishings", image: images.catSoft, count: "36 pieces" },
] as const;

function Home() {
  const drift = useParallax(0.06);

  return (
    <>
      <HeroBanner
        image={images.heroLiving}
        eyebrow="Ante Design — Est. 2011"
        headline="Interiors that outlive their trends."
        //sub="Modular seating, monolithic stone and undyed textiles, made in limited runs by our atelier in Northern Italy."
        sub="Redefining modern Ethiopian living. Explore our curated selection of high-end home, kitchen, kids, and soft furnishings."
        ctaLabel="View Collection"
        ctaTo="/soft-furnishings"
      />

      {/* Manifesto */}
      <section className="mx-auto max-w-[110rem] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow text-muted-foreground">The House</span>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-8">
            <p className="display text-[1.75rem] leading-[1.35] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.3]">
              We design slowly. Each piece is drawn once, prototyped in solid timber, and released
              only when nothing further can be removed from it.
            </p>
            <Link to="/about" className="eyebrow link-quiet mt-12 inline-block">
              Our Philosophy
            </Link>
          </Reveal>
        </div>
      </section>

      {/* New Arrivals — auto-scrolling */}
      <section className="overflow-hidden border-y border-border bg-stone py-24 lg:py-32">
        <div className="mx-auto max-w-[110rem] px-6 sm:px-10 lg:px-16">
          <Reveal>
            <SectionHeader
              eyebrow="Arriving Now"
              title="New Arrivals"
              intro="The Autumn release — four pieces, each produced in a run of ninety."
            />
          </Reveal>
        </div>

        <div className="mt-20 flex w-max marquee-track gap-6 pl-6 lg:gap-10 lg:pl-16">
          {[...newArrivals, ...newArrivals].map((product, i) => (
            <div key={`${product.id}-${i}`} className="w-[78vw] sm:w-[42vw] lg:w-[26vw]">
              <ProductCard product={product} ratio="portrait" />
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-[110rem] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <Reveal>
          <SectionHeader eyebrow="Browse" title="The Collections" />
        </Reveal>
        <div className="mt-20 grid gap-6 lg:grid-cols-3 lg:gap-10">
          {collections.map((c, i) => (
            <Reveal key={c.label} delay={i * 120}>
              <Link to={c.to} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-stone">
                  <img
                    src={c.image}
                    alt={c.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1600ms] ease-cinematic group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ink/10 transition-colors duration-700 group-hover:bg-ink/25" />
                </div>
                <div className="mt-6 flex items-baseline justify-between">
                  <h3 className="display text-2xl">{c.label}</h3>
                  <span className="text-[0.6875rem] tracking-[0.16em] text-muted-foreground uppercase">
                    {c.count}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Lifestyle — magazine spread */}
      <section className="bg-ink text-ink-foreground">
        <div className="grid lg:grid-cols-2">
          <div className="relative order-2 h-[70vh] overflow-hidden lg:order-1 lg:h-auto lg:min-h-[46rem]">
            <img
              src={images.lifestyle1}
              alt="Sculptural oak chair beside a linen curtain in raking morning light"
              loading="lazy"
              className="h-full w-full object-cover will-change-transform"
              style={{ transform: `translate3d(0, ${-drift}px, 0) scale(1.08)` }}
            />
          </div>
          <div className="order-1 flex items-center px-6 py-24 sm:px-14 lg:order-2 lg:px-20 lg:py-32">
            <Reveal>
              <span className="eyebrow opacity-60">Lifestyle — Volume IV</span>
              <h2 className="display mt-10 text-4xl sm:text-5xl lg:text-[3.5rem]">
                A residence in Old Airport, dressed in one material.
              </h2>
              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                <p className="text-sm leading-relaxed opacity-70">
                  Lime plaster runs from the entry through to the terrace, so the eye never catches
                  on a threshold. Furniture is kept low and unbroken; the only pattern in the house
                  is the shadow of a single olive tree.
                </p>
                <p className="text-sm leading-relaxed opacity-70">
                  We supplied the Aldo modular sofa in undyed bouclé, two travertine tables and the
                  full soft-furnishing programme — fourteen pieces, delivered in one morning.
                </p>
              </div>
              <Link to="/blog" className="eyebrow link-quiet mt-14 inline-block">
                Read the Journal
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Journal teaser */}
      <section className="mx-auto max-w-[110rem] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <Reveal>
          <SectionHeader eyebrow="Design Journal" title="Notes on living well" />
        </Reveal>
        <div className="mt-20 grid gap-14 sm:grid-cols-3 lg:gap-10">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.slug} delay={i * 120}>
              <Link to="/blog" className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-stone">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1600ms] ease-cinematic group-hover:scale-105"
                  />
                </div>
                <span className="eyebrow mt-6 block text-muted-foreground">
                  {post.category} · {post.date}
                </span>
                <h3 className="display mt-4 text-2xl">{post.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Concierge invitation */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-28 text-center lg:py-40">
          <Reveal>
            <SectionHeader
              align="center"
              eyebrow="By Appointment"
              title="Private viewings, seven days a week."
              intro="Our concierge will prepare the showroom around your project — fabric trays, stone samples and a designer in attendance."
            />
            <Link
              to="/contact"
              className="eyebrow mt-14 inline-block border border-foreground px-10 py-5 transition-colors duration-700 hover:bg-ink hover:text-ink-foreground"
            >
              Request an Appointment
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
