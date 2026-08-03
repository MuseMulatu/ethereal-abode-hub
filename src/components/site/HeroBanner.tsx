import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { useParallax } from "@/components/site/Reveal";

export function HeroBanner({
  image,
  eyebrow,
  headline,
  sub,
  ctaLabel,
  ctaTo,
  height = "screen",
  align = "center",
}: {
  image: string;
  eyebrow?: string;
  headline: string;
  sub?: string;
  ctaLabel?: string;
  ctaTo?: string;
  height?: "screen" | "tall" | "short";
  align?: "center" | "left";
}) {
  const offset = useParallax(0.15);

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
          {eyebrow ? (
            <span className="eyebrow block opacity-75 animate-fade-in">{eyebrow}</span>
          ) : null}
          <h1 className="display mt-8 text-[2.75rem] sm:text-6xl lg:text-7xl animate-fade-in">
            {headline}
          </h1>
          {sub ? (
            <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed opacity-75 sm:text-base animate-fade-in">
              {sub}
            </p>
          ) : null}
          {ctaLabel && ctaTo ? (
            <div className={cn("mt-12 flex", align === "center" ? "justify-center" : "")}>
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
