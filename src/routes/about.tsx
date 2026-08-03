import { createFileRoute, Link } from "@tanstack/react-router";

import { HeroBanner } from "@/components/site/HeroBanner";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { images } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Maison Lumé" },
      {
        name: "description",
        content:
          "Founded in 2011, Maison Lumé designs and makes furniture in limited runs, with an atelier in Northern Italy and a showroom in Dubai.",
      },
      { property: "og:title", content: "About Us — Maison Lumé" },
      {
        property: "og:description",
        content: "A house of limited-run furniture, with an atelier in Italy and a Dubai showroom.",
      },
    ],
  }),
  component: About,
});

const numbers = [
  { value: "2011", label: "Founded" },
  { value: "90", label: "Pieces per run" },
  { value: "14", label: "Master joiners" },
  { value: "38", label: "Countries delivered" },
];

const principles = [
  {
    title: "One drawing",
    body: "A piece is drawn once and prototyped in solid timber. If a revision is needed, the design was not ready.",
  },
  {
    title: "Honest material",
    body: "Undyed textiles, unfilled stone, oiled timber. Nothing is finished to hide what it is made of.",
  },
  {
    title: "Limited runs",
    body: "Ninety of each piece per year. Scarcity is not a marketing device; it is the natural output of our workshop.",
  },
];

function About() {
  return (
    <>
      <HeroBanner
        image={images.aboutAtelier}
        eyebrow="Since 2011"
        headline="Fourteen hands, ninety pieces a year."
        height="tall"
        align="center"
      />

      <section className="mx-auto max-w-[110rem] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow text-muted-foreground">Our Philosophy</span>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-8">
            <p className="display text-[1.75rem] leading-[1.35] sm:text-4xl lg:text-[2.6rem] lg:leading-[1.3]">
              Maison Lumé began as a two-bench joinery outside Udine, making tables for architects
              who wanted something they could not buy.
            </p>
            <div className="mt-14 grid gap-10 sm:grid-cols-2">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Fifteen years later the method has not changed. Our joiners still cut every frame
                from air-dried European oak and ash, still fit drawers by hand, and still refuse to
                release a design until nothing further can be removed from it.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                What changed is the reach. A Dubai showroom, a workshop in Al Quoz for soft
                furnishings, and clients in thirty-eight countries who ask us to do the whole house
                rather than a single room.
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
          <SectionHeader eyebrow="Method" title="Three rules we keep" />
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
              src={images.showroom}
              alt="The Maison Lumé showroom at dusk, lit behind a full-height glass facade"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center px-6 py-24 sm:px-14 lg:px-20">
            <Reveal>
              <SectionHeader
                tone="light"
                eyebrow="The Showroom"
                title="Alserkal Avenue, Dubai"
                intro="Twelve hundred square metres arranged as four complete interiors rather than a floor of products. Fabric library, stone bench and a designer always on the floor."
              />
              <Link
                to="/contact"
                className="eyebrow mt-14 inline-block border border-ink-foreground/40 px-10 py-5 transition-colors duration-700 hover:bg-ink-foreground hover:text-ink"
              >
                Plan Your Visit
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
