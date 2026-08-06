import { createFileRoute } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { featuredPost, posts } from "@/data/site";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "The Design Journal — Ante Design" },
      {
        name: "description",
        content:
          "An editorial journal on interiors, materials and craft — essays on stone, bouclé, light and the architecture of stillness.",
      },
      { property: "og:title", content: "The Design Journal — Ante Design" },
      {
        property: "og:description",
        content: "Essays on interiors, materials and craft from the Ante Design atelier.",
      },
    ],
  }),
  component: Journal,
});

function Journal() {
  return (
    <>
      <section className="mx-auto max-w-[110rem] px-6 pt-40 pb-16 sm:px-10 lg:px-16 lg:pt-52">
        <Reveal>
          <span className="eyebrow text-muted-foreground">Issue 14 — Summer 2026</span>
          <h1 className="display mt-8 max-w-4xl text-5xl sm:text-6xl lg:text-8xl">
            The Design Journal
          </h1>
          <div className="rule-line mt-16" />
        </Reveal>
      </section>

      {/* Featured article */}
      <section className="mx-auto max-w-[110rem] px-6 pb-28 sm:px-10 lg:px-16 lg:pb-40">
        <Reveal>
          <article className="group grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <div className="aspect-[16/11] overflow-hidden bg-stone">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover transition-transform duration-[1600ms] ease-cinematic group-hover:scale-[1.03]"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center lg:col-span-4">
              <span className="eyebrow text-muted-foreground">
                Featured · {featuredPost.category}
              </span>
              <h2 className="display mt-8 text-4xl lg:text-5xl">{featuredPost.title}</h2>
              <p className="mt-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {featuredPost.excerpt}
              </p>
              <p className="mt-10 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                {featuredPost.date} · {featuredPost.readTime}
              </p>
              <span className="eyebrow link-quiet mt-10 self-start">Read the Essay</span>
            </div>
          </article>
        </Reveal>
      </section>

      {/* Archive grid */}
      <section className="border-t border-border bg-stone">
        <div className="mx-auto max-w-[110rem] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
          <Reveal>
            <SectionHeader eyebrow="Archive" title="Past editions" />
          </Reveal>
          <div className="mt-20 grid gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 100}>
                <article className="group">
                  <div className="aspect-[4/3] overflow-hidden bg-background">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1600ms] ease-cinematic group-hover:scale-105"
                    />
                  </div>
                  <span className="eyebrow mt-6 block text-muted-foreground">{post.category}</span>
                  <h3 className="display mt-4 text-2xl">{post.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <p className="mt-6 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                    {post.date} · {post.readTime}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
