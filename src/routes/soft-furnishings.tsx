import { createFileRoute } from "@tanstack/react-router";

import { CategoryPage } from "@/components/site/CategoryPage";
import { images, softProducts } from "@/data/site";

export const Route = createFileRoute("/soft-furnishings")({
  head: () => ({
    meta: [
      { title: "Sofas & Seating — Anteniguss Home" },
      {
        name: "description",
        content:
          "Modular sectionals, curved bouclé sofas, armchairs and beds made to order in Addis Ababa.",
      },
      { property: "og:title", content: "Sofas & Seating — Anteniguss Home" },
      {
        property: "og:description",
        content: "Custom modular sofas and armchairs made in Addis Ababa.",
      },
    ],
  }),
  component: () => (
    <CategoryPage
      eyebrow="Collection 01"
      headline="Sofas & Armchairs"
      title="Made in Addis Ababa to your dimensions"
      intro="Every sofa, chair and table is built by our own production team. Tell us your room size and pick the fabric and colour."
      heroImage={images.heroLivingRoom}
      products={softProducts}
      note="Custom orders ready in about 20–30 days. See and feel fabrics at our Meskel Flower showroom, with delivery and setup across Addis Ababa by our team."
    />
  ),
});
