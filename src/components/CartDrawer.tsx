import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/formatPrice';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, close, updateQuantity, removeItem, subtotal, itemCount } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0A0A0F] border-l border-white/10 z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-brand-teal" />
                <h2 className="text-white font-bold text-lg">Panier ({itemCount()})</h2>
              </div>
              <button onClick={close} className="text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-white/10 mb-4" />
                  <p className="text-white/40 text-sm">Votre panier est vide</p>
                  <button
                    onClick={close}
                    className="mt-4 text-brand-teal text-sm hover:underline"
                  >
                    Continuer vos achats
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const price = item.variant?.price ?? item.product.price;
                  const image = item.variant?.images?.[0] ?? item.product.images?.[0];
                  const key = `${item.product.id}:${item.variant?.id ?? ''}`;

                  return (
                    <motion.div
                      key={key}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 bg-white/[0.04] border border-white/[0.08] rounded-xl p-3"
                    >
                      {image && (
                        <img
                          src={image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{item.product.name}</p>
                        {item.variant && (
                          <p className="text-white/40 text-xs">{item.variant.name}</p>
                        )}
                        <p className="text-brand-teal text-sm font-bold mt-1">{formatPrice(price)}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.product.id, item.variant?.id)}
                          className="text-white/30 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="flex items-center gap-2 bg-white/[0.06] rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.variant?.id ?? null, item.quantity - 1)}
                            className="p-1.5 text-white/50 hover:text-white transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-white text-xs font-bold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.variant?.id ?? null, item.quantity + 1)}
                            className="p-1.5 text-white/50 hover:text-white transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Sous-total</span>
                  <span className="text-white font-bold text-lg">{formatPrice(subtotal())}</span>
                </div>
                <p className="text-white/30 text-xs">Frais de livraison calculés au checkout</p>
                <Link
                  to="/checkout"
                  onClick={close}
                  className="block w-full text-center bg-brand-teal hover:bg-brand-teal/85 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
                >
                  Commander · {formatPrice(subtotal())}
                </Link>
                <button
                  onClick={close}
                  className="block w-full text-center text-white/40 hover:text-white/60 text-sm py-2 transition-colors"
                >
                  Continuer vos achats
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
