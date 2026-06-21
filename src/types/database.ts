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
}

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
