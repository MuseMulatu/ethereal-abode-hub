import { Check, Ruler, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { Product } from "@/data/site";
import { addToQuoteBag } from "@/lib/cms-store";

interface ProductCustomizerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBag: () => void;
}

const DEFAULT_WOOD_OPTIONS = [
  { id: "wanza", name: "Wanza (Cordia)", note: "Traditional Ethiopian hardwood with warm honey tone" },
  { id: "teak", name: "Solid Teak", note: "Dense, moisture-resistant with rich natural grain" },
  { id: "mahogany", name: "Mahogany", note: "Deep reddish-brown luxury finish" },
  { id: "oak", name: "White Oak", note: "Contemporary Scandinavian pale finish" },
];

const DEFAULT_FABRIC_OPTIONS = [
  { id: "boucle-cream", name: "Textured Bouclé (Warm Cream)", color: "#F4F0EA" },
  { id: "linen-sand", name: "Belgian Linen (Sand Stone)", color: "#DDD5C7" },
  { id: "velvet-olive", name: "Plush Velvet (Olive Moss)", color: "#555D50" },
  { id: "velvet-terracotta", name: "Plush Velvet (Addis Terracotta)", color: "#A85D44" },
  { id: "leather-cognac", name: "Full-Grain Leather (Cognac)", color: "#8E512F" },
];

function parseOptions(raw: any, fallback: string[]): string[] {
  if (!raw) return fallback;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item) => (typeof item === "string" ? item : item.name || String(item)));
      }
    } catch {
      return [raw];
    }
  }
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((item) => (typeof item === "string" ? item : item.name || String(item)));
  }
  return fallback;
}

export function ProductCustomizerModal({
  product,
  isOpen,
  onClose,
  onOpenBag,
}: ProductCustomizerModalProps) {
  const [selectedWood, setSelectedWood] = useState<string>(DEFAULT_WOOD_OPTIONS[0].name);
  const [selectedFabric, setSelectedFabric] = useState<string>(DEFAULT_FABRIC_OPTIONS[0].name);
  const [quantity, setQuantity] = useState<number>(1);
  const [customNotes, setCustomNotes] = useState<string>("");
  const [added, setAdded] = useState<boolean>(false);

  // Parse product-specific options or defaults
  const woodList = parseOptions(
    (product as any)?.wood_options || (product as any)?.woodOptions,
    DEFAULT_WOOD_OPTIONS.map((w) => w.name),
  );

  const fabricList = parseOptions(
    (product as any)?.fabric_options || (product as any)?.fabricOptions,
    DEFAULT_FABRIC_OPTIONS.map((f) => f.name),
  );

  // Synchronize state whenever a new product is selected or modal opened
  useEffect(() => {
    if (product && isOpen) {
      const woods = parseOptions(
        (product as any)?.wood_options || (product as any)?.woodOptions,
        DEFAULT_WOOD_OPTIONS.map((w) => w.name),
      );
      const fabrics = parseOptions(
        (product as any)?.fabric_options || (product as any)?.fabricOptions,
        DEFAULT_FABRIC_OPTIONS.map((f) => f.name),
      );
      setSelectedWood(woods[0] || DEFAULT_WOOD_OPTIONS[0].name);
      setSelectedFabric(fabrics[0] || DEFAULT_FABRIC_OPTIONS[0].name);
      setQuantity(1);
      setCustomNotes("");
      setAdded(false);
    }
  }, [product?.id, isOpen]);

  if (!isOpen || !product) return null;

  const handleAddToBag = () => {
    addToQuoteBag({
      productId: product.id,
      productName: product.title,
      productImage: product.image,
      dimensions: product.dimensions || product.detail,
      selectedWood,
      selectedFabric,
      quantity,
      customNotes: customNotes.trim() || undefined,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setCustomNotes("");
      onClose();
      onOpenBag();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container with explicit pointer event pass-through */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-3 sm:p-6 lg:p-8 pointer-events-none">
        <div className="relative w-full max-w-4xl rounded-xl bg-white text-foreground shadow-2xl overflow-hidden border border-border pointer-events-auto flex flex-col max-h-[92vh]">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-20 rounded-full bg-white/95 p-2 text-muted-foreground shadow-sm transition-colors hover:bg-stone hover:text-foreground border border-border/60"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
            {/* Image section — balanced, compact, crisp */}
            <div className="lg:col-span-5 bg-stone/35 flex flex-col items-center justify-center p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-border relative select-none">
              <div className="w-full flex items-center justify-center h-44 sm:h-56 lg:h-full max-h-[340px]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
                />
              </div>
              {product.seatingCapacity && (
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded border border-border text-foreground">
                  {product.seatingCapacity}
                </div>
              )}
            </div>

            {/* Customization Details & Sticky Footer */}
            <div className="lg:col-span-7 flex flex-col min-h-0 overflow-hidden bg-white">
              {/* Scrollable specs & customizer options */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
                <div>
                  <span className="eyebrow text-muted-foreground">Made to Order · Addis Ababa</span>
                  <div className="flex items-baseline justify-between gap-3 mt-1">
                    <h2 className="display text-xl sm:text-2xl text-foreground font-serif">{product.title}</h2>
                    <span className="text-sm font-semibold text-foreground/80 whitespace-nowrap">
                      {product.price || "Ask for price"}
                    </span>
                  </div>
                  {product.amharicName && (
                    <p className="font-amharic text-xs sm:text-sm text-muted-foreground mt-0.5" lang="am">
                      {product.amharicName}
                    </p>
                  )}

                  {product.description && (
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Dimensions */}
                {(product.dimensions || product.detail) && (
                  <div className="flex items-start gap-2.5 rounded-md border border-border bg-stone/30 p-3 text-xs">
                    <Ruler className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="font-semibold block text-foreground">Standard Dimensions</span>
                      <span className="text-muted-foreground">{product.dimensions || product.detail}</span>
                      <span className="block mt-1 text-[11px] text-muted-foreground italic">
                        *Custom dimensions tailored to your living space available upon request.
                      </span>
                    </div>
                  </div>
                )}

                {/* Wood Finish Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Wood Finish: <span className="text-foreground font-bold">{selectedWood}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {woodList.map((wood) => (
                      <button
                        key={wood}
                        type="button"
                        onClick={() => setSelectedWood(wood)}
                        className={`text-left p-2.5 rounded border text-xs transition-all cursor-pointer ${
                          selectedWood === wood
                            ? "border-foreground bg-foreground text-background font-semibold shadow-xs"
                            : "border-border bg-white text-foreground hover:border-foreground/40 hover:bg-stone/40"
                        }`}
                      >
                        <span className="block truncate">{wood}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fabric Swatch Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Upholstery Fabric: <span className="text-foreground font-bold">{selectedFabric}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {fabricList.map((fab) => (
                      <button
                        key={fab}
                        type="button"
                        onClick={() => setSelectedFabric(fab)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs transition-all cursor-pointer ${
                          selectedFabric === fab
                            ? "border-foreground bg-foreground text-background font-semibold shadow-xs"
                            : "border-border bg-white text-foreground hover:border-foreground/40 hover:bg-stone/40"
                        }`}
                      >
                        <span>{fab}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Notes / Client Specs */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Custom Specifications / Size Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g. Need 320cm width, or prefer a darker walnut stain..."
                    className="w-full rounded-md border border-border bg-white p-2.5 text-xs text-foreground focus:border-foreground focus:outline-none placeholder:text-muted-foreground/60 transition-colors"
                  />
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="border-t border-border bg-white px-5 sm:px-7 py-3.5 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-border rounded bg-stone/20 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-sm font-semibold text-foreground hover:bg-stone/50 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-xs font-bold text-foreground min-w-[2.2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-sm font-semibold text-foreground hover:bg-stone/50 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Quote Bag button */}
                  <button
                    type="button"
                    onClick={handleAddToBag}
                    disabled={added}
                    className="flex-1 inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-background transition-opacity hover:opacity-90 shadow-sm cursor-pointer rounded"
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4" /> Added to Quote Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" /> Add to Quote Bag
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
                  Free consultation & delivery quote included upon submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
