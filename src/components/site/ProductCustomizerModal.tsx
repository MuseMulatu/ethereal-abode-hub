import { Check, Ruler, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import type { Product } from "@/data/site";
import { addToQuoteBag } from "@/lib/cms-store";

interface ProductCustomizerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBag: () => void;
}

const WOOD_OPTIONS = [
  {
    id: "wanza",
    name: "Wanza (Cordia)",
    note: "Traditional Ethiopian hardwood with warm honey tone",
  },
  { id: "teak", name: "Solid Teak", note: "Dense, moisture-resistant with rich natural grain" },
  { id: "mahogany", name: "Mahogany", note: "Deep reddish-brown luxury finish" },
  { id: "oak", name: "White Oak", note: "Contemporary Scandinavian pale finish" },
];

const FABRIC_OPTIONS = [
  { id: "boucle-cream", name: "Textured Bouclé (Warm Cream)", color: "#F4F0EA" },
  { id: "linen-sand", name: "Belgian Linen (Sand Stone)", color: "#DDD5C7" },
  { id: "velvet-olive", name: "Plush Velvet (Olive Moss)", color: "#555D50" },
  { id: "velvet-terracotta", name: "Plush Velvet (Addis Terracotta)", color: "#A85D44" },
  { id: "leather-cognac", name: "Full-Grain Leather (Cognac)", color: "#8E512F" },
];

export function ProductCustomizerModal({
  product,
  isOpen,
  onClose,
  onOpenBag,
}: ProductCustomizerModalProps) {
  const [selectedWood, setSelectedWood] = useState(WOOD_OPTIONS[0].name);
  const [selectedFabric, setSelectedFabric] = useState(FABRIC_OPTIONS[0].name);
  const [quantity, setQuantity] = useState(1);
  const [customNotes, setCustomNotes] = useState("");
  const [added, setAdded] = useState(false);

  if (!isOpen || !product) return null;

  const rawWoods = (product as any).wood_options || (product as any).woodOptions;
  const woodList: string[] = Array.isArray(rawWoods) && rawWoods.length > 0
    ? rawWoods
    : WOOD_OPTIONS.map((w) => w.name);

  const rawFabrics = (product as any).fabric_options || (product as any).fabricOptions;
  const fabricList: string[] = Array.isArray(rawFabrics) && rawFabrics.length > 0
    ? rawFabrics
    : FABRIC_OPTIONS.map((f) => f.name);

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
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-4xl rounded-lg bg-background text-foreground shadow-2xl overflow-hidden border border-border">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-background/80 p-2 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid lg:grid-cols-12">
            {/* Image section */}
            <div className="lg:col-span-6 bg-stone relative">
              <div className="aspect-[4/3] lg:h-full overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {product.seatingCapacity && (
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded border border-border">
                  {product.seatingCapacity}
                </div>
              )}
            </div>

            {/* Customization Details */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="eyebrow text-muted-foreground">Made to Order · Addis Ababa</p>
                <h2 className="display mt-2 text-3xl">{product.title}</h2>
                {product.amharicName && (
                  <p className="font-amharic text-sm text-muted-foreground mt-1">
                    {product.amharicName}
                  </p>
                )}

                {product.description && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                )}

                {/* Dimensions */}
                {product.dimensions && (
                  <div className="mt-5 flex items-start gap-2.5 rounded border border-border bg-stone/40 p-3 text-xs">
                    <Ruler className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="font-semibold block text-foreground">
                        Standard Dimensions
                      </span>
                      <span className="text-muted-foreground">{product.dimensions}</span>
                      <span className="block mt-1 text-[11px] text-muted-foreground italic">
                        *Custom dimensions tailored to your room plan available upon inquiry.
                      </span>
                    </div>
                  </div>
                )}

                {/* Wood Finish Selector */}
                <div className="mt-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Wood Finish: <span className="text-foreground">{selectedWood}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {woodList.map((wood) => (
                      <button
                        key={wood}
                        type="button"
                        onClick={() => setSelectedWood(wood)}
                        className={`text-left p-2.5 rounded border text-xs transition-colors ${
                          selectedWood === wood
                            ? "border-foreground bg-stone text-foreground font-semibold"
                            : "border-border hover:bg-stone/50 text-muted-foreground"
                        }`}
                      >
                        <span className="block">{wood}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fabric Swatch Selector */}
                <div className="mt-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Upholstery Fabric: <span className="text-foreground">{selectedFabric}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {fabricList.map((fab) => (
                      <button
                        key={fab}
                        type="button"
                        onClick={() => setSelectedFabric(fab)}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded border text-xs transition-colors ${
                          selectedFabric === fab
                            ? "border-foreground bg-stone font-semibold text-foreground"
                            : "border-border hover:bg-stone/50 text-muted-foreground"
                        }`}
                      >
                        <span>{fab}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Notes / Client Specs */}
                <div className="mt-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Custom Specifications / Size Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g. Need 320cm width, or prefer a darker walnut tone..."
                    className="w-full rounded border border-input bg-stone/20 p-2.5 text-xs text-foreground focus:border-foreground focus:outline-none placeholder:text-muted-foreground/60"
                  />
                </div>

                {/* Quantity */}
                <div className="mt-6 flex items-center gap-4">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-border rounded">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-sm hover:bg-stone"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-sm hover:bg-stone"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-8 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={handleAddToBag}
                  disabled={added}
                  className="w-full inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-4 text-sm font-semibold text-background transition-opacity hover:opacity-90"
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
                <p className="mt-2 text-center text-xs text-muted-foreground">
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
