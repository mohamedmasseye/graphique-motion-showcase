export type ProductStatus = 'active' | 'draft' | 'archived';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'wave' | 'orange_money' | 'cash_on_delivery';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  compare_price: number | null;
  category_id: string | null;
  category?: Category;
  brand: string | null;
  sku: string | null;
  weight: number | null;
  warranty: string | null;
  specifications: Record<string, string>;
  images: string[];
  stock: number;
  status: ProductStatus;
  featured: boolean;
  has_variants: boolean;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: number;
  compare_price: number | null;
  stock: number;
  images: string[];
  attributes: Record<string, string>;
  sort_order: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
}

/* ═══ Portfolio ══════════════════════════════════════════════════ */

/** Primary project types for filtering */
export type ProjectType =
  | 'digital_product'
  | 'website'
  | 'ecommerce'
  | 'web_application'
  | 'mobile_pwa'
  | 'branding'
  | 'graphic_design'
  | 'event'
  | 'other';

/** Category groups for portfolio filters */
export type PortfolioCategory =
  | 'digital_products'
  | 'web_ecommerce'
  | 'branding'
  | 'design'
  | 'events';

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  digital_product: 'Digital Product',
  website: 'Website',
  ecommerce: 'E-commerce',
  web_application: 'Web Application',
  mobile_pwa: 'Mobile / PWA',
  branding: 'Branding',
  graphic_design: 'Graphic Design',
  event: 'Event',
  other: 'Other',
};

export const PORTFOLIO_CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  digital_products: 'Digital Products',
  web_ecommerce: 'Web & E-commerce',
  branding: 'Branding',
  design: 'Design',
  events: 'Events',
};

export const PORTFOLIO_CATEGORY_COLORS: Record<PortfolioCategory, string> = {
  digital_products: '#378ADD',
  web_ecommerce: '#00B2AA',
  branding: '#F5821F',
  design: '#7F77DD',
  events: '#EC4899',
};

/**
 * Map legacy category values from Supabase to new PortfolioCategory.
 * Handles backward compatibility with existing data.
 */
export function mapCategoryToGroup(category: string): PortfolioCategory {
  const c = category.toLowerCase();
  if (['web', 'pwa'].includes(c)) return 'web_ecommerce';
  if (['logo', 'branding'].includes(c)) return 'branding';
  if (['print', 'design', 'video'].includes(c)) return 'design';
  if (['event'].includes(c)) return 'events';
  if (['app'].includes(c)) return 'digital_products';
  return 'web_ecommerce';
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  link: string | null;
  description: string | null;
  tags: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;

  /* ── New fields (nullable for backward compat) ─────────────── */
  project_type: ProjectType | null;
  short_description: string | null;
  long_description: string | null;
  client_name: string | null;
  industry: string | null;
  year: number | null;
  technologies: string[];
  images: string[];
  featured: boolean;
  featured_order: number | null;
  case_study: boolean;
  challenge: string | null;
  strategy: string | null;
  solution: string | null;
  development: string | null;
  outcome: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  published: boolean;
}

/** Default values for new fields when creating a project */
export const PORTFOLIO_DEFAULTS: Partial<PortfolioProject> = {
  project_type: 'website',
  short_description: null,
  long_description: null,
  client_name: null,
  industry: null,
  year: null,
  technologies: [],
  images: [],
  featured: false,
  featured_order: null,
  case_study: false,
  challenge: null,
  strategy: null,
  solution: null,
  development: null,
  outcome: null,
  seo_title: null,
  seo_description: null,
  og_image: null,
  published: true,
};

/* ═══ Orders & Cart (unchanged) ═════════════════════════════════ */

export interface SiteSettings {
  id: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string | null;
  city: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_ref: string | null;
  payment_status: string | null;
  wave_transaction_id: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  notes: string | null;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  variant_id: string | null;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total: number;
}
