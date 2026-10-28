/**
 * Anteniguss Home — Unified Full-Stack API Client & Store
 *
 * Directly connects to the Yegara MariaDB backend (api-bridge.php)
 * when VITE_API_BRIDGE_URL is set, and maintains an offline-first
 * persistent local cache with full CRUD capabilities.
 */

import { catalogueSofas, type Product } from "@/data/site";

// =========================================================================
// TYPES & INTERFACES
// =========================================================================

export interface BackendProduct {
  id: number | string;
  slug: string;
  title: string;
  amharic_name?: string | null;
  category: string; // 'sofas' | 'dining' | 'armchairs' | 'bedroom' | 'kids'
  seating_capacity?: string | null;
  dimensions?: string | null;
  description?: string | null;
  detail?: string | null;
  price_display: string;
  price_etb?: number | null;
  image_url: string;
  gallery_images?: string[];
  wood_options?: string[];
  fabric_options?: string[];
  span?: "normal" | "wide" | "tall";
  is_featured: boolean;
  is_top_pick: boolean;
  sort_order: number;
  is_archived?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InquiryItem {
  product_id?: number | string | null;
  product_name: string;
  selected_wood?: string | null;
  selected_fabric?: string | null;
  quantity: number;
}

export type InquiryStatus =
  "new_lead" | "contacted" | "showroom_booked" | "in_production" | "closed";

export interface CustomerInquiry {
  id: number | string;
  inquiry_number: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp?: string;
  subcity_area?: string;
  customer_notes?: string;
  status: InquiryStatus;
  staff_notes?: string;
  created_at: string;
  items: InquiryItem[];
}

export interface SiteSectionHero {
  headline: string;
  subheadline: string;
  kicker: string;
  backgroundImage: string;
  ctaLabel?: string;
  ctaTo?: string;
  secondaryCtaLabel?: string;
  secondaryCtaTo?: string;
}

export interface SiteSectionMadeToOrder {
  title: string;
  description: string;
  bullet1: string;
  bullet2: string;
  bullet3: string;
  bullet4?: string;
  imageUrl: string;
  ctaLabel?: string;
  whatsappText?: string;
}

export interface SiteSectionShowroom {
  headline?: string;
  subheadline?: string;
  address: string;
  openingHours: string;
  phone: string;
  email: string;
  imageUrl: string;
  mapUrl?: string;
}

export interface SiteSectionAbout {
  title?: string;
  story?: string;
  atelierImage?: string;
}

export interface SiteSettingsMap {
  hero?: SiteSectionHero;
  made_to_order?: SiteSectionMadeToOrder;
  showroom?: SiteSectionShowroom;
  about_page?: SiteSectionAbout;
  [key: string]: unknown;
}

export interface DynamicBlogPost {
  id?: number | string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  cover_image_url: string;
  author_name?: string;
  read_time?: string;
  status: "draft" | "published";
  target_keyword?: string;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  published_at?: string;
  created_at?: string;
}

export interface MediaItem {
  filename: string;
  url: string;
  size: number;
  modified: number;
}

// =========================================================================
// CONFIGURATION & PERSISTENCE KEYS
// =========================================================================

const BRIDGE_URL =
  import.meta.env.VITE_API_BRIDGE_URL || "https://api.anteniguss.com/api-bridge.php";
const BRIDGE_KEY = import.meta.env.VITE_API_BRIDGE_KEY || "anteniguss_secure_key_2026_xyz";

const STORAGE_KEYS = {
  PRODUCTS: "ante_products_v2",
  INQUIRIES: "ante_inquiries_v2",
  BAG: "ante_quote_bag_v2",
  SETTINGS: "ante_site_settings_v2",
  POSTS: "ante_dynamic_posts_v2",
};

// Seed initial fallback products from catalogueSofas
const INITIAL_PRODUCTS: BackendProduct[] = catalogueSofas.map((s, idx) => ({
  id: idx + 1,
  slug: s.id,
  title: s.title,
  amharic_name: s.amharicName || null,
  category: s.category || "sofas",
  seating_capacity: s.seatingCapacity || null,
  dimensions: s.dimensions || null,
  description: s.description || null,
  detail: s.detail || null,
  price_display: s.price || "Ask for price",
  price_etb: null,
  image_url: s.image,
  gallery_images: [],
  wood_options: ["Solid Teak", "Wanza (Cordia)", "Mahogany", "White Oak"],
  fabric_options: ["Bouclé Cream", "Belgian Linen", "Plush Velvet Olive", "Leather Cognac"],
  span: s.span || "normal",
  is_featured: idx < 4,
  is_top_pick: idx < 6,
  sort_order: idx + 1,
  is_archived: false,
}));

// Initial fallback settings
const INITIAL_SETTINGS: SiteSettingsMap = {
  hero: {
    headline: "Furniture for the modern Ethiopian home.",
    subheadline:
      "Sofas, armchairs, dining sets and beds, made in Addis Ababa in the size and fabric you choose.",
    kicker: "አንተ፡ንጉስ · Addis Ababa",
    backgroundImage: "/IMG_5171.jpg",
    ctaLabel: "Browse Catalog",
    ctaTo: "/shop",
    secondaryCtaLabel: "Custom Order",
    secondaryCtaTo: "/shop",
  },
  made_to_order: {
    title: "Your size. Your fabric. Made in Addis.",
    description:
      "Every sofa, chair and table is built by our own production team. Tell us your room size and pick the fabric and colour.",
    bullet1: "Custom orders ready in about 20–30 days",
    bullet2: "See and feel fabrics at the showroom",
    bullet3: "Delivery and setup by our team",
    imageUrl: "/curved-sectional.jpg",
    ctaLabel: "Explore Catalog & Quote",
  },
  showroom: {
    headline: "Visit the showroom",
    subheadline: "Touch fabrics, sit on frames, and talk with our team.",
    address: "Meskel Flower, Abkem Tower 2nd Floor, Addis Ababa",
    openingHours: "Mon – Sat, 10:00 – 20:00 · Sunday by appointment",
    phone: "+251 911 903 307",
    email: "homeanteniguss@gmail.com",
    imageUrl: "/buna-guests.jpg",
    mapUrl: "https://maps.google.com/?q=Meskel+Flower+Abkem+Tower+Addis+Ababa",
  },
};

// =========================================================================
// 1. PRODUCTS API (Full CRUD)
// =========================================================================

export async function getProducts(filters?: {
  category?: string;
  capacity?: string;
  search?: string;
  featured?: boolean;
  top_picks?: boolean;
  include_archived?: boolean;
}): Promise<BackendProduct[]> {
  if (BRIDGE_URL) {
    try {
      const params = new URLSearchParams({ action: "get_products" });
      if (filters?.category && filters.category !== "all")
        params.append("category", filters.category);
      if (filters?.capacity && filters.capacity !== "all")
        params.append("capacity", filters.capacity);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.featured) params.append("featured", "1");
      if (filters?.top_picks) params.append("top_picks", "1");
      if (filters?.include_archived) params.append("include_archived", "1");

      const res = await fetch(`${BRIDGE_URL}?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.products)) {
          return json.products;
        }
      }
    } catch (e) {
      console.warn("API Bridge getProducts failed, using local store:", e);
    }
  }

  // Fallback to local store
  let list = getLocalProducts();
  if (!filters?.include_archived) {
    list = list.filter((p) => !p.is_archived);
  }
  if (filters?.category && filters.category !== "all") {
    list = list.filter((p) => p.category === filters.category);
  }
  if (filters?.capacity && filters.capacity !== "all") {
    list = list.filter((p) =>
      (p.seating_capacity || "").toLowerCase().includes(filters.capacity!.toLowerCase()),
    );
  }
  if (filters?.featured) {
    list = list.filter((p) => p.is_featured);
  }
  if (filters?.top_picks) {
    list = list.filter((p) => p.is_top_pick);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.amharic_name || "").toLowerCase().includes(q),
    );
  }
  return list;
}

export async function getProduct(idOrSlug: string | number): Promise<BackendProduct | null> {
  if (BRIDGE_URL) {
    try {
      const isNum = typeof idOrSlug === "number" || /^\d+$/.test(String(idOrSlug));
      const param = isNum ? `id=${idOrSlug}` : `slug=${idOrSlug}`;
      const res = await fetch(`${BRIDGE_URL}?action=get_product&${param}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.product) return json.product;
      }
    } catch (e) {
      console.warn("API Bridge getProduct failed:", e);
    }
  }

  const list = getLocalProducts();
  return list.find((p) => String(p.id) === String(idOrSlug) || p.slug === String(idOrSlug)) || null;
}

export async function createProduct(
  product: Omit<BackendProduct, "id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; id?: number | string; slug?: string }> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=create_product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json;
      }
    } catch (e) {
      console.warn("API Bridge createProduct failed, saving to local store:", e);
    }
  }

  const list = getLocalProducts();
  const newProduct: BackendProduct = {
    ...product,
    id: Date.now(),
    slug: product.slug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  saveLocalProducts([newProduct, ...list]);
  return { success: true, id: newProduct.id, slug: newProduct.slug };
}

export async function updateProduct(
  id: number | string,
  fields: Partial<BackendProduct>,
  auth?: { name?: string; role?: string },
): Promise<boolean> {
  if (BRIDGE_URL) {
    try {
      await fetch(`${BRIDGE_URL}?action=update_product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: JSON.stringify({
          ...fields,
          id,
          auth_user_name: auth?.name,
          auth_user_role: auth?.role,
        }),
      });
    } catch (e) {
      console.warn("API Bridge updateProduct failed, updating local store:", e);
    }
  }

  const list = getLocalProducts();
  const updated = list.map((p) =>
    String(p.id) === String(id) || p.slug === String(id)
      ? { ...p, ...fields, updated_at: new Date().toISOString() }
      : p,
  );
  saveLocalProducts(updated);
  return true;
}

export async function deleteProduct(
  id: number | string,
  hardDelete = false,
  auth?: { name?: string; role?: string },
): Promise<boolean> {
  if (BRIDGE_URL) {
    try {
      await fetch(`${BRIDGE_URL}?action=delete_product${hardDelete ? "&hard=1" : ""}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: JSON.stringify({
          id,
          auth_user_name: auth?.name,
          auth_user_role: auth?.role,
        }),
      });
    } catch (e) {
      console.warn("API Bridge deleteProduct failed:", e);
    }
  }

  const list = getLocalProducts();
  const updated = hardDelete
    ? list.filter((p) => String(p.id) !== String(id) && p.slug !== String(id))
    : list.map((p) =>
        String(p.id) === String(id) || p.slug === String(id) ? { ...p, is_archived: true } : p,
      );
  saveLocalProducts(updated);
  return true;
}

function getLocalProducts(): BackendProduct[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function saveLocalProducts(products: BackendProduct[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event("ante-products-updated"));
  } catch (e) {
    console.error(e);
  }
}

// =========================================================================
// 2. SITE SETTINGS & PAGE CONTENT (Full CRUD)
// =========================================================================

export async function fetchSiteSettings(): Promise<SiteSettingsMap> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=get_settings`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.settings) {
          saveLocalSettings(json.settings);
          return json.settings;
        }
      }
    } catch (e) {
      console.warn("API Bridge fetchSiteSettings failed, using local store:", e);
    }
  }

  return getLocalSettings();
}

export async function saveSiteSection(sectionKey: string, payload: unknown): Promise<boolean> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=save_settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: JSON.stringify({ section_key: sectionKey, payload }),
      });
      if (res.ok) {
        // Also update local cache
        const current = getLocalSettings();
        saveLocalSettings({ ...current, [sectionKey]: payload });
        return true;
      }
    } catch (e) {
      console.warn("API Bridge saveSiteSection failed, updating local store:", e);
    }
  }

  const current = getLocalSettings();
  saveLocalSettings({ ...current, [sectionKey]: payload });
  return true;
}

export function getSiteSettings(): SiteSettingsMap {
  return getLocalSettings();
}

export function saveSiteSettings(section: keyof SiteSettingsMap, data: unknown): void {
  saveSiteSection(section as string, data);
}

function getLocalSettings(): SiteSettingsMap {
  if (typeof window === "undefined") return INITIAL_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SETTINGS;
  }
}

function saveLocalSettings(settings: SiteSettingsMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event("ante-settings-updated"));
  } catch (e) {
    console.error(e);
  }
}

// =========================================================================
// 3. BLOG POSTS / SEO JOURNAL (Full CRUD)
// =========================================================================

export async function getBlogPosts(filters?: {
  status?: string;
  category?: string;
  search?: string;
}): Promise<DynamicBlogPost[]> {
  if (BRIDGE_URL) {
    try {
      const params = new URLSearchParams({ action: "get_posts" });
      if (filters?.status) params.append("status", filters.status);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.search) params.append("search", filters.search);

      const res = await fetch(`${BRIDGE_URL}?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.posts)) {
          return json.posts;
        }
      }
    } catch (e) {
      console.warn("API Bridge getBlogPosts failed, using local store:", e);
    }
  }

  return getDynamicBlogPosts();
}

export async function createBlogPost(
  post: Omit<DynamicBlogPost, "id" | "created_at">,
): Promise<boolean> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=create_post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: JSON.stringify(post),
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("API Bridge createBlogPost failed, saving local:", e);
    }
  }

  saveDynamicBlogPost(post as DynamicBlogPost);
  return true;
}

export async function updateBlogPost(
  id: number | string,
  post: Partial<DynamicBlogPost>,
): Promise<boolean> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=update_post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: JSON.stringify({ ...post, id }),
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("API Bridge updateBlogPost failed:", e);
    }
  }

  const posts = getDynamicBlogPosts();
  const updated = posts.map((p) => (String(p.id) === String(id) ? { ...p, ...post } : p));
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
  return true;
}

export async function deleteBlogPost(id: number | string): Promise<boolean> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=delete_post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("API Bridge deleteBlogPost failed:", e);
    }
  }

  const posts = getDynamicBlogPosts();
  const updated = posts.filter((p) => String(p.id) !== String(id));
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
  return true;
}

export function getDynamicBlogPosts(): DynamicBlogPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDynamicBlogPost(post: DynamicBlogPost): DynamicBlogPost[] {
  if (typeof window === "undefined") return [];
  try {
    const list = getDynamicBlogPosts();
    const existingIdx = list.findIndex((p) => p.slug === post.slug);
    let updated: DynamicBlogPost[];
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = { ...post, published_at: new Date().toISOString() };
    } else {
      updated = [
        { ...post, id: "post-" + Date.now(), published_at: new Date().toISOString() },
        ...list,
      ];
    }
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error(e);
    return [];
  }
}

// =========================================================================
// 4. CUSTOMER INQUIRIES & LEADS CRM (Full CRUD)
// =========================================================================

export async function submitCustomerInquiry(data: {
  customer_name: string;
  customer_phone: string;
  customer_whatsapp?: string;
  subcity_area?: string;
  customer_notes?: string;
  items: InquiryItem[];
}): Promise<{ success: boolean; inquiry_number: string }> {
  const generatedNumber = "#ANTE-" + Math.floor(1000 + Math.random() * 9000);

  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=submit_inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, inquiry_number: json.inquiry_number || generatedNumber };
      }
    } catch (e) {
      console.warn("API Bridge submit_inquiry failed, using local store:", e);
    }
  }

  // Local fallback
  try {
    const existing = getLocalInquiries();
    const newInquiry: CustomerInquiry = {
      id: "inq-" + Date.now(),
      inquiry_number: generatedNumber,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_whatsapp: data.customer_whatsapp || data.customer_phone,
      subcity_area: data.subcity_area,
      customer_notes: data.customer_notes,
      status: "new_lead",
      created_at: new Date().toISOString(),
      items: data.items,
    };
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify([newInquiry, ...existing]));
  } catch (err) {
    console.error(err);
  }

  return { success: true, inquiry_number: generatedNumber };
}

export async function getInquiries(filters?: {
  status?: string;
  search?: string;
}): Promise<CustomerInquiry[]> {
  if (BRIDGE_URL) {
    try {
      const params = new URLSearchParams({ action: "get_inquiries" });
      if (filters?.status) params.append("status", filters.status);
      if (filters?.search) params.append("search", filters.search);

      const res = await fetch(`${BRIDGE_URL}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.inquiries)) {
          return json.inquiries;
        }
      }
    } catch (e) {
      console.warn("API Bridge getInquiries failed, using local store:", e);
    }
  }

  return getLocalInquiries();
}

export async function updateInquiryStatus(
  id: string | number,
  status: InquiryStatus,
  staff_notes?: string,
): Promise<boolean> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=update_inquiry_status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: JSON.stringify({ id, status, staff_notes }),
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("API Bridge updateInquiryStatus failed:", e);
    }
  }

  const list = getLocalInquiries();
  const updated = list.map((item) => {
    if (String(item.id) === String(id)) {
      return {
        ...item,
        status,
        staff_notes: staff_notes !== undefined ? staff_notes : item.staff_notes,
      };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
  return true;
}

export async function deleteInquiry(id: string | number): Promise<boolean> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=delete_inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn("API Bridge deleteInquiry failed:", e);
    }
  }

  const list = getLocalInquiries();
  const updated = list.filter((i) => String(i.id) !== String(id));
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
  return true;
}

function getLocalInquiries(): CustomerInquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// =========================================================================
// 5. INQUIRY / QUOTE BAG
// =========================================================================

export interface BagItem {
  id: string;
  productId: string | number;
  productName: string;
  productImage: string;
  dimensions?: string;
  selectedWood: string;
  selectedFabric: string;
  quantity: number;
  customNotes?: string;
}

export function getQuoteBag(): BagItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BAG);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToQuoteBag(item: Omit<BagItem, "id">): BagItem[] {
  const current = getQuoteBag();
  const newItem: BagItem = {
    ...item,
    id: `${item.productId}-${Date.now()}`,
  };
  const updated = [newItem, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.BAG, JSON.stringify(updated));
    window.dispatchEvent(new Event("ante-bag-updated"));
  } catch (e) {
    console.error(e);
  }
  return updated;
}

export function removeFromQuoteBag(itemId: string): BagItem[] {
  const current = getQuoteBag();
  const updated = current.filter((i) => i.id !== itemId);
  try {
    localStorage.setItem(STORAGE_KEYS.BAG, JSON.stringify(updated));
    window.dispatchEvent(new Event("ante-bag-updated"));
  } catch (e) {
    console.error(e);
  }
  return updated;
}

export function clearQuoteBag(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.BAG);
    window.dispatchEvent(new Event("ante-bag-updated"));
  } catch (e) {
    console.error(e);
  }
}

// =========================================================================
// 6. MEDIA & IMAGE UPLOADS
// =========================================================================

export async function uploadImageFile(file: File): Promise<{ success: boolean; url: string }> {
  if (BRIDGE_URL) {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${BRIDGE_URL}?action=upload_image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.url) {
          return { success: true, url: json.url };
        }
      }
    } catch (e) {
      console.warn("Bridge upload failed, using local Data URL:", e);
    }
  }

  // Fallback: convert to base64 Data URL so local development works immediately
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ success: true, url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ success: false, url: "" });
    };
    reader.readAsDataURL(file);
  });
}

export async function listMediaFiles(): Promise<MediaItem[]> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=list_media`, {
        headers: {
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.media)) {
          return json.media;
        }
      }
    } catch (e) {
      console.warn("API Bridge listMediaFiles failed:", e);
    }
  }
  return [];
}

// =========================================================================
// 7. AUTHENTICATION, USERS & AUDIT TRAIL
// =========================================================================

export type AdminRole = "SUPER_ADMIN" | "STORE_MANAGER" | "MARKETING";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  last_login?: string;
  created_at?: string;
}

export interface AuditLogItem {
  id: number;
  user_id?: number | null;
  user_name: string;
  user_role: string;
  action: string;
  target_type: string;
  target_id?: string | null;
  details?: string | null;
  ip_address?: string | null;
  created_at: string;
}

const AUTH_USER_STORAGE_KEY = "ante_current_admin_user_v2";

export function getCurrentUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AdminUser | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
    window.dispatchEvent(new Event("ante-auth-changed"));
  } catch (e) {
    console.error(e);
  }
}

export async function loginAdminUser(
  username_or_email: string,
  password: string,
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username_or_email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || "Invalid username or password" };
    } catch (e) {
      console.warn("API Bridge login failed, trying fallback check:", e);
    }
  }

  // Local fallback for offline/development use
  const fallbackUsers: Record<string, { pass: string; user: AdminUser }> = {
    admin: {
      pass: "Anteniguss2026!",
      user: {
        id: 1,
        username: "admin",
        email: "admin@anteniguss.com",
        full_name: "Super Admin",
        role: "SUPER_ADMIN",
        is_active: true,
      },
    },
    manager: {
      pass: "Manager2026!",
      user: {
        id: 2,
        username: "manager",
        email: "manager@anteniguss.com",
        full_name: "Showroom Manager",
        role: "STORE_MANAGER",
        is_active: true,
      },
    },
    marketing: {
      pass: "Marketing2026!",
      user: {
        id: 3,
        username: "marketing",
        email: "marketing@anteniguss.com",
        full_name: "Editorial Marketing",
        role: "MARKETING",
        is_active: true,
      },
    },
  };

  const idKey = username_or_email.toLowerCase();
  for (const key of Object.keys(fallbackUsers)) {
    const entry = fallbackUsers[key];
    if (
      (key === idKey || entry.user.email.toLowerCase() === idKey) &&
      password === entry.pass
    ) {
      setCurrentUser(entry.user);
      return { success: true, user: entry.user };
    }
  }

  return { success: false, error: "Invalid username/email or password" };
}

export async function changeUserPassword(
  userId: number,
  current_password: string,
  new_password: string,
): Promise<{ success: boolean; error?: string }> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=change_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: JSON.stringify({ user_id: userId, current_password, new_password }),
      });
      const data = await res.json();
      if (res.ok && data.success) return { success: true };
      return { success: false, error: data.error || "Failed to update password" };
    } catch (e) {
      console.warn("API Bridge change_password failed:", e);
    }
  }
  return { success: true };
}

export async function getUsers(): Promise<AdminUser[]> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=get_users`, {
        headers: { Authorization: `Bearer ${BRIDGE_KEY}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.users)) return json.users;
      }
    } catch (e) {
      console.warn("API Bridge get_users failed:", e);
    }
  }
  return [
    {
      id: 1,
      username: "admin",
      email: "admin@anteniguss.com",
      full_name: "Super Admin",
      role: "SUPER_ADMIN",
      is_active: true,
    },
    {
      id: 2,
      username: "manager",
      email: "manager@anteniguss.com",
      full_name: "Showroom Manager",
      role: "STORE_MANAGER",
      is_active: true,
    },
    {
      id: 3,
      username: "marketing",
      email: "marketing@anteniguss.com",
      full_name: "Editorial Marketing",
      role: "MARKETING",
      is_active: true,
    },
  ];
}

export async function createUser(data: {
  username: string;
  email: string;
  full_name: string;
  role: AdminRole;
  password: string;
  auth_user_name?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=create_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.success) return { success: true };
      return { success: false, error: json.error || "Failed to create user" };
    } catch (e) {
      return { success: false, error: "Network error creating user" };
    }
  }
  return { success: true };
}

export async function updateUser(
  id: number,
  data: Partial<AdminUser> & { password?: string; auth_user_name?: string },
): Promise<{ success: boolean; error?: string }> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=update_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: JSON.stringify({ ...data, id }),
      });
      const json = await res.json();
      if (res.ok && json.success) return { success: true };
      return { success: false, error: json.error || "Failed to update user" };
    } catch (e) {
      return { success: false, error: "Network error updating user" };
    }
  }
  return { success: true };
}

export async function deleteUser(
  id: number,
  auth_user_name?: string,
): Promise<{ success: boolean; error?: string }> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=delete_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BRIDGE_KEY}`,
        },
        body: JSON.stringify({ id, auth_user_name }),
      });
      const json = await res.json();
      if (res.ok && json.success) return { success: true };
      return { success: false, error: json.error || "Failed to delete user" };
    } catch (e) {
      return { success: false, error: "Network error deleting user" };
    }
  }
  return { success: true };
}

export async function getAuditLogs(): Promise<AuditLogItem[]> {
  if (BRIDGE_URL) {
    try {
      const res = await fetch(`${BRIDGE_URL}?action=get_audit_logs`, {
        headers: { Authorization: `Bearer ${BRIDGE_KEY}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.logs)) return json.logs;
      }
    } catch (e) {
      console.warn("API Bridge get_audit_logs failed:", e);
    }
  }
  return [];
}
