import { brand, type Product } from "@/data/site";
import { cn } from "@/lib/utils";

function inquiryHref(title: string) {
  const message = encodeURIComponent(
    `Hello ${brand.name} — I would like to inquire about the ${title}.`,
  );
  return `https://wa.me/${brand.whatsapp}?text=${message}`;
}

export function ProductCard({
  product,
  ratio = "portrait",
  className,
}: {
  product: Product;
  ratio?: "portrait" | "square" | "landscape";
  className?: string;
}) {
  return (
    <article className={cn("group", className)}>
      <div
        className={cn(
          "relative overflow-hidden bg-stone",
          ratio === "portrait" && "aspect-[4/5]",
          ratio === "square" && "aspect-square",
          ratio === "landscape" && "aspect-[3/2]",
        )}
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-cinematic group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 flex justify-center p-5 opacity-0 transition-opacity duration-700 ease-cinematic group-hover:opacity-100 group-focus-within:opacity-100">
          <a
            href={inquiryHref(product.title)}
            target="_blank"
            rel="noreferrer"
            className="eyebrow bg-background/95 px-8 py-4 text-foreground backdrop-blur-sm transition-colors duration-500 hover:bg-ink hover:text-ink-foreground"
          >
            Inquire
          </a>
        </div>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="display text-lg sm:text-xl">{product.title}</h3>
        <span className="text-[0.6875rem] tracking-[0.16em] text-muted-foreground uppercase whitespace-nowrap">
          {product.price}
        </span>
      </div>
      <p className="mt-1.5 text-xs tracking-wide text-muted-foreground">{product.detail}</p>
    </article>
  );
}
