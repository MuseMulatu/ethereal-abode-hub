import { createFileRoute, Link } from "@tanstack/react-router";
import { Hammer, MessageCircle, Ruler, Truck } from "lucide-react";

import { HeroBanner } from "@/components/site/HeroBanner";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { brand, catalogueSofas, images, posts } from "@/data/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anteniguss Home — Furniture for the modern Ethiopian home" },
      {
        name: "description",
        content:
          "Furniture for the modern Ethiopian home. Sofas, armchairs, dining sets and beds, made in Addis Ababa in the size and fabric you choose. Showroom at Meskel Flower, Abkem Tower.",
      },
      {
        property: "og:title",
        content: "Anteniguss Home — Furniture for the modern Ethiopian home",
      },
      {
        property: "og:description",
        content:
          "Sofas, armchairs, dining sets and beds, made in Addis Ababa in the size and fabric you choose.",
      },
    ],
  }),
  component: Home,
});

const collections = [
  {
    to: "/soft-furnishings",
    label: "Sofas & Armchairs",
    image: images.creamSofaHome,
    count: "36 pieces",
  },
  {
    to: "/kitchen",
    label: "Dining & Tables",
    image: images.diningShowroom,
    count: "24 pieces",
  },
  {
    to: "/kids",
    label: "Bedroom & Living",
    image: images.bedVelvet,
    count: "18 pieces",
  },
] as const;

const rooms = [
  {
    to: "/soft-furnishings",
    label: "Living room",
    image: images.clientHomeLiving,
    alt: "Bright living room with curved cream modular sectional",
  },
  {
    to: "/kitchen",
    label: "Dining room",
    image: images.diningOval,
    alt: "Oval dining table with turned wood legs and grey chairs",
  },
  {
    to: "/soft-furnishings",
    label: "Reading corner",
    image: images.wingbackReading,
    alt: "Reading lounge with navy velvet wingback chair",
  },
] as const;

const trustFeatures = [
  {
    icon: MessageCircle,
    title: "Order on WhatsApp",
    desc: "Send a photo, get price and options",
    href: `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
      "Hello Anteniguss Home, I'd like to ask about your furniture.",
    )}`,
  },
  {
    icon: Ruler,
    title: "Custom sizes",
    desc: "Made to fit your room",
  },
  {
    icon: Truck,
    title: "Delivery & setup",
    desc: "Across Addis Ababa",
  },
  {
    icon: Hammer,
    title: "Made in Addis Ababa",
    desc: "By our own production team",
  },
];

function Home() {
  return (
    <>
      {/* Hero Banner */}
      <HeroBanner
        variant="card"
        image={images.heroImg5171}
        amharicEyebrow="አንተ፡ንጉስ · Addis Ababa"
        headline="Furniture for the modern Ethiopian home."
        sub="Sofas, armchairs, dining sets and beds, made in Addis Ababa in the size and fabric you choose."
        ctaLabel="Shop sofas"
        ctaTo="/soft-furnishings"
        secondaryCtaLabel="Shop all"
        secondaryCtaTo="/soft-furnishings"
      />

      {/* Trust row — 4-column grid with Lucide icons */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto max-w-[110rem] px-4 sm:px-6 lg:px-16">
          <ul className="m-0 grid list-none grid-cols-1 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {trustFeatures.map((item, idx) => {
              const Icon = item.icon;
              const Content = (
                <div
                  className={cn(
                    "flex items-start gap-4 px-4 py-6 transition-colors sm:px-6",
                    item.href && "hover:bg-muted/40",
                    idx > 0 && "border-t border-border sm:border-t-0",
                    idx % 2 === 1 && "sm:border-l sm:border-border lg:border-l-0",
                    idx >= 2 && "sm:border-t sm:border-border lg:border-t-0",
                    idx > 0 && "lg:border-l lg:border-border",
                  )}
                >
                  <Icon className="h-6 w-6 shrink-0 text-foreground stroke-[1.6]" />
                  <div>
                    <b className="block text-sm font-semibold text-foreground sm:text-[0.95rem]">
                      {item.title}
                    </b>
                    <span className="mt-0.5 block text-xs text-muted-foreground sm:text-[0.85rem]">
                      {item.desc}
                    </span>
                  </div>
                </div>
              );

              return (
                <li key={item.title}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-inherit no-underline"
                    >
                      {Content}
                    </a>
                  ) : (
                    Content
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Top picks: sofas — featuring extracted catalogue sofas */}
      <section className="overflow-hidden border-b border-border bg-stone py-20 lg:py-28">
        <div className="mx-auto max-w-[110rem] px-6 sm:px-10 lg:px-16">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Top picks: sofas
                </h2>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  Sofas you can sit on in our showroom.
                </p>
              </div>
              <Link
                to="/soft-furnishings"
                className="text-xs font-semibold text-foreground underline underline-offset-4 hover:opacity-80 sm:text-sm"
              >
                View all sofas →
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="marquee-track mt-14 flex w-max gap-6 pl-6 lg:gap-8 lg:pl-16">
          {[...catalogueSofas.slice(0, 6), ...catalogueSofas.slice(0, 6)].map((product, i) => (
            <div key={`${product.id}-${i}`} className="w-[78vw] sm:w-[42vw] lg:w-[26vw]">
              <ProductCard product={product} ratio="portrait" />
            </div>
          ))}
        </div>
      </section>

      {/* Made to order — split promo */}
      <section id="custom" className="mx-auto max-w-[110rem] px-4 py-16 sm:px-6 sm:py-24 lg:px-16">
        <div className="grid overflow-hidden border border-border/50 bg-stone lg:grid-cols-[1.2fr_1fr]">
          {/* Left: image */}
          <div className="relative min-h-[340px] overflow-hidden bg-muted sm:min-h-[440px] lg:min-h-[500px]">
            <img
              src={images.curvedSectional}
              alt="Cream curved sectional sofa"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[center_62%] transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Right: text content */}
          <div className="flex flex-col justify-center gap-4 p-8 sm:gap-5 sm:p-12 lg:p-16">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Made to order
            </span>
            <h2 className="text-balance text-2xl font-semibold leading-[1.2] tracking-tight text-foreground sm:text-3xl lg:text-[2.2rem]">
              Your size. Your fabric. Made in Addis.
            </h2>
            <p className="max-w-[42ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
              Every sofa, chair and table is built by our own production team. Tell us your room
              size and pick the fabric and colour.
            </p>
            <ul className="m-0 my-2 grid list-none gap-2.5 p-0 text-sm text-foreground/90 sm:text-[0.92rem]">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-foreground" />
                <span>Custom orders ready in about 20–30 days</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-foreground" />
                <span>See and feel fabrics at the showroom</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-foreground" />
                <span>Delivery and setup by our team</span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
                  "Hello Anteniguss Home, I'd like a custom size or fabric.",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
              >
                <MessageCircle className="h-4 w-4" />
                Start a custom order
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="mx-auto max-w-[110rem] border-t border-border px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <Reveal>
          <div className="mb-14">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Shop by category
            </h2>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Explore furniture collections crafted for modern spaces.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {collections.map((c, i) => (
            <Reveal key={c.label} delay={i * 120}>
              <Link to={c.to} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden border border-border/40 bg-stone">
                  <img
                    src={c.image}
                    alt={c.label}
                    loading="lazy"
                    className="ease-cinematic h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ink/10 transition-colors duration-700 group-hover:bg-ink/25" />
                </div>
                <div className="mt-5 flex items-baseline justify-between">
                  <h3 className="text-xl font-semibold text-foreground group-hover:underline">
                    {c.label}
                  </h3>
                  <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {c.count}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Shop by room — matching index.html structure */}
      <section className="mx-auto max-w-[110rem] border-t border-border px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <Reveal>
          <div className="mb-14">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Shop by room
            </h2>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Rooms styled with Anteniguss pieces.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {rooms.map((room, i) => (
            <Reveal key={room.label} delay={i * 120}>
              <Link
                to={room.to}
                className="group relative block aspect-[3/4] overflow-hidden border border-border/40 bg-stone"
              >
                <img
                  src={room.image}
                  alt={room.alt}
                  loading="lazy"
                  className="ease-cinematic h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
                />
                <span className="absolute bottom-4 left-4 bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
                  {room.label}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Showroom visit */}
      <section id="visit" className="border-t border-border bg-stone/40">
        <div className="mx-auto max-w-[110rem] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden border border-border/50 bg-stone">
              <img
                src={images.bunaGuests}
                alt="Visitors welcomed at Anteniguss Home showroom, Abkem Tower"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <Reveal>
              <div className="flex flex-col gap-6">
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Showroom
                </span>
                <h2 className="text-3xl font-semibold leading-[1.2] tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]">
                  Visit our showroom
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Two floors of sofas, dining and bedroom furniture. Sit on every piece and feel the
                  fabrics before you order.
                </p>

                <dl className="grid gap-4 border-y border-border/70 py-6 text-sm sm:text-base">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      Address
                    </dt>
                    <dd className="mt-1 font-medium text-foreground">
                      {brand.address}
                      <span
                        className="mt-0.5 block text-xs text-muted-foreground sm:text-sm"
                        lang="am"
                      >
                        {brand.addressAm}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      Phone
                    </dt>
                    <dd className="mt-1 font-medium text-foreground">{brand.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      Email
                    </dt>
                    <dd className="mt-1 font-medium text-foreground">{brand.email}</dd>
                  </div>
                </dl>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
                      "Hello Anteniguss Home, I'd like to visit the showroom.",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Abkem+Tower+Meskel+Flower+Addis+Ababa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-foreground bg-transparent px-6 py-3.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-85"
                  >
                    Get directions
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Journal teaser */}
      <section className="mx-auto max-w-[110rem] border-t border-border px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <Reveal>
          <SectionHeader eyebrow="Design Journal" title="Notes on living well" />
        </Reveal>
        <div className="mt-16 grid gap-12 sm:grid-cols-3 lg:gap-10">
          {posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.slug} delay={i * 120}>
              <Link to="/blog" className="group block">
                <div className="aspect-[4/3] overflow-hidden border border-border/40 bg-stone">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="ease-cinematic h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
                  />
                </div>
                <span className="eyebrow mt-5 block text-muted-foreground">
                  {post.category} · {post.date}
                </span>
                <h3 className="mt-3 text-xl font-semibold text-foreground">{post.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Concierge invitation */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center lg:py-32">
          <Reveal>
            <SectionHeader
              align="center"
              eyebrow="By Appointment"
              title="Private viewings, seven days a week."
              intro="Our team will prepare the showroom around your project — fabric trays, wood samples and a designer in attendance."
            />
            <Link
              to="/contact"
              className="mt-12 inline-block border border-foreground bg-foreground px-10 py-4 text-sm font-semibold text-background transition-opacity hover:opacity-85"
            >
              Request an Appointment
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
