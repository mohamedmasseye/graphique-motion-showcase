import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, ProductVariant } from '@/types/database';

export interface CartItem {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

function itemKey(productId: string, variantId?: string | null) {
  return variantId ? `${productId}:${variantId}` : productId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, variant = null, quantity = 1) => {
        set((state) => {
          const key = itemKey(product.id, variant?.id);
          const existing = state.items.find(
            (i) => itemKey(i.product.id, i.variant?.id) === key
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.product.id, i.variant?.id) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
              isOpen: true,
            };
          }

          return {
            items: [...state.items, { product, variant, quantity }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, variantId = null) => {
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.product.id, i.variant?.id) !== itemKey(productId, variantId)
          ),
        }));
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.product.id, i.variant?.id) === itemKey(productId, variantId)
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => {
          const price = i.variant?.price ?? i.product.price;
          return sum + price * i.quantity;
        }, 0),
    }),
    {
      name: 'gm-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
