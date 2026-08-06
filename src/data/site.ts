import heroLiving from "@/assets/hero-living.jpg";
import lifestyle1 from "@/assets/lifestyle-1.jpg";
import catKitchen from "@/assets/cat-kitchen.jpg";
import catKids from "@/assets/cat-kids.jpg";
import catSoft from "@/assets/cat-soft.jpg";
import journalFeature from "@/assets/journal-feature.jpg";
import aboutAtelier from "@/assets/about-atelier.jpg";
import showroom from "@/assets/showroom.jpg";

export const images = {
  heroLiving,
  lifestyle1,
  catKitchen,
  catKids,
  catSoft,
  journalFeature,
  aboutAtelier,
  showroom,
};

export const brand = {
  name: "ANTE DESIGN",
  phone: "+251 97 322 2211",
  whatsapp: "251973222211",
  email: "concierge@antedesign.com",
  address: "ABKEM Tower, Addis Ababa, Ethiopia",
};

export type Product = {
  id: string;
  title: string;
  detail: string;
  price: string;
  image: string;
  span?: "tall" | "wide";
};

export const newArrivals: Product[] = [
  { id: "na-1", title: "Aldo Modular Sofa", detail: "Ivory bouclé · Solid oak base", price: "From 24,900 ETB", image: heroLiving },
  { id: "na-2", title: "Travertine Low Table", detail: "Honed Roman travertine", price: "8,400 ETB", image: lifestyle1 },
  { id: "na-3", title: "Noir Kitchen Island", detail: "Basalt stone · Oak veneer", price: "On request", image: catKitchen },
  { id: "na-4", title: "Sabbia Puff Ottoman", detail: "Sand bouclé · Down fill", price: "3,150 ETB", image: catSoft },
];

export const kitchenProducts: Product[] = [
  { id: "k-1", title: "Basalto Island", detail: "Honed basalt · Brushed brass", price: "On request", image: catKitchen, span: "tall" },
  { id: "k-2", title: "Rovere Tall Cabinetry", detail: "Rift-cut oak", price: "42,000 ETB", image: lifestyle1 },
  { id: "k-3", title: "Pietra Dining Table", detail: "Travertine pedestal", price: "18,600 ETB", image: heroLiving, span: "wide" },
  { id: "k-4", title: "Milo Counter Stool", detail: "Charcoal wool · Blackened steel", price: "2,900 ETB", image: catSoft },
  { id: "k-5", title: "Ombra Pendant", detail: "Alabaster · Bronze", price: "5,400 ETB", image: journalFeature, span: "tall" },
  { id: "k-6", title: "Sale Serving Collection", detail: "Hand-thrown stoneware", price: "From 480 ETB", image: aboutAtelier },
  { id: "k-7", title: "Linea Open Shelving", detail: "Smoked oak · Steel", price: "12,300 ETB", image: showroom },
  { id: "k-8", title: "Terra Bar Cabinet", detail: "Fumed oak · Antique mirror", price: "21,700 ETB", image: catKitchen },
];

export const kidsProducts: Product[] = [
  { id: "kd-1", title: "Luna Crib", detail: "Untreated ash · Linen", price: "6,900 ETB", image: catKids, span: "tall" },
  { id: "kd-2", title: "Piccolo Reading Chair", detail: "Cream bouclé", price: "3,400 ETB", image: catSoft },
  { id: "kd-3", title: "Ondine Play Rug", detail: "Hand-knotted wool", price: "4,200 ETB", image: lifestyle1, span: "wide" },
  { id: "kd-4", title: "Arco Rocking Horse", detail: "Carved solid oak", price: "1,850 ETB", image: catKids },
  { id: "kd-5", title: "Nube Canopy", detail: "Washed Belgian linen", price: "1,200 ETB", image: journalFeature },
  { id: "kd-6", title: "Piccola Wardrobe", detail: "Pale oak · Soft close", price: "14,500 ETB", image: showroom, span: "tall" },
  { id: "kd-7", title: "Sogno Toy Chest", detail: "Solid ash · Leather pull", price: "2,600 ETB", image: aboutAtelier },
];

export const softProducts: Product[] = [
  { id: "s-1", title: "Sabbia Puff Sofa", detail: "Sand bouclé · Feather fill", price: "16,400 ETB", image: catSoft, span: "tall" },
  { id: "s-2", title: "Lino Cushion 60×60", detail: "Stonewashed linen", price: "390 ETB", image: lifestyle1 },
  { id: "s-3", title: "Nuvola Floor Cushion", detail: "Ivory bouclé", price: "1,150 ETB", image: heroLiving, span: "wide" },
  { id: "s-4", title: "Terra Throw", detail: "Undyed alpaca", price: "1,680 ETB", image: catKids },
  { id: "s-5", title: "Ombra Velvet Bolster", detail: "Charcoal cotton velvet", price: "520 ETB", image: journalFeature, span: "tall" },
  { id: "s-6", title: "Calma Puff Ottoman", detail: "Boiled wool · Oak feet", price: "3,150 ETB", image: showroom },
  { id: "s-7", title: "Duna Cushion Set", detail: "Set of three · Warm neutrals", price: "980 ETB", image: aboutAtelier },
  { id: "s-8", title: "Sera Bed Linen", detail: "Belgian flax · Sand", price: "From 1,400 ETB", image: catKitchen },
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
  slug: "the-architecture-of-stillness",
  title: "The Architecture of Stillness",
  excerpt:
    "On restraint as a design instrument — how negative space, raking light and a single considered object can carry an entire room.",
  category: "Interiors",
  date: "June 2026",
  readTime: "9 min read",
  image: journalFeature,
};

export const posts: Post[] = [
  { slug: "living-with-travertine", title: "Living With Travertine", excerpt: "The quiet permanence of stone, and how to let it age honestly.", category: "Materials", date: "May 2026", readTime: "6 min", image: lifestyle1 },
  { slug: "a-kitchen-without-noise", title: "A Kitchen Without Noise", excerpt: "Concealed storage, honed surfaces and the discipline of a clear counter.", category: "Kitchen", date: "May 2026", readTime: "7 min", image: catKitchen },
  { slug: "the-considered-nursery", title: "The Considered Nursery", excerpt: "Designing children's rooms that grow up gracefully alongside them.", category: "Kids", date: "April 2026", readTime: "5 min", image: catKids },
  { slug: "in-praise-of-boucle", title: "In Praise of Bouclé", excerpt: "Texture as the last remaining ornament in a monochrome interior.", category: "Textiles", date: "April 2026", readTime: "4 min", image: catSoft },
  { slug: "inside-the-atelier", title: "Inside the Atelier", excerpt: "Four weeks with the joiners who build our modular frames by hand.", category: "Craft", date: "March 2026", readTime: "8 min", image: aboutAtelier },
  { slug: "light-as-material", title: "Light as Material", excerpt: "Layering illumination so a room changes character between dusk and dawn.", category: "Interiors", date: "March 2026", readTime: "6 min", image: heroLiving },
];
