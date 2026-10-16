import { createFileRoute } from "@tanstack/react-router";

import { CategoryPage } from "@/components/site/CategoryPage";
import { images, kidsProducts } from "@/data/site";

export const Route = createFileRoute("/kids")({
  head: () => ({
    meta: [
      { title: "Bedroom & Accent Chairs — Anteniguss Home" },
      {
        name: "description",
        content:
          "Channel velvet beds, padded headboard frames, boucle armchairs and accent seating made in Addis Ababa.",
      },
      { property: "og:title", content: "Bedroom & Accent Chairs — Anteniguss Home" },
      {
        property: "og:description",
        content: "Channel velvet beds and bespoke armchairs made to order.",
      },
    ],
  }),
  component: () => (
    <CategoryPage
      eyebrow="Collection 03"
      headline="Bedroom & Accent Chairs"
      title="Beds, reading chairs and quiet comfort"
      intro="Channel velvet beds and tactile bouclé armchairs tailored to bring serene warmth and refined proportions into personal spaces."
      heroImage={images.bedVelvet}
      products={kidsProducts}
      note="Beds and accent chairs are produced in our Addis Ababa workshop in your choice of upholstery fabric, dimensions, and cushioning firmness."
    />
  ),
});
