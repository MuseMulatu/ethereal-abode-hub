import { createFileRoute } from "@tanstack/react-router";

import { CategoryPage } from "@/components/site/CategoryPage";
import { images, softProducts } from "@/data/site";

export const Route = createFileRoute("/soft-furnishings")({
  head: () => ({
    meta: [
      { title: "Soft Furnishings — Pillows & Puff Sofas — Ante Design" },
      {
        name: "description",
        content:
          "Bouclé puff sofas, linen pillows, alpaca throws and Belgian flax bed linen in a warm neutral palette.",
      },
      { property: "og:title", content: "Soft Furnishings — Ante Design" },
      {
        property: "og:description",
        content: "Bouclé puff sofas, linen pillows and alpaca throws in warm neutrals.",
      },
    ],
  }),
  component: () => (
    <CategoryPage
      eyebrow="Collection 03"
      headline="Soft Furnishings"
      title="Pillows, puffs and quiet texture"
      intro="Texture as the last remaining ornament — bouclé, boiled wool, stonewashed linen and undyed alpaca, all in one warm register."
      heroImage={images.catSoft}
      products={softProducts}
      note="Cushions and puffs are cut and filled to order in our Kera atelier. Custom sizes and client's own material welcome, with a two-week turnaround."
    />
  ),
});
