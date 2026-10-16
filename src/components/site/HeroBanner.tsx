import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { useParallax } from "@/components/site/Reveal";

export interface HeroBannerProps {
  image: string;
  eyebrow?: string;
  amharicEyebrow?: string;
  headline: string;
  sub?: string;
  ctaLabel?: string;
  ctaTo?: string;
  secondaryCtaLabel?: string;
  secondaryCtaTo?: string;
  height?: "screen" | "tall" | "short";
  align?: "center" | "left";
  variant?: "card" | "classic";
}

export function HeroBanner({
  image,
  eyebrow,
  amharicEyebrow,
  headline,
  sub,
  ctaLabel,
  ctaTo,
  secondaryCtaLabel,
  secondaryCtaTo,
  height = "screen",
  align = "center",
  variant = "classic",
}: HeroBannerProps) {
  const offset = useParallax(0.12);

  if (variant === "card") {
    return (
      <section className="relative w-full overflow-hidden bg-stone">
        <div className="relative w-full overflow-hidden bg-muted">
          <img
            src={image}
            alt={headline}
            className="h-[clamp(360px,62vw,640px)] w-full object-cover object-center"
            fetchPriority="high"
          />
        </div>

        <div className="mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-8 sm:pointer-events-none sm:absolute sm:inset-x-0 sm:bottom-10 z-10">
          <div className="sm:pointer-events-auto max-w-[30rem] bg-background p-7 sm:p-9 shadow-sm sm:shadow-lg border border-border/50 flex flex-col gap-3.5 my-4 sm:my-0">
            {amharicEyebrow || eyebrow ? (
              <span
                className="text-xs sm:text-[0.9rem] font-medium text-muted-foreground tracking-normal font-sans"
                lang="am"
              >
                {amharicEyebrow || eyebrow}
              </span>
            ) : null}
            <h1 className="text-[1.8rem] sm:text-3xl lg:text-[2.6rem] font-semibold tracking-tight text-foreground leading-[1.15] text-balance">
              {headline}
            </h1>
            {sub ? (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{sub}</p>
            ) : null}
            {(ctaLabel && ctaTo) || (secondaryCtaLabel && secondaryCtaTo) ? (
              <div className="flex flex-wrap items-center gap-2.5 pt-1.5">
                {ctaLabel && ctaTo ? (
                  <Link
                    to={ctaTo}
                    className="inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
                  >
                    {ctaLabel}
                  </Link>
                ) : null}
                {secondaryCtaLabel && secondaryCtaTo ? (
                  <Link
                    to={secondaryCtaTo}
                    className="inline-flex items-center justify-center gap-2 border border-foreground bg-transparent px-6 py-3.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-85"
                  >
                    {secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-ink",
        height === "screen" && "h-screen min-h-[36rem]",
        height === "tall" && "h-[80vh] min-h-[30rem]",
        height === "short" && "h-[58vh] min-h-[24rem]",
      )}
    >
      <div
        className="absolute inset-0 -top-[12%] h-[124%] will-change-transform"
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      >
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      </div>
      <div className="image-veil absolute inset-0" />

      <div
        className={cn(
          "relative z-10 flex h-full flex-col justify-end px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28",
          align === "center" && "items-center text-center",
        )}
      >
        <div className={cn("max-w-3xl text-ink-foreground", align === "center" && "mx-auto")}>
          {eyebrow ? <span className="eyebrow hero-in block opacity-75">{eyebrow}</span> : null}
          <h1
            className="display hero-in mt-8 text-[2.75rem] sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "120ms" }}
          >
            {headline}
          </h1>
          {sub ? (
            <p
              className="hero-in mx-auto mt-8 max-w-xl text-sm leading-relaxed opacity-75 sm:text-base"
              style={{ animationDelay: "240ms" }}
            >
              {sub}
            </p>
          ) : null}
          {ctaLabel && ctaTo ? (
            <div
              className={cn("hero-in mt-12 flex", align === "center" ? "justify-center" : "")}
              style={{ animationDelay: "360ms" }}
            >
              <Link
                to={ctaTo}
                className="eyebrow border border-ink-foreground/40 px-10 py-5 text-ink-foreground transition-colors duration-700 hover:border-ink-foreground hover:bg-ink-foreground hover:text-ink"
              >
                {ctaLabel}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
