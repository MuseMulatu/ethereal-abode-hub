import { createFileRoute } from "@tanstack/react-router";

import { CategoryPage } from "@/components/site/CategoryPage";
import { images, kitchenProducts } from "@/data/site";

export const Route = createFileRoute("/kitchen")({
  head: () => ({
    meta: [
      { title: "Dining & Tables — Anteniguss Home" },
      {
        name: "description",
        content:
          "Oval dining tables, pedestal sets, geometric TV units and sculpted consoles made in Addis Ababa.",
      },
      { property: "og:title", content: "Dining & Tables — Anteniguss Home" },
      {
        property: "og:description",
        content: "Oval dining tables, pedestal sets and custom console tables.",
      },
    ],
  }),
  component: () => (
    <CategoryPage
      eyebrow="Collection 02"
      headline="Dining & Tables"
      title="Dining sets, TV units and console tables"
      intro="Pieces that finish a room — crafted in solid timber with custom tops and turned wood legs to fit your dining and living spaces."
      heroImage={images.diningShowroom}
      products={kitchenProducts}
      note="All dining tables and consoles can be customized in length, wood finish, and seating configurations to fit your exact floor plan."
    />
  ),
});
