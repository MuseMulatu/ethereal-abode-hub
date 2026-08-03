import { createFileRoute } from "@tanstack/react-router";

import { CategoryPage } from "@/components/site/CategoryPage";
import { images, kidsProducts } from "@/data/site";

export const Route = createFileRoute("/kids")({
  head: () => ({
    meta: [
      { title: "Kids — Maison Lumé" },
      {
        name: "description",
        content:
          "Cribs, reading chairs, wool rugs and wardrobes in untreated ash and washed linen. Children's furniture that grows up gracefully.",
      },
      { property: "og:title", content: "Kids — Maison Lumé" },
      {
        property: "og:description",
        content: "Children's furniture in untreated ash and washed linen, made to last decades.",
      },
    ],
  }),
  component: () => (
    <CategoryPage
      eyebrow="Collection 02"
      headline="Kids"
      title="Rooms that grow up gracefully"
      intro="Untreated ash, washed linen and non-toxic finishes — pieces a child can grow through and a house can keep."
      heroImage={images.catKids}
      products={kidsProducts}
      note="Every kids piece is finished with plant-based oils and certified to EN 716. Cribs convert to toddler beds; wardrobes are supplied with anti-tip anchoring."
    />
  ),
});
