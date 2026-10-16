import aboutAtelier from "@/assets/about-atelier.jpg";
import anteLogo from "@/assets/ante-logo.png";
import armchairGrey from "@/assets/armchair-grey.jpg";
import bedVelvet from "@/assets/bed-velvet.jpg";
import boucleArmchair from "@/assets/boucle-armchair.jpg";
import bunaGuests from "@/assets/buna-guests.jpg";
import catKids from "@/assets/cat-kids.jpg";
import catKitchen from "@/assets/cat-kitchen.jpg";
import catSoft from "@/assets/cat-soft.jpg";
import clientHomeLiving from "@/assets/client-home-living.jpg";
import clientLifestyle2369 from "@/assets/IMG_2369.jpg";
import clientLifestyle5451 from "@/assets/IMG_5451.png";
import consoleSculpted from "@/assets/console-sculpted.jpg";
import creamSofaHome from "@/assets/cream-sofa-home.jpg";
import curvedBoucleSofa from "@/assets/curved-boucle-sofa.jpg";
import curvedSectional from "@/assets/curved-sectional.jpg";
import diningOval from "@/assets/dining-oval.jpg";
import diningShowroom from "@/assets/dining-showroom.jpg";
import heroImg5171 from "@/assets/IMG_5171.jpg";
import heroLivingRoom from "@/assets/hero-living-room.jpg";
import heroLiving from "@/assets/hero-living.jpg";
import journalFeature from "@/assets/journal-feature.jpg";
import lifestyle1 from "@/assets/lifestyle-1.jpg";
import loungeChairCream from "@/assets/lounge-chair-cream.jpg";
import modularBrown from "@/assets/modular-brown.jpg";
import modularSofaLinen from "@/assets/modular-sofa-linen.jpg";
import sectionalEvening from "@/assets/sectional-evening.jpg";
import sectionalGreyCorner from "@/assets/sectional-grey-corner.jpg";
import sectionalWhite from "@/assets/sectional-white.jpg";
import showroom from "@/assets/showroom.jpg";
import threeSeaterGrey from "@/assets/three-seater-grey.jpg";
import tvUnitGeometric from "@/assets/tv-unit-geometric.jpg";
import tvUnitSand from "@/assets/tv-unit-sand.jpg";
import wingbackReading from "@/assets/wingback-reading.jpg";

export const images = {
  // Brand & Showroom
  anteLogo,
  heroImg5171,
  heroLivingRoom,
  bunaGuests,
  clientHomeLiving,
  clientLifestyle2369,
  clientLifestyle5451,
  showroom,
  aboutAtelier,
  lifestyle1,
  journalFeature,

  // Sofas & Sectionals
  curvedSectional,
  curvedBoucleSofa,
  creamSofaHome,
  modularBrown,
  modularSofaLinen,
  sectionalEvening,
  sectionalGreyCorner,
  sectionalWhite,
  threeSeaterGrey,
  heroLiving,

  // Armchairs
  boucleArmchair,
  armchairGrey,
  loungeChairCream,
  wingbackReading,

  // Dining & Casegoods
  diningOval,
  diningShowroom,
  tvUnitSand,
  tvUnitGeometric,
  consoleSculpted,
  bedVelvet,

  // Legacy category fallbacks
  catKitchen,
  catKids,
  catSoft,
};

export const brand = {
  name: "Anteniguss Home",
  phone: "+251 911 903 307",
  whatsapp: "251973222211",
  whatsappDisplay: "+251 97 322 2211",
  email: "homeanteniguss@gmail.com",
  address: "Meskel Flower, Abkem Tower, 1st & 3rd floor, Addis Ababa",
  addressAm: "መስቀል ፍላወር፣ አብኬም ታወር",
  instagram: "https://www.instagram.com/antenigusshome/",
  threads: "https://www.threads.net/@antenigusshome",
};

export type Product = {
  id: string;
  title: string;
  detail: string;
  price: string;
  image: string;
  span?: "tall" | "wide";
  seatingCapacity?: string;
  dimensions?: string;
  description?: string;
  category?: string;
  amharicName?: string;
};

/**
 * Structured sofa collection extracted from the Anteniguss Look Book 2026 catalogue.
 * Formatted to plug seamlessly into ProductCard.tsx and catalog grids.
 */
export const catalogueSofas: Product[] = [
  {
    id: "sofa-curve-5",
    title: "Curve Sofa",
    amharicName: "ባለ 5 መቀመጫ",
    seatingCapacity: "5-seater",
    dimensions: "302.4 cm × 257.7 cm",
    description:
      "Sculptural sweeping curved modular sofa with soft rounded silhouettes, generous low-profile seating, and plush bouclé upholstery.",
    detail: "5-seater · 302.4 × 257.7 cm · Sweeping curved silhouette",
    price: "Ask for price",
    image: curvedBoucleSofa,
    span: "wide",
    category: "sofas",
  },
  {
    id: "sofa-flom-7",
    title: "Flom Sofa Set",
    amharicName: "ባለ 7 መቀመጫ",
    seatingCapacity: "7-seater",
    dimensions: "3-seater: 258.9 × 96.4 cm · 2-seater: 96.4 × 70.0 cm · Armchairs: 75.1 × 96.4 cm",
    description:
      "Modern block-cushion sectional sofa suite with structured pillowed backrests, deep supportive seating, and matching lounge armchairs.",
    detail: "7-seater suite · 258.9 cm main sofa · Block-cushion design",
    price: "Ask for price",
    image: threeSeaterGrey,
    span: "tall",
    category: "sofas",
  },
  {
    id: "sofa-rove-modular",
    title: "Rove Sofa",
    amharicName: "እንደ ደንበኛው ፍላጎት",
    seatingCapacity: "Modular (custom configuration)",
    dimensions: "290.0 cm width × 165.0 cm chaise depth · Ottoman: 95.0 × 130.0 cm",
    description:
      "Low-profile minimalist modular sofa with clean linear piping, deep chaise lounge module, and customizable configuration up to client needs.",
    detail: "Modular layout · 290 × 165 cm · Clean linear piping",
    price: "Ask for price",
    image: sectionalWhite,
    span: "wide",
    category: "sofas",
  },
  {
    id: "sofa-rove-lounge",
    title: "Rove Lounge Sofa",
    seatingCapacity: "Modular (custom configuration)",
    dimensions: "330.0 cm width × 115.0 cm depth · Lounge module: 120.0 × 145.0 cm",
    description:
      "Deep-seat luxury lounge sectional upholstered in textured weave, featuring broad padded armrests, oversized ottoman, and plush accent cushions.",
    detail: "Lounge sectional · 330 × 115 cm · Broad padded arms",
    price: "Ask for price",
    image: sectionalEvening,
    span: "tall",
    category: "sofas",
  },
  {
    id: "sofa-loom-7",
    title: "Loom Sofa Set",
    amharicName: "ባለ 7 መቀመጫ",
    seatingCapacity: "7-seater",
    dimensions:
      "3-seater: 220.0 × 105.0 cm · 2-seater: 180.0 × 105.0 cm · Armchairs: 105.0 × 125.0 cm",
    description:
      "Sculptural curved-back sofa set with organic cocooning armrests, tapered wooden base, and plush textured fabric.",
    detail: "7-seater suite · 220 cm sofa & 180 cm loveseat · Cocooning arms",
    price: "Ask for price",
    image: modularBrown,
    span: "tall",
    category: "sofas",
  },
  {
    id: "sofa-bublous-7-8",
    title: "Bublous Sofa Set",
    seatingCapacity: "7–8 seater",
    dimensions: "Dual 3-seaters: 292.0 × 95.0 cm · Swivel lounge chairs: 90.0 × 90.0 cm",
    description:
      "Organic rounded silhouette sofa set featuring enveloping sculpted arms, curved sofa back, and soft fluid contours for spacious living areas.",
    detail: "7–8 seater suite · 292 × 95 cm dual sofas · Sculpted fluid arms",
    price: "Ask for price",
    image: curvedSectional,
    span: "wide",
    category: "sofas",
  },
  {
    id: "sofa-alfy-modular",
    title: "Alfy Sofa",
    seatingCapacity: "Modular (custom configuration)",
    dimensions: "290.0 cm × 305.0 cm L-configuration · 105.0 cm seat depth",
    description:
      "Grid-tufted contemporary modular sectional with plush channel-quilted seat cushions, low-profile stance, and versatile modular layout.",
    detail: "Grid-tufted modular · 290 × 305 cm L-shape · Low-profile design",
    price: "Ask for price",
    image: sectionalGreyCorner,
    span: "wide",
    category: "sofas",
  },
  {
    id: "sofa-sereen-modular",
    title: "Sereen Sofa Set",
    seatingCapacity: "Modular (custom configuration)",
    dimensions: "450.0 cm width × 340.0 cm left chaise return × 225.0 cm right chaise return",
    description:
      "Generously proportioned cloud-style sectional featuring dual deep chaise lounges, feather-soft back cushions, and wide modular seating.",
    detail: "Cloud sectional · 450 × 340 cm dual chaise · Feather-soft fill",
    price: "Ask for price",
    image: modularSofaLinen,
    span: "wide",
    category: "sofas",
  },
  {
    id: "sofa-allo-l-classic",
    title: "Allo L-shaped Sofa (Classic Tufted)",
    seatingCapacity: "5–6 seats",
    dimensions: "286.5 cm length × 226.5 cm return × 90.0 cm depth",
    description:
      "Mid-century tailored L-shaped sectional featuring button-tufted back cushions, structured armrests, and tapered solid wood legs.",
    detail: "5–6 seats · 286.5 × 226.5 cm · Button-tufted back",
    price: "Ask for price",
    image: creamSofaHome,
    span: "wide",
    category: "sofas",
  },
  {
    id: "sofa-allo-l-console",
    title: "Allo L-shaped Sofa (Curved with Table Console)",
    seatingCapacity: "6–7 seats",
    dimensions: "396.7 cm length × 345.5 cm return · 63.0 cm table console · 109.0 cm pouf",
    description:
      "Organic rounded sectional with integrated wood-top beverage console, curved chaise return, and matching rounded ottoman.",
    detail: "6–7 seats · 396.7 × 345.5 cm · Integrated wood beverage console",
    price: "Ask for price",
    image: clientHomeLiving,
    span: "wide",
    category: "sofas",
  },
  {
    id: "sofa-allo-soft-curve",
    title: "Allo Sofa Set (Bouclé Soft Curve 3+2+1)",
    seatingCapacity: "5–6 seats",
    dimensions: "3-seater sofa + 2-seater loveseat + sculpted petal lounge armchair",
    description:
      "Soft rounded cloud-inspired seating set including a 3-seater sofa, 2-seater loveseat, and sculpted flower/petal lounge armchair in rich bouclé.",
    detail: "5–6 seats · 3+2+1 suite · Bouclé cloud silhouette",
    price: "Ask for price",
    image: boucleArmchair,
    span: "tall",
    category: "sofas",
  },
  {
    id: "sofa-allo-club-suite",
    title: "Allo Sofa Set (Contemporary Lounge Suite)",
    seatingCapacity: "6–7 seats",
    dimensions: "Dual curved sofas + two olive green velvet club armchairs",
    description:
      "Complete living room suite with two curved contemporary sofas and two olive green velvet club armchairs surrounding tiered drum tables.",
    detail: "6–7 seats · Dual sofas + 2 club chairs · Velvet & weave",
    price: "Ask for price",
    image: clientLifestyle5451,
    span: "wide",
    category: "sofas",
  },
];

export const newArrivals: Product[] = [
  catalogueSofas[0], // Curve Sofa
  catalogueSofas[2], // Rove Sofa
  catalogueSofas[6], // Alfy Sofa
  catalogueSofas[9], // Allo L-shaped with Console
];

export const kitchenProducts: Product[] = [
  {
    id: "k-1",
    title: "Oval Dining Set",
    detail: "White polished top · Turned solid wood legs",
    price: "Ask for price",
    image: diningOval,
    span: "wide",
  },
  {
    id: "k-2",
    title: "Pedestal Dining Suite",
    detail: "Pale oval top · Ergonomic scoop dining chairs",
    price: "Ask for price",
    image: diningShowroom,
    span: "tall",
  },
  {
    id: "k-3",
    title: "Sculpted Console Table",
    detail: "Matte cream finish · Architectural carved fluted legs",
    price: "Ask for price",
    image: consoleSculpted,
    span: "tall",
  },
  {
    id: "k-4",
    title: "Geometric Relief TV Unit",
    detail: "Grey textured relief doors · Low profile console",
    price: "Ask for price",
    image: tvUnitGeometric,
    span: "wide",
  },
  {
    id: "k-5",
    title: "Sand Minimalist TV Unit",
    detail: "Four soft-touch doors · Cylinder solid feet",
    price: "Ask for price",
    image: tvUnitSand,
    span: "wide",
  },
  {
    id: "k-6",
    title: "Abkem Atelier Serving Collection",
    detail: "Hand-crafted stoneware & walnut trays",
    price: "Ask for price",
    image: aboutAtelier,
  },
];

export const kidsProducts: Product[] = [
  {
    id: "kd-1",
    title: "Channel Velvet Bed",
    detail: "Sage velvet upholstery · Padded headboard frame",
    price: "Ask for price",
    image: bedVelvet,
    span: "tall",
  },
  {
    id: "kd-2",
    title: "Cloud Lounge Chair",
    detail: "Oat textured weave · Ergonomic low-slung contour",
    price: "Ask for price",
    image: loungeChairCream,
  },
  {
    id: "kd-3",
    title: "Shell Bouclé Armchair",
    detail: "Cream tactile bouclé · Piped tailored edges",
    price: "Ask for price",
    image: boucleArmchair,
    span: "wide",
  },
  {
    id: "kd-4",
    title: "Navy Velvet Wingback",
    detail: "Navy velvet · Tapered mid-century wooden legs",
    price: "Ask for price",
    image: wingbackReading,
  },
  {
    id: "kd-5",
    title: "Tufted Charcoal Armchair",
    detail: "Charcoal weave · Matte black steel tapered legs",
    price: "Ask for price",
    image: armchairGrey,
  },
];

export const softProducts: Product[] = [
  ...catalogueSofas,
  {
    id: "s-armchair-1",
    title: "Shell Bouclé Armchair",
    detail: "Cream bouclé · Piped edges · Sculpted silhouette",
    price: "Ask for price",
    image: boucleArmchair,
    span: "tall",
  },
  {
    id: "s-armchair-2",
    title: "Navy Wingback Chair",
    detail: "Navy velvet · Solid tapered wood legs",
    price: "Ask for price",
    image: wingbackReading,
    span: "tall",
  },
  {
    id: "s-armchair-3",
    title: "Cloud Lounge Chair",
    detail: "Oat textured fabric · Low lounge profile",
    price: "Ask for price",
    image: loungeChairCream,
    span: "wide",
  },
];

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
};

export const featuredPost: Post = {
  slug: "crafting-for-the-modern-ethiopian-home",
  title: "Crafting for the Modern Ethiopian Home",
  excerpt:
    "How our Addis Ababa production team pairs timeless European joinery with bespoke sizes and tailored fabrics.",
  category: "Craft & Interiors",
  date: "October 2026",
  readTime: "6 min read",
  image: clientHomeLiving,
};

export const posts: Post[] = [
  {
    slug: "custom-sizing-your-living-room",
    title: "Custom Sizing Your Living Room",
    excerpt: "Why custom proportions change how a room feels and lives every single day.",
    category: "Design Advice",
    date: "September 2026",
    readTime: "5 min",
    image: clientLifestyle2369,
  },
  {
    slug: "textures-that-last",
    title: "Textures That Last: Bouclé, Weave & Velvet",
    excerpt: "Selecting high-traffic fabrics that age gracefully in Ethiopian light.",
    category: "Materials",
    date: "August 2026",
    readTime: "7 min",
    image: curvedBoucleSofa,
  },
  {
    slug: "visiting-abkem-tower",
    title: "Behind the Scenes at Abkem Tower",
    excerpt: "A walkthrough of our two-floor showroom at Meskel Flower in Addis Ababa.",
    category: "Showroom",
    date: "July 2026",
    readTime: "4 min",
    image: bunaGuests,
  },
];
