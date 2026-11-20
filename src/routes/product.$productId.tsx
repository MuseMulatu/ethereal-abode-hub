import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ProductDetailPage } from "@/components/site/ProductDetailPage";
import {
  catalogueSofas,
  kidsProducts,
  kitchenProducts,
  softProducts,
  type Product,
} from "@/data/site";
import { getProduct } from "@/lib/cms-store";

export const Route = createFileRoute("/product/$productId")({
  head: () => ({
    meta: [
      { title: "Made-to-Order Furniture — Anteniguss Home" },
      {
        name: "description",
        content: "Explore product details, finishes, colors, and dimensions from Anteniguss Home.",
      },
    ],
  }),
  component: ProductRoute,
});

function ProductRoute() {
  const { productId } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setProduct(null);
    getProduct(productId)
      .then((savedProduct) => {
        if (!active) return;
        if (savedProduct) {
          setProduct({
            id: String(savedProduct.id),
            title: savedProduct.title,
            detail: savedProduct.detail || "",
            price: savedProduct.price_display,
            image: savedProduct.image_url,
            ...(savedProduct.gallery_images ? { gallery_images: savedProduct.gallery_images } : {}),
            ...(savedProduct.color_options ? { color_options: savedProduct.color_options } : {}),
            ...(savedProduct.blueprint_image_url
              ? { blueprint_image_url: savedProduct.blueprint_image_url }
              : {}),
            ...(savedProduct.wood_options ? { wood_options: savedProduct.wood_options } : {}),
            ...(savedProduct.fabric_options ? { fabric_options: savedProduct.fabric_options } : {}),
            ...(savedProduct.seating_capacity
              ? { seatingCapacity: savedProduct.seating_capacity }
              : {}),
            ...(savedProduct.dimensions ? { dimensions: savedProduct.dimensions } : {}),
            ...(savedProduct.description ? { description: savedProduct.description } : {}),
            category: savedProduct.category,
            ...(savedProduct.amharic_name ? { amharicName: savedProduct.amharic_name } : {}),
          });
          return;
        }

        const staticProduct = [
          ...catalogueSofas,
          ...kitchenProducts,
          ...softProducts,
          ...kidsProducts,
        ].find((item) => item.id === productId);
        setProduct(staticProduct || null);
      })
      .catch((error: unknown) => {
        console.error("Could not load product details:", error);
        if (active) setProduct(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-40 text-center text-sm text-muted-foreground">
        Loading product…
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-40 text-center">
        <h1 className="display text-3xl">Product not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This product may have been removed from the collection.
        </p>
        <Link
          to="/shop"
          search={{ category: "all" }}
          className="mt-6 inline-block underline underline-offset-4"
        >
          Browse the collection
        </Link>
      </main>
    );
  }

  return <ProductDetailPage product={product} />;
}
