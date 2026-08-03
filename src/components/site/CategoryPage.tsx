import { HeroBanner } from "@/components/site/HeroBanner";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import type { Product } from "@/data/site";
import { cn } from "@/lib/utils";

export function CategoryPage({
  eyebrow,
  title,
  headline,
  intro,
  heroImage,
  products,
  note,
}: {
  eyebrow: string;
  title: string;
  headline: string;
  intro: string;
  heroImage: string;
  products: Product[];
  note: string;
}) {
  return (
    <>
      <HeroBanner
        image={heroImage}
        eyebrow={eyebrow}
        headline={headline}
        height="short"
        align="center"
      />

      <section className="mx-auto max-w-[110rem] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <Reveal>
          <SectionHeader eyebrow="The Collection" title={title} intro={intro} />
        </Reveal>

        <div className="mt-20 columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-10 [&>*]:mb-6 lg:[&>*]:mb-10">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={(i % 3) * 90} className="break-inside-avoid">
              <ProductCard
                product={product}
                ratio={
                  product.span === "tall"
                    ? "portrait"
                    : product.span === "wide"
                      ? "landscape"
                      : "square"
                }
              />
            </Reveal>
          ))}
        </div>

        <Reveal className={cn("mt-28 border-t border-border pt-14")}>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{note}</p>
        </Reveal>
      </section>
    </>
  );
}
