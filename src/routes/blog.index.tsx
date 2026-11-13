import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { featuredPost, posts } from "@/data/site";
import { getBlogPosts, getDynamicBlogPosts, type DynamicBlogPost } from "@/lib/cms-store";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "The Design Journal — Anteniguss Home" },
      {
        name: "description",
        content:
          "An editorial journal on Ethiopian interiors, materials and craft — essays on custom furniture, fabrics, light, and showroom life in Addis Ababa.",
      },
      { property: "og:title", content: "The Design Journal — Anteniguss Home" },
      {
        property: "og:description",
        content: "Essays on interiors, materials and craft from Anteniguss Home in Addis Ababa.",
      },
    ],
  }),
  component: Journal,
});

export function Journal() {
  const [dynamicPosts, setDynamicPosts] = useState<DynamicBlogPost[]>([]);

  useEffect(() => {
    setDynamicPosts(getDynamicBlogPosts());
    getBlogPosts().then((items) => {
      if (items && items.length > 0) setDynamicPosts(items);
    });
  }, []);

  return (
    <div className="bg-background min-h-screen">
      {/* Editorial Header */}
      <section className="mx-auto max-w-[110rem] px-6 pt-36 pb-12 sm:px-10 sm:pt-44 lg:px-16 lg:pb-16">
        <Reveal>
          <span className="eyebrow text-muted-foreground">Issue 14 — 2026 Collection</span>
          <h1 className="display mt-6 max-w-4xl text-5xl sm:text-6xl lg:text-8xl text-foreground">
            The Design Journal
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed">
            Essays on Ethiopian craftsmanship, bespoke residential interiors, and material innovations from our workshop and showroom in Addis Ababa.
          </p>
          <div className="rule-line mt-12" />
        </Reveal>
      </section>

      {/* Featured Lead Article */}
      <section className="mx-auto max-w-[110rem] px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28">
        <Reveal>
          <Link
            to="/blog/$slug"
            params={{ slug: featuredPost.slug }}
            className="group grid gap-12 lg:grid-cols-12 lg:gap-16 items-center"
          >
            <div className="lg:col-span-8">
              <div className="aspect-[16/11] overflow-hidden bg-stone rounded-lg border border-border/50">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-[1.03]"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center lg:col-span-4">
              <span className="eyebrow text-muted-foreground">
                Featured Essay · {featuredPost.category}
              </span>
              <h2 className="display mt-6 text-3xl lg:text-5xl group-hover:underline text-foreground">
                {featuredPost.title}
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {featuredPost.excerpt}
              </p>
              <p className="mt-8 text-xs tracking-[0.16em] text-muted-foreground uppercase flex items-center gap-2">
                <span>{featuredPost.date}</span>
                <span>·</span>
                <span>{featuredPost.readTime}</span>
              </p>
              <span className="eyebrow mt-8 inline-flex items-center gap-2 font-semibold text-foreground group-hover:translate-x-1 transition-transform">
                <span>Read Full Essay</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* Dynamic Published Essays (CMS) */}
      {dynamicPosts.length > 0 && (
        <section className="border-t border-border bg-stone/30 py-20">
          <div className="mx-auto max-w-[110rem] px-6 sm:px-10 lg:px-16">
            <Reveal>
              <SectionHeader eyebrow="Latest Editions" title="Recent Essays" />
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {dynamicPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col justify-between border border-border p-6 rounded-lg bg-background transition-all duration-300 hover:border-foreground/40 hover:shadow-sm"
                >
                  <div>
                    {post.cover_image_url && (
                      <div className="aspect-[16/10] overflow-hidden rounded mb-4 bg-stone border border-border/40">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
                        />
                      </div>
                    )}
                    <span className="eyebrow block text-muted-foreground">{post.category}</span>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="display mt-2 text-2xl block text-foreground group-hover:underline"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {post.excerpt || post.content.slice(0, 140)}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground uppercase tracking-wider">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : "Recently Published"}
                    </span>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="font-semibold text-foreground group-hover:underline flex items-center gap-1"
                    >
                      <span>Read Essay</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Archive Grid */}
      <section className="border-t border-border bg-background py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[110rem] px-6">
          <Reveal>
            <SectionHeader eyebrow="Archive" title="Past Editions" />
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 80}>
                <article className="group flex flex-col justify-between">
                  <div>
                    <div className="aspect-[4/3] overflow-hidden bg-stone rounded-lg border border-border/50">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-105"
                      />
                    </div>
                    <span className="eyebrow mt-5 block text-muted-foreground">{post.category}</span>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="display mt-3 text-2xl block text-foreground group-hover:underline"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="tracking-[0.14em] uppercase">
                      {post.date} · {post.readTime}
                    </span>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="font-semibold text-foreground group-hover:underline flex items-center gap-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
