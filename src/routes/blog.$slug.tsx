import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock, Copy, MessageCircle, Share2, Sparkles } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { brand } from "@/data/site";
import { getBlogPostBySlug, getBlogPosts, type DynamicBlogPost } from "@/lib/cms-store";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getBlogPostBySlug(params.slug);
    if (!post) {
      throw notFound();
    }
    const allPosts = await getBlogPosts();
    const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
    return { post, related };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [{ title: "Article Not Found — Anteniguss Home" }],
      };
    }

    const title = post.meta_title || `${post.title} — The Design Journal`;
    const description =
      post.meta_description ||
      post.excerpt ||
      "An essay on bespoke furniture, materials, and living from Anteniguss Home in Addis Ababa.";
    const imageUrl = post.cover_image_url || "https://anteniguss.com/journal-feature.jpg";
    const canonicalUrl = `https://anteniguss.com/blog/${post.slug}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: imageUrl },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: imageUrl },
        { name: "keywords", content: post.target_keyword || "custom furniture Addis Ababa, sofas Ethiopia" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description,
            image: [imageUrl],
            datePublished: post.published_at || post.created_at || "2026-10-01",
            author: {
              "@type": "Organization",
              name: post.author_name || "Anteniguss Home Atelier",
            },
            publisher: {
              "@type": "Organization",
              name: "Anteniguss Home",
              logo: {
                "@type": "ImageObject",
                url: "https://anteniguss.com/ante-logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
          }),
        },
      ],
    };
  },
  component: BlogPostDetail,
});

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function BlogPostDetail() {
  const { post, related } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareWhatsAppUrl = `https://wa.me/?text=${encodeURIComponent(
    `Read "${post.title}" on Anteniguss Home: ${typeof window !== "undefined" ? window.location.href : `https://anteniguss.com/blog/${post.slug}`}`,
  )}`;

  const inquireWhatsAppUrl = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
    `Hello Anteniguss Home, I read your article "${post.title}" and would like to consult with your workshop on bespoke furniture.`,
  )}`;

  return (
    <article className="min-h-screen bg-background pt-28 pb-24 sm:pt-36">
      {/* Top Header / Breadcrumbs */}
      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Design Journal</span>
        </Link>

        <div className="mt-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="font-semibold text-foreground">{post.category}</span>
            <span>·</span>
            <span>
              {post.published_at ? new Date(post.published_at).toLocaleDateString() : "Editorial"}
            </span>
            {post.read_time && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.read_time}
                </span>
              </>
            )}
          </div>

          <h1 className="display text-4xl sm:text-5xl lg:text-6xl text-foreground text-balance leading-tight">
            {post.title}
          </h1>

          {post.author_name && (
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              By {post.author_name}
            </p>
          )}
        </div>

        {/* Share Bar */}
        <div className="mt-8 flex items-center justify-between border-y border-border py-3 text-xs">
          <span className="text-muted-foreground">Share this essay:</span>
          <div className="flex items-center gap-3">
            <a
              href={shareWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-stone transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-stone transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied Link!" : "Copy Link"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Cover Photography */}
      {post.cover_image_url && (
        <div className="mx-auto max-w-5xl px-6 sm:px-10 mt-10">
          <div className="aspect-[16/10] overflow-hidden rounded-lg bg-stone border border-border/60">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Main Reading Essay */}
      <div className="mx-auto max-w-3xl px-6 sm:px-10 mt-12 space-y-8">
        {post.excerpt && (
          <p className="font-serif text-xl sm:text-2xl italic leading-relaxed text-muted-foreground border-l-2 border-foreground pl-6 py-1">
            {post.excerpt}
          </p>
        )}

        <div className="space-y-6 text-base sm:text-lg leading-relaxed text-foreground/90">
          {post.content.split("\n\n").map((para, i) => {
            const trimmed = para.trim();
            if (!trimmed) return null;
            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={i} className="display text-2xl sm:text-3xl mt-10 pt-4 border-t border-border">
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h2 key={i} className="display text-3xl sm:text-4xl mt-12 pt-6 border-t border-border">
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
              return (
                <ul key={i} className="list-disc pl-6 space-y-2 text-base">
                  {trimmed
                    .split("\n")
                    .map((li, idx) => (
                      <li key={idx}>{renderInlineMarkdown(li.replace(/^[-*]\s+/, ""))}</li>
                    ))}
                </ul>
              );
            }
            return (
              <p key={i} className="leading-relaxed">
                {renderInlineMarkdown(trimmed)}
              </p>
            );
          })}
        </div>

        {/* Workshop Consultation Card */}
        <div className="rounded-xl border border-border bg-stone/40 p-8 sm:p-10 mt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <span className="eyebrow text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Anteniguss Workshop & Showroom
            </span>
            <h3 className="display text-2xl sm:text-3xl">Inquire About Custom Pieces</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
              Every sofa, dining set, and accent chair is handcrafted in Addis Ababa to fit your room dimensions and preferred upholstery fabric.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 shrink-0">
            <a
              href={inquireWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded border border-foreground bg-foreground px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-background hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Concierge</span>
            </a>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded border border-border bg-background px-6 py-3 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-stone transition-colors"
            >
              <span>Explore Furniture Catalog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Related Stories */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[110rem] px-6 sm:px-10 lg:px-16 mt-24 pt-16 border-t border-border">
          <Reveal>
            <SectionHeader eyebrow="Continue Reading" title="More from the Design Journal" />
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <article key={item.slug} className="group flex flex-col justify-between border border-border p-6 rounded-lg bg-background">
                <div>
                  {item.cover_image_url && (
                    <div className="aspect-[16/10] overflow-hidden rounded mb-4 bg-stone">
                      <img
                        src={item.cover_image_url}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
                      />
                    </div>
                  )}
                  <span className="eyebrow block text-muted-foreground">{item.category}</span>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: item.slug }}
                    className="display mt-2 text-xl block text-foreground group-hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.excerpt || item.content.slice(0, 120)}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString() : "Editorial"}
                  </span>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: item.slug }}
                    className="font-semibold text-foreground group-hover:underline"
                  >
                    Read Essay →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
