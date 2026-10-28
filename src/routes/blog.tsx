import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Clock, MessageCircle, Share2, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { featuredPost, posts } from "@/data/site";
import { getBlogPosts, getDynamicBlogPosts, type DynamicBlogPost } from "@/lib/cms-store";

export const Route = createFileRoute("/blog")({
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

interface ReaderArticle {
  title: string;
  category: string;
  date?: string;
  readTime?: string;
  image?: string;
  excerpt?: string;
  content: string;
}

function Journal() {
  const [dynamicPosts, setDynamicPosts] = useState<DynamicBlogPost[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ReaderArticle | null>(null);

  useEffect(() => {
    setDynamicPosts(getDynamicBlogPosts());
    getBlogPosts().then((items) => {
      if (items && items.length > 0) setDynamicPosts(items);
    });
  }, []);

  // Close reader on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedArticle(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openFeatured = () => {
    setSelectedArticle({
      title: featuredPost.title,
      category: featuredPost.category,
      date: featuredPost.date,
      readTime: featuredPost.readTime,
      image: featuredPost.image,
      excerpt: featuredPost.excerpt,
      content: `${featuredPost.excerpt}

In contemporary Addis Ababa, modern living spaces require both timeless materials and flexible sizing. At our atelier in the heart of the city, we craft bespoke furniture designed around your exact lifestyle and architectural layout.

Every home in Addis Ababa is shaped differently — from sprawling Bole residences to modern Kazanchis apartments. That is why every sofa, dining set and armchair in our collection is made to order in the exact dimensions your room needs, using kiln-dried solid hardwood carpentry and imported Belgian linen, textured bouclé, and supple Ethiopian leather.

Visit our showroom at Abkem Tower or speak directly with our workshop concierge to begin tailoring your home.`,
    });
  };

  const openDynamic = (p: DynamicBlogPost) => {
    setSelectedArticle({
      title: p.title,
      category: p.category,
      date: p.published_at ? new Date(p.published_at).toLocaleDateString() : "Recent",
      readTime: "5 min read",
      image: p.cover_image_url || "/journal-feature.jpg",
      excerpt: p.excerpt,
      content: p.content,
    });
  };

  const openArchive = (p: (typeof posts)[0]) => {
    setSelectedArticle({
      title: p.title,
      category: p.category,
      date: p.date,
      readTime: p.readTime,
      image: p.image,
      excerpt: p.excerpt,
      content: `${p.excerpt}

Understanding proportions and materiality is central to our workshop philosophy in Addis Ababa. When designing for bespoke residential interiors, we prioritize durable solid frames, ergonomic contours, and fabrics that stand up to daily life while retaining tactile warmth.

Whether you are furnishing a new apartment or redesigning your living room suite, our design team is available for custom room measurement consultations across Addis Ababa.`,
    });
  };

  return (
    <>
      <section className="mx-auto max-w-[110rem] px-6 pt-36 pb-12 sm:px-10 sm:pt-44 lg:px-16 lg:pb-16">
        <Reveal>
          <span className="eyebrow text-muted-foreground">Issue 14 — Summer 2026</span>
          <h1 className="display mt-6 max-w-4xl text-5xl sm:text-6xl lg:text-8xl">
            The Design Journal
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Essays on Ethiopian craftsmanship, bespoke residential interiors, and material
            innovations from our workshop and showroom in Addis Ababa.
          </p>
          <div className="rule-line mt-12" />
        </Reveal>
      </section>

      {/* Featured article */}
      <section className="mx-auto max-w-[110rem] px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28">
        <Reveal>
          <article
            onClick={openFeatured}
            className="group grid gap-12 lg:grid-cols-12 lg:gap-16 cursor-pointer"
          >
            <div className="lg:col-span-8">
              <div className="aspect-[16/11] overflow-hidden bg-stone rounded-lg">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-[1.03]"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center lg:col-span-4">
              <span className="eyebrow text-muted-foreground">
                Featured · {featuredPost.category}
              </span>
              <h2 className="display mt-6 text-3xl lg:text-5xl group-hover:underline">
                {featuredPost.title}
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {featuredPost.excerpt}
              </p>
              <p className="mt-8 text-xs tracking-[0.16em] text-muted-foreground uppercase">
                {featuredPost.date} · {featuredPost.readTime}
              </p>
              <span className="eyebrow link-quiet mt-8 self-start inline-flex items-center gap-2 font-semibold text-foreground">
                Read the Full Essay →
              </span>
            </div>
          </article>
        </Reveal>
      </section>

      {/* Dynamic Published Posts (from Admin CMS) */}
      {dynamicPosts.length > 0 && (
        <section className="border-t border-border bg-stone/20 py-20">
          <div className="mx-auto max-w-[110rem] px-6 sm:px-10 lg:px-16">
            <Reveal>
              <SectionHeader eyebrow="Latest Editions" title="Recent Essays" />
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {dynamicPosts.map((post) => (
                <article
                  key={post.slug}
                  onClick={() => openDynamic(post)}
                  className="group flex flex-col justify-between border border-border p-6 rounded-lg bg-background cursor-pointer transition-all duration-300 hover:border-foreground/40 hover:shadow-lg"
                >
                  <div>
                    {post.cover_image_url && (
                      <div className="aspect-[16/10] overflow-hidden rounded mb-4 bg-stone">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-[1.03]"
                        />
                      </div>
                    )}
                    <span className="eyebrow block text-muted-foreground">{post.category}</span>
                    <h3 className="display mt-2 text-2xl text-foreground group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {post.excerpt || post.content.slice(0, 150)}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="uppercase tracking-wider">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString()
                        : "Recently Published"}
                    </span>
                    <span className="font-semibold text-foreground group-hover:underline">
                      Read Essay →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Archive grid */}
      <section className="border-t border-border bg-stone/40">
        <div className="mx-auto max-w-[110rem] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <Reveal>
            <SectionHeader eyebrow="Archive" title="Past Editions" />
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-16">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 80}>
                <article
                  onClick={() => openArchive(post)}
                  className="group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] overflow-hidden bg-background rounded-lg">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-cinematic group-hover:scale-[1.03]"
                      />
                    </div>
                    <span className="eyebrow mt-5 block text-muted-foreground">{post.category}</span>
                    <h3 className="display mt-3 text-2xl group-hover:underline">{post.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="tracking-[0.14em] uppercase">
                      {post.date} · {post.readTime}
                    </span>
                    <span className="font-semibold text-foreground group-hover:underline">
                      Read →
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full Article Reader Modal / Drawer */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/70 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedArticle(null)}
          />

          <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <div className="relative w-full max-w-4xl bg-background rounded-xl shadow-2xl border border-border overflow-hidden my-8">
              {/* Sticky Top Reader Bar */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-md px-6 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Journal</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="eyebrow text-muted-foreground hidden sm:inline">
                    {selectedArticle.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(null)}
                    className="p-1.5 rounded-full hover:bg-stone text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close article"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Reader Body */}
              <div className="p-6 sm:p-10 lg:p-14 space-y-8">
                {/* Meta Header */}
                <div>
                  <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    <span className="font-semibold text-foreground">{selectedArticle.category}</span>
                    <span>·</span>
                    <span>{selectedArticle.date || "Anteniguss Journal"}</span>
                    {selectedArticle.readTime && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {selectedArticle.readTime}
                        </span>
                      </>
                    )}
                  </div>
                  <h1 className="display text-3xl sm:text-4xl lg:text-5xl text-foreground">
                    {selectedArticle.title}
                  </h1>
                </div>

                {/* Hero Cover Image */}
                {selectedArticle.image && (
                  <div className="aspect-[16/10] overflow-hidden rounded-lg bg-stone">
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Lead Excerpt */}
                {selectedArticle.excerpt && (
                  <p className="text-lg sm:text-xl font-serif italic text-muted-foreground border-l-2 border-foreground pl-4 py-1 leading-relaxed">
                    {selectedArticle.excerpt}
                  </p>
                )}

                {/* Formatted Article Content */}
                <div className="prose prose-stone max-w-none space-y-6 text-foreground/90 leading-relaxed text-base sm:text-lg">
                  {selectedArticle.content.split("\n\n").map((para, i) => {
                    const trimmed = para.trim();
                    if (!trimmed) return null;
                    if (trimmed.startsWith("### ")) {
                      return (
                        <h3 key={i} className="display text-2xl mt-8 pt-4 border-t border-border">
                          {trimmed.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith("## ")) {
                      return (
                        <h2 key={i} className="display text-3xl mt-10 pt-4 border-t border-border">
                          {trimmed.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (trimmed.startsWith("- ")) {
                      return (
                        <ul key={i} className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                          {trimmed
                            .split("\n")
                            .map((li, idx) => (
                              <li key={idx}>{li.replace(/^- /, "")}</li>
                            ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={i} className="leading-relaxed text-stone-700">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>

                {/* Workshop Inquiry Concierge Card */}
                <div className="rounded-xl border border-border bg-stone/40 p-8 mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <span className="eyebrow text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Anteniguss Home Atelier
                    </span>
                    <h4 className="display mt-2 text-2xl">
                      Inquire About Custom Pieces in this Article
                    </h4>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg">
                      Our artisans build each sofa, dining table, and accent chair tailored to your
                      room dimensions in Addis Ababa.
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/251911903307?text=${encodeURIComponent(
                      `Hello Anteniguss Home, I was reading your article "${selectedArticle.title}" in The Design Journal and would love to consult on bespoke pieces for my home.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded border border-foreground bg-foreground px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 shrink-0 transition-opacity"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
