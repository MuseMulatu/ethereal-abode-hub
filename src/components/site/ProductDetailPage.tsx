import { Link } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, Ruler, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DEFAULT_PRODUCT_COLORS, type Product, type ProductColorOption } from "@/data/site";
import { addToQuoteBag } from "@/lib/cms-store";

function parseOptions(raw: string[] | undefined, fallback: string[]) {
  if (!raw?.length) return fallback;
  return raw.flatMap((item) => {
    if (typeof item === "string") {
      try {
        const parsed: unknown = JSON.parse(item);
        if (Array.isArray(parsed)) {
          return parsed.map((option) =>
            typeof option === "string" ? option : String(option.name || option),
          );
        }
      } catch {
        return [item];
      }
    }
    return [item];
  });
}

function cssColorTreatment(color: ProductColorOption) {
  const colorName = color.name.toLowerCase();
  if (colorName.includes("black")) return "grayscale(1) brightness(.42) contrast(1.15)";
  if (colorName.includes("white")) return "grayscale(1) brightness(1.25) contrast(.82)";

  const match = color.color.match(/^#([0-9a-f]{6})$/i);
  if (!match) return "none";
  const value = Number.parseInt(match[1]!, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  const max = Math.max(red, green, blue) / 255;
  const min = Math.min(red, green, blue) / 255;
  const delta = max - min;
  let hue = 0;
  if (delta) {
    if (max === red / 255) hue = ((green - blue) / 255 / delta) % 6;
    else if (max === green / 255) hue = (blue - red) / 255 / delta + 2;
    else hue = (red - green) / 255 / delta + 4;
  }
  hue = (hue * 60 + 360) % 360;
  return `sepia(.25) saturate(1.35) hue-rotate(${hue - 30}deg)`;
}

export function ProductDetailPage({ product }: { product: Product }) {
  const gallery = useMemo(
    () =>
      [...new Set([product.image, ...(product.gallery_images || [])].filter(Boolean))].slice(0, 5),
    [product.image, product.gallery_images],
  );
  const colors = useMemo(
    () => (product.color_options?.length ? product.color_options : DEFAULT_PRODUCT_COLORS),
    [product.color_options],
  );
  const woodOptions = useMemo(
    () =>
      parseOptions(product.wood_options, ["Wanza (Cordia)", "Solid Teak", "Mahogany", "White Oak"]),
    [product.wood_options],
  );
  const fabricOptions = useMemo(
    () =>
      parseOptions(product.fabric_options, [
        "Textured Bouclé (Warm Cream)",
        "Belgian Linen (Sand Stone)",
        "Plush Velvet (Olive Moss)",
        "Plush Velvet (Addis Terracotta)",
        "Full-Grain Leather (Cognac)",
      ]),
    [product.fabric_options],
  );
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedWood, setSelectedWood] = useState(woodOptions[0] || "");
  const [selectedFabric, setSelectedFabric] = useState(fabricOptions[0] || "");
  const [selectedColor, setSelectedColor] = useState<ProductColorOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customNotes, setCustomNotes] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setImageIndex(0);
    setSelectedWood(woodOptions[0] || "");
    setSelectedFabric(fabricOptions[0] || "");
    setSelectedColor(null);
    setQuantity(1);
    setCustomNotes("");
  }, [product.id, fabricOptions, woodOptions]);

  const mappedImage = selectedColor?.image_url;
  const previewImage = selectedColor
    ? mappedImage || gallery[0] || product.image
    : gallery[imageIndex] || product.image;
  const previewStyle =
    selectedColor && !mappedImage
      ? { filter: cssColorTreatment(selectedColor), transition: "filter 250ms ease" }
      : undefined;

  const handleAddToBag = () => {
    addToQuoteBag({
      productId: product.id,
      productName: product.title,
      productImage: previewImage,
      dimensions: product.dimensions || product.detail,
      selectedWood,
      selectedFabric,
      quantity,
      ...(selectedColor ? { selectedColor: selectedColor.name } : {}),
      ...(customNotes.trim() ? { customNotes: customNotes.trim() } : {}),
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const changeImage = (direction: -1 | 1) => {
    setSelectedColor(null);
    setImageIndex((current) => (current + direction + gallery.length) % gallery.length);
  };

  return (
    <>
      <main className="mx-auto max-w-[125rem] px-5 pb-20 pt-28 sm:px-8 sm:pt-36 lg:px-14">
        <Link
          to="/shop"
          search={{ category: "all" }}
          className="eyebrow text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to collection
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(22rem,.7fr)] lg:gap-16">
          <div className="min-w-0">
            <div className="group relative aspect-[4/3] overflow-hidden bg-stone sm:aspect-[5/4]">
              <img
                src={previewImage}
                alt={`${product.title}${selectedColor ? ` in ${selectedColor.name}` : ""}`}
                className="h-full w-full object-contain p-3 sm:p-8"
                style={previewStyle}
              />
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => changeImage(-1)}
                    aria-label="Previous product image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 text-foreground shadow-sm"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => changeImage(1)}
                    aria-label="Next product image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 text-foreground shadow-sm"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                {gallery.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    onClick={() => {
                      setSelectedColor(null);
                      setImageIndex(index);
                    }}
                    aria-label={`Show product image ${index + 1}`}
                    aria-pressed={!selectedColor && index === imageIndex}
                    className={`h-20 w-20 shrink-0 overflow-hidden border bg-stone ${!selectedColor && index === imageIndex ? "border-foreground" : "border-border"}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <section className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-muted-foreground">Made to Order · Addis Ababa</p>
            <div className="mt-3 flex items-start justify-between gap-5">
              <h1 className="display text-3xl sm:text-4xl">{product.title}</h1>
              <span className="shrink-0 pt-1 text-sm text-muted-foreground">
                {product.price || "Ask for price"}
              </span>
            </div>
            {product.amharicName && (
              <p lang="am" className="mt-2 text-sm text-muted-foreground">
                {product.amharicName}
              </p>
            )}
            {product.description && (
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {(product.dimensions || product.detail) && (
              <div className="mt-6 flex items-start gap-3 border-y border-border py-4 text-sm">
                <Ruler className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Dimensions</p>
                  <p className="mt-1 text-muted-foreground">
                    {product.dimensions || product.detail}
                  </p>
                </div>
              </div>
            )}

            <fieldset className="mt-6">
              <legend className="mb-3 text-xs font-semibold uppercase tracking-wider">
                Swatches
                {selectedColor && (
                  <span className="ml-1 font-normal normal-case">· {selectedColor.name}</span>
                )}
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((color) => (
                  <button
                    key={`${color.name}-${color.color}`}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color);
                      setImageIndex(0);
                    }}
                    title={color.name}
                    aria-label={`Choose ${color.name}`}
                    aria-pressed={selectedColor?.name === color.name}
                    className={`h-8 w-8 border-2 transition-shadow ${
                      selectedColor?.name === color.name
                        ? "border-foreground ring-2 ring-foreground/20"
                        : "border-white shadow-[0_0_0_1px_#d6d3d1]"
                    }`}
                    style={{ backgroundColor: color.color }}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wider">
                Wood Finish
              </legend>
              <select
                value={selectedWood}
                onChange={(event) => setSelectedWood(event.target.value)}
                className="w-full border border-border bg-white px-3 py-2.5 text-sm"
              >
                {woodOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </fieldset>

            <fieldset className="mt-5">
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wider">
                Upholstery Fabric
              </legend>
              <select
                value={selectedFabric}
                onChange={(event) => setSelectedFabric(event.target.value)}
                className="w-full border border-border bg-white px-3 py-2.5 text-sm"
              >
                {fabricOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </fieldset>

            <label className="mt-5 block text-xs font-semibold uppercase tracking-wider">
              Custom Specifications / Size Notes
              <textarea
                rows={3}
                value={customNotes}
                onChange={(event) => setCustomNotes(event.target.value)}
                placeholder="Share your preferred dimensions or details..."
                className="mt-2 w-full border border-border bg-white p-3 text-sm font-normal normal-case tracking-normal"
              />
            </label>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex items-center border border-border">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Decrease quantity"
                  className="px-3 py-2"
                >
                  −
                </button>
                <span className="min-w-8 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => value + 1)}
                  aria-label="Increase quantity"
                  className="px-3 py-2"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToBag}
                className="inline-flex flex-1 items-center justify-center gap-2 bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white"
              >
                {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                {added ? "Added to Quote Bag" : "Add to Quote Bag"}
              </button>
            </div>
          </section>
        </div>

        {product.blueprint_image_url && (
          <section className="mt-20 border-t border-border pt-12 sm:mt-28">
            <p className="eyebrow text-muted-foreground">Dimensions & Measurements</p>
            <h2 className="display mt-3 text-3xl">Blueprint</h2>
            <div className="mt-7 bg-[#f7efe5] p-4 sm:p-10">
              <img
                src={product.blueprint_image_url}
                alt={`${product.title} dimensions and measurement blueprint`}
                loading="lazy"
                className="mx-auto max-h-[50rem] w-full object-contain"
              />
            </div>
          </section>
        )}
      </main>
    </>
  );
}
