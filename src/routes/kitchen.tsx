import { createFileRoute } from "@tanstack/react-router";

import { CategoryPage } from "@/components/site/CategoryPage";
import { images, kitchenProducts } from "@/data/site";

export const Route = createFileRoute("/kitchen")({
  head: () => ({
    meta: [
      { title: "Kitchen & More — Ante Design" },
      {
        name: "description",
        content:
          "Stone islands, rift-cut oak cabinetry, dining tables and serving collections. Bespoke luxury kitchens made to order.",
      },
      { property: "og:title", content: "Kitchen & More — Ante Design" },
      {
        property: "og:description",
        content: "Stone islands, rift-cut oak cabinetry and dining pieces, made to order.",
      },
    ],
  }),
  component: () => (
    <CategoryPage
      eyebrow="Collection 01"
      headline="Kitchen & More"
      title="Stone, oak and nothing else"
      intro="Kitchens drawn as architecture rather than cabinetry — honed surfaces, concealed storage and a counter that stays clear."
      heroImage={images.catKitchen}
      products={kitchenProducts}
      note="All kitchen programmes are quoted after a site survey. Lead time is 10–14 weeks from drawing approval, including white-glove installation by our own fitters."
    />
  ),
});
