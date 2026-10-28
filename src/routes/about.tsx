import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { HeroBanner } from "@/components/site/HeroBanner";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { brand, images } from "@/data/site";
import { fetchSiteSettings, getSiteSettings, type SiteSectionAbout } from "@/lib/cms-store";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Anteniguss Home" },
      {
        name: "description",
        content:
          "Anteniguss Home: furniture for the modern Ethiopian home. Sofas, armchairs, dining and beds made in Addis Ababa. Showroom at Meskel Flower, Abkem Tower.",
      },
      { property: "og:title", content: "About Us — Anteniguss Home" },
      {
        property: "og:description",
        content:
          "Custom furniture for the modern Ethiopian home, made in Addis Ababa. Showroom at Meskel Flower, Abkem Tower.",
      },
    ],
  }),
  component: About,
});

const numbers = [
  { value: "2011", label: "Founded" },
  { value: "100%", label: "Made in Addis Ababa" },
  { value: "20–30", label: "Days custom turnaround" },
  { value: "2", label: "Floors of showroom" },
];

const principles = [
  {
    title: "Made to order",
    body: "Every piece is crafted by our own production team. Tell us your room dimensions and choose the fabric and color.",
  },
  {
    title: "Honest materials",
    body: "Carefully selected bouclé, velvets, and textured weaves on durable solid wood frames built for daily life.",
  },
  {
    title: "Showroom experience",
    body: "Sit on every sofa and feel the fabrics firsthand across two floors at Abkem Tower, Meskel Flower.",
  },
];

function About() {
  const [settings, setSettings] = useState(getSiteSettings());

  useEffect(() => {
    fetchSiteSettings().then((s) => {
      if (s) setSettings(s);
    });
    const handler = () => setSettings(getSiteSettings());
    window.addEventListener("ante-settings-updated", handler);
    return () => window.removeEventListener("ante-settings-updated", handler);
  }, []);

  const about = (settings.about_page || (settings as any).aboutPage) as SiteSectionAbout | undefined;

  return (
    <>
      <HeroBanner
        image={images.heroLivingRoom}
        eyebrow="Anteniguss Home · Addis Ababa"
        headline={about?.title || "Furniture for the modern Ethiopian home."}
        height="tall"
        align="center"
      />

      <section className="mx-auto max-w-[110rem] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow text-muted-foreground">Our Story</span>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-8">
            <p className="display text-[1.75rem] leading-[1.35] sm:text-4xl lg:text-[2.6rem] lg:leading-[1.3]">
              {about?.title ||
                "Anteniguss Home was established in Addis Ababa to design and craft distinctive, high-quality furniture tailored specifically for Ethiopian homes."}
            </p>
            <div className="mt-14 grid gap-10 sm:grid-cols-2">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {about?.story ||
                  "From initial sketch and full-scale prototype to the final hand-finished piece, our master craftsmen take immense pride in every joint, cushion, and stitch. We believe that furniture should not just fill a room—it should create the foundation for your family's life stories."}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Our two-floor showroom at Meskel Flower, Abkem Tower lets you experience full living
                and dining settings in person. Pick your custom size, select your favorite fabric,
                and let our white-glove team deliver and assemble it in your home.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-stone">
        <div className="mx-auto grid max-w-[110rem] gap-12 px-6 py-20 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-16">
          {numbers.map((n, i) => (
            <Reveal key={n.label} delay={i * 100}>
              <p className="display text-5xl lg:text-6xl">{n.value}</p>
              <p className="eyebrow mt-5 text-muted-foreground">{n.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[110rem] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <Reveal>
          <SectionHeader eyebrow="Our Standards" title="Three rules we keep" />
        </Reveal>
        <div className="mt-20 grid gap-14 lg:grid-cols-3 lg:gap-10">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 120}>
              <div className="rule-line" />
              <h3 className="display mt-8 text-3xl">{p.title}</h3>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ink text-ink-foreground">
        <div className="grid lg:grid-cols-2">
          <div className="h-[60vh] overflow-hidden lg:h-auto lg:min-h-[38rem]">
            <img
              src={about?.atelierImage || images.clientHomeLiving}
              alt="Living room interior designed with Anteniguss Home furniture"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center px-6 py-24 sm:px-14 lg:px-20">
            <Reveal>
              <SectionHeader
                tone="light"
                eyebrow="The Showroom"
                title="Abkem Tower, Meskel Flower, Addis Ababa"
                intro="Two complete floors arranged as authentic living and dining interiors rather than a crowded sales floor. Sit on every piece, browse our extensive fabric collection, and chat with our design team."
              />
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="eyebrow inline-block border border-ink-foreground/40 px-10 py-5 transition-colors duration-700 hover:bg-ink-foreground hover:text-ink"
                >
                  Plan Your Visit
                </Link>
                <a
                  href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
                    "Hello Anteniguss Home, I'd like to ask about visiting the showroom.",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow inline-block border border-transparent bg-foreground px-8 py-5 text-background transition-opacity hover:opacity-85"
                >
                  WhatsApp Concierge
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
