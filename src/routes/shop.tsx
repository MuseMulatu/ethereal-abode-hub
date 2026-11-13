import { createFileRoute } from "@tanstack/react-router";
import { Filter, MessageCircle, Ruler, Search, ShoppingBag, Sparkles, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ProductCustomizerModal } from "@/components/site/ProductCustomizerModal";
import { QuoteBagDrawer } from "@/components/site/QuoteBagDrawer";
import { Reveal } from "@/components/site/Reveal";
import {
  catalogueSofas,
  kidsProducts,
  kitchenProducts,
  softProducts,
  type Product,
} from "@/data/site";
import { getProducts, type BackendProduct } from "@/lib/cms-store";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: (search.category as string) || "all",
  }),
  head: () => ({
    meta: [
      { title: "Furniture Catalog & Made-to-Order Collection — Anteniguss Home" },
      {
        name: "description",
        content:
          "Browse custom handcrafted sofas, dining sets, armchairs, and living room suites in Addis Ababa. Select your dimensions and fabrics, and request a personalized quote.",
      },
      { property: "og:title", content: "Furniture Catalog — Anteniguss Home Addis Ababa" },
      {
        property: "og:description",
        content:
          "Explore the 2026 Look Book sofa collection, custom dining tables, and bespoke furniture crafted in Addis Ababa.",
      },
    ],
  }),
  component: ShopPage,
});

// Aggregate all products across categories with default ratings and categories
const ALL_CATALOG_PRODUCTS: (Product & {
  categoryType: string;
  rating: number;
  reviewCount: number;
})[] = [
  ...catalogueSofas.map((s, idx) => ({
    ...s,
    categoryType: "sofas",
    rating: 4.8 + (idx % 3) * 0.1,
    reviewCount: 14 + ((idx * 5) % 30),
  })),
  ...kitchenProducts.map((k, idx) => ({
    ...k,
    categoryType: "dining",
    rating: 4.9,
    reviewCount: 12 + idx * 4,
  })),
  ...softProducts.map((p, idx) => ({
    ...p,
    categoryType: "armchairs",
    rating: 4.8,
    reviewCount: 8 + idx * 3,
  })),
  ...kidsProducts.map((kd, idx) => ({
    ...kd,
    categoryType: "living-kids",
    rating: 4.9,
    reviewCount: 10 + idx * 2,
  })),
];

function ShopPage() {
  const { category: initialCategory } = Route.useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [selectedCapacity, setSelectedCapacity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [backendItems, setBackendItems] = useState<BackendProduct[]>([]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Drawer & modal state
  const [customizerProduct, setCustomizerProduct] = useState<Product | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);

  useEffect(() => {
    getProducts({ include_archived: false }).then((items) => {
      if (items && items.length > 0) setBackendItems(items);
    });
    const handler = () => {
      getProducts({ include_archived: false }).then((items) => {
        if (items && items.length > 0) setBackendItems(items);
      });
    };
    window.addEventListener("ante-products-updated", handler);
    return () => window.removeEventListener("ante-products-updated", handler);
  }, []);

  const allItems = useMemo(() => {
    let source: (Product & {
      categoryType?: string;
      rating?: number;
      reviewCount?: number;
    })[] = [];

    if (backendItems.length > 0) {
      source = backendItems.map((bp, idx) => ({
        id: String(bp.id),
        title: bp.title,
        amharicName: bp.amharic_name || undefined,
        category: bp.category,
        categoryType: bp.category,
        seatingCapacity: bp.seating_capacity || undefined,
        dimensions: bp.dimensions || undefined,
        description: bp.description || undefined,
        detail: bp.detail || `${bp.seating_capacity || ""} · ${bp.dimensions || ""}`,
        price: bp.price_display,
        image: bp.image_url,
        wood_options: bp.wood_options,
        fabric_options: bp.fabric_options,
        span: bp.span || "normal",
        rating: 4.8 + (idx % 3) * 0.1,
        reviewCount: 14 + ((idx * 5) % 30),
      }));
    } else {
      source = ALL_CATALOG_PRODUCTS;
    }

    // Deduplicate by normalized title so older duplicate seed rows are eliminated,
    // retaining the latest (higher ID or latest edited) version!
    const seen = new Map<string, typeof source[0]>();
    for (const item of source) {
      const key = item.title.trim().toLowerCase();
      const existing = seen.get(key);
      if (!existing) {
        seen.set(key, item);
      } else {
        const existingId = Number(existing.id) || 0;
        const currentId = Number(item.id) || 0;
        if (currentId >= existingId) {
          seen.set(key, item);
        }
      }
    }
    return Array.from(seen.values());
  }, [backendItems]);

  // Dynamically calculate category counts directly from deduplicated items
  const counts = useMemo(() => {
    let sofas = 0;
    let dining = 0;
    let armchairs = 0;
    let livingKids = 0;

    for (const item of allItems) {
      const cat = (item.categoryType || item.category || "").toLowerCase();
      if (cat.includes("sofa") || cat.includes("soft")) sofas++;
      else if (cat.includes("dining") || cat.includes("kitchen")) dining++;
      else if (cat.includes("chair") || cat.includes("armchair")) armchairs++;
      else if (cat.includes("bed") || cat.includes("living") || cat.includes("kid")) livingKids++;
    }

    return {
      all: allItems.length,
      sofas,
      dining,
      armchairs,
      livingKids,
    };
  }, [allItems]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return allItems
      .filter((item) => {
        // Category filter
        if (selectedCategory !== "all") {
          const itemCat = (item.categoryType || item.category || "").toLowerCase();
          const target = selectedCategory.toLowerCase();
          const match =
            itemCat === target ||
            (target === "sofas" && (itemCat.includes("sofa") || itemCat.includes("soft"))) ||
            (target === "dining" && (itemCat.includes("dining") || itemCat.includes("kitchen"))) ||
            (target === "armchairs" && (itemCat.includes("armchair") || itemCat.includes("chair"))) ||
            (target === "living-kids" &&
              (itemCat.includes("bed") || itemCat.includes("living") || itemCat.includes("kid")));
          if (!match) return false;
        }

        // Capacity filter
        if (selectedCapacity !== "all") {
          const cap = (item.seatingCapacity || "").toLowerCase();
          if (selectedCapacity === "5" && !cap.includes("5")) return false;
          if (selectedCapacity === "7" && !cap.includes("7")) return false;
          if (selectedCapacity === "modular" && !cap.includes("modular") && !cap.includes("l-"))
            return false;
        }

        // Text search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(query);
          const matchesDesc = (item.description || "").toLowerCase().includes(query);
          const matchesDetail = (item.detail || "").toLowerCase().includes(query);
          const matchesCapacity = (item.seatingCapacity || "").toLowerCase().includes(query);
          if (!matchesTitle && !matchesDesc && !matchesDetail && !matchesCapacity) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
        if (sortBy === "name") return a.title.localeCompare(b.title);
        return 0; // default featured
      });
  }, [allItems, searchQuery, selectedCategory, selectedCapacity, sortBy]);

  const handleOpenCustomizer = (product: Product) => {
    setCustomizerProduct(product);
    setIsCustomizerOpen(true);
  };

  return (
    <>
      {/* Hero Header */}
      <section className="border-b border-border bg-white pt-20 pb-6 sm:px-10 sm:pt-24 lg:px-16 lg:pb-8">
        <div className="mx-auto max-w-[110rem] px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="eyebrow text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Look Book 2026 Collection · Addis Ababa
                </span>
                <h1 className="display mt-3 text-3xl sm:text-4xl lg:text-6xl">Furniture Catalog</h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Explore made-to-order sofas, dining suites, and handcrafted pieces made right here
                  in Addis Ababa. Select your favorite items to request a custom dimension and
                  fabric quote.
                </p>
              </div>

              {/* View Bag Pill */}
              <button
                type="button"
                onClick={() => setIsBagOpen(true)}
                className="self-start md:self-auto inline-flex items-center gap-2.5 border border-foreground bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-wider text-background transition-opacity hover:opacity-90 shadow-sm"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>View Quote Bag</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="sticky top-16 z-30 border-b border-border bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-[110rem] px-6 py-3.5 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search sofas, dining sets, materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded border border-border bg-white py-2 pl-10 pr-4 text-xs focus:border-foreground focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded border transition-colors shrink-0 ${
                  selectedCategory === "all"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-white text-muted-foreground hover:text-foreground hover:border-foreground/50"
                }`}
              >
                All ({counts.all})
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory("sofas")}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded border transition-colors shrink-0 ${
                  selectedCategory === "sofas"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-white text-muted-foreground hover:text-foreground hover:border-foreground/50"
                }`}
              >
                Sofas & Sectionals ({counts.sofas})
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory("dining")}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded border transition-colors shrink-0 ${
                  selectedCategory === "dining"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-white text-muted-foreground hover:text-foreground hover:border-foreground/50"
                }`}
              >
                Dining & Tables ({counts.dining})
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory("armchairs")}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded border transition-colors shrink-0 ${
                  selectedCategory === "armchairs"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-white text-muted-foreground hover:text-foreground hover:border-foreground/50"
                }`}
              >
                Armchairs ({counts.armchairs})
              </button>

              <button
                type="button"
                onClick={() => setSelectedCategory("living-kids")}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded border transition-colors shrink-0 ${
                  selectedCategory === "living-kids"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-white text-muted-foreground hover:text-foreground hover:border-foreground/50"
                }`}
              >
                Living & Beds ({counts.livingKids})
              </button>
            </div>

            {/* Secondary Controls (Capacity & Sort) */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Seats:</span>
                <select
                  value={selectedCapacity}
                  onChange={(e) => setSelectedCapacity(e.target.value)}
                  className="rounded border border-border bg-white py-1.5 px-2.5 text-xs text-foreground focus:outline-none"
                >
                  <option value="all">All Sizes</option>
                  <option value="5">5-Seater</option>
                  <option value="7">7-Seater Suites</option>
                  <option value="modular">Modular / L-Shaped</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded border border-border bg-white py-1.5 px-2.5 text-xs text-foreground focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Inquired</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-[110rem] px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
        {filteredProducts.length === 0 ? (
          <div className="my-16 text-center">
            <p className="text-xl font-medium text-foreground">No pieces match your search</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search terms or clearing the filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedCapacity("all");
              }}
              className="mt-6 inline-flex items-center border border-foreground bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-background"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((item, index) => (
              <Reveal key={item.id} delay={(index % 4) * 60}>
                <div
                  onClick={() => handleOpenCustomizer(item)}
                  className="group flex flex-col justify-between rounded-sm border border-border bg-white overflow-hidden cursor-pointer transition-all duration-300 hover:border-foreground/30 hover:shadow-lg"
                >
                  {/* Image container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-cinematic group-hover:scale-[1.03]"
                    />

                    {/* Capacity badge */}
                    {item.seatingCapacity && (
                      <span className="absolute top-3 left-3 rounded bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground border border-border pointer-events-none">
                        {item.seatingCapacity.replace(" (custom configuration)", "")}
                      </span>
                    )}

                    {/* Price / Quote badge */}
                    <span className="absolute bottom-3 right-3 rounded bg-ink/85 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-white pointer-events-none">
                      {item.price || "Made to Order"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      {/* Rating row */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                        </div>
                        <span className="font-semibold text-foreground">
                          {item.rating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground/70">
                          ({item.reviewCount} inquiries)
                        </span>
                      </div>

                      {/* Title & amharic */}
                      <h3 className="display mt-2.5 text-xl hover:underline text-foreground">
                        {item.title}
                      </h3>

                      {item.amharicName && (
                        <p className="font-amharic text-xs text-muted-foreground mt-0.5" lang="am">
                          {item.amharicName}
                        </p>
                      )}

                      {/* Dimensions or detail */}
                      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {item.dimensions || item.detail}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-4 border-t border-border flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCustomizer(item);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded border border-foreground bg-foreground py-2.5 px-3 text-xs font-semibold uppercase tracking-wider text-background transition-opacity hover:opacity-90"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Customize & Quote</span>
                      </button>

                      <a
                        href={`https://wa.me/251911903307?text=${encodeURIComponent(
                          `Hello Anteniguss Home, I am inquiring about the ${item.title}. Can you share details on available fabrics and pricing?`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2.5 rounded border border-border text-muted-foreground transition-colors hover:text-foreground hover:bg-stone"
                        title="Inquire directly on WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Made to Order Guarantee Banner */}
      <section className="border-t border-border bg-stone py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[110rem] px-6 text-center">
          <Reveal>
            <p className="eyebrow text-muted-foreground">The Anteniguss Workshop Promise</p>
            <h2 className="display mt-4 text-3xl sm:text-4xl">
              Every Piece Made to Your Room Plan
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Don't see your exact dimensions or preferred fabric? We build custom suites from
              scratch in Addis Ababa. Visit our Abkem Tower showroom or send us your living room
              floor plan on WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsBagOpen(true)}
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-sm font-semibold text-background hover:opacity-90"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Start a Quote Request</span>
              </button>
              <a
                href="https://wa.me/251911903307"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-stone"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Consult with Workshop Master</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Modals */}
      <ProductCustomizerModal
        product={customizerProduct}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onOpenBag={() => setIsBagOpen(true)}
      />

      <QuoteBagDrawer isOpen={isBagOpen} onClose={() => setIsBagOpen(false)} />
    </>
  );
}
