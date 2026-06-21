import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, Package, ChevronRight, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/formatPrice';
import type { ProductVariant } from '@/types/database';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug!);
  const addItem = useCartStore((s) => s.addItem);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-24 flex flex-col items-center justify-center text-center px-4">
          <Package size={48} className="text-white/10 mb-4" />
          <h1 className="text-white text-xl font-bold mb-2">Produit introuvable</h1>
          <Link to="/boutique" className="text-brand-teal text-sm hover:underline">Retour à la boutique</Link>
        </div>
      </>
    );
  }

  const currentPrice = selectedVariant?.price ?? product.price;
  const currentComparePrice = selectedVariant?.compare_price ?? product.compare_price;
  const currentStock = selectedVariant?.stock ?? product.stock;
  const images = selectedVariant?.images?.length ? selectedVariant.images : product.images;
  const hasDiscount = currentComparePrice && currentComparePrice > currentPrice;

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : null;

  const specs = product.specifications && typeof product.specifications === 'object'
    ? Object.entries(product.specifications)
    : [];

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    setQuantity(1);
  };

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar />
      <CartDrawer />

      <main className="min-h-screen bg-black pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            className="flex items-center gap-2 text-sm text-white/40 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Link to="/" className="hover:text-white/60 transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <Link to="/boutique" className="hover:text-white/60 transition-colors">Boutique</Link>
            {product.category && (
              <>
                <ChevronRight size={14} />
                <Link
                  to={`/boutique?cat=${product.category.slug}`}
                  className="hover:text-white/60 transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={14} />
            <span className="text-white/60 truncate">{product.name}</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.08] mb-4">
                {images?.[selectedImage] ? (
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={64} className="text-white/10" />
                  </div>
                )}
              </div>

              {images && images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        i === selectedImage ? 'border-brand-teal' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              {product.brand && (
                <p className="text-brand-teal text-xs font-semibold uppercase tracking-[0.2em] mb-2">{product.brand}</p>
              )}

              <h1 className="font-syne text-2xl md:text-3xl font-black text-white leading-tight">{product.name}</h1>

              {/* Rating */}
              {avgRating && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i <= Math.round(avgRating) ? 'text-brand-orange fill-brand-orange' : 'text-white/15'}
                      />
                    ))}
                  </div>
                  <span className="text-white/40 text-sm">{avgRating.toFixed(1)} ({product.reviews!.length} avis)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-5">
                <span className="text-brand-teal font-black text-3xl">{formatPrice(currentPrice)}</span>
                {hasDiscount && (
                  <span className="text-white/30 text-lg line-through">{formatPrice(currentComparePrice!)}</span>
                )}
              </div>

              {product.short_description && (
                <p className="text-[#A0A0A0] text-sm mt-4 leading-relaxed">{product.short_description}</p>
              )}

              {/* Variants */}
              {product.has_variants && product.variants && product.variants.length > 0 && (
                <div className="mt-6">
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Variante</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSelectedVariant(v.id === selectedVariant?.id ? null : v);
                            setSelectedImage(0);
                          }}
                          disabled={v.stock === 0}
                          className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            selectedVariant?.id === v.id
                              ? 'bg-brand-teal/15 border-brand-teal text-brand-teal border'
                              : v.stock === 0
                                ? 'bg-white/[0.03] border border-white/[0.06] text-white/20 cursor-not-allowed'
                                : 'bg-white/[0.06] border border-white/10 text-white/70 hover:border-white/20'
                          }`}
                        >
                          {selectedVariant?.id === v.id && <Check size={12} className="inline mr-1.5" />}
                          {v.name}
                          {v.price !== product.price && (
                            <span className="text-white/30 text-xs ml-1.5">{formatPrice(v.price)}</span>
                          )}
                          {v.stock === 0 && <span className="text-[10px] block text-red-400/60">Épuisé</span>}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-4 mt-8">
                <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-3 text-white/50 hover:text-white transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-white font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="px-3 py-3 text-white/50 hover:text-white transition-colors text-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal/85 disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-all text-sm"
                >
                  <ShoppingCart size={16} />
                  {currentStock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                </button>
              </div>

              {/* Stock indicator */}
              {currentStock > 0 && currentStock <= 5 && (
                <p className="text-brand-orange text-xs font-semibold mt-3">
                  ⚠ Plus que {currentStock} en stock
                </p>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/[0.08]">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Truck size={18} className="text-brand-teal" />
                  <span className="text-white/50 text-[10px] font-semibold">Livraison Dakar</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Shield size={18} className="text-brand-teal" />
                  <span className="text-white/50 text-[10px] font-semibold">{product.warranty ?? 'Garanti'}</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Package size={18} className="text-brand-teal" />
                  <span className="text-white/50 text-[10px] font-semibold">Emballage soigné</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Description + Specs */}
          <div className="grid lg:grid-cols-2 gap-10 mt-16">
            {product.description && (
              <div>
                <h2 className="text-white font-bold text-lg mb-4">Description</h2>
                <div className="text-[#A0A0A0] text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            )}

            {specs.length > 0 && (
              <div>
                <h2 className="text-white font-bold text-lg mb-4">Caractéristiques</h2>
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden">
                  {specs.map(([key, value], i) => (
                    <div
                      key={key}
                      className={`flex items-center justify-between px-4 py-3 text-sm ${
                        i < specs.length - 1 ? 'border-b border-white/[0.06]' : ''
                      }`}
                    >
                      <span className="text-white/50">{key}</span>
                      <span className="text-white font-semibold">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-16">
              <h2 className="text-white font-bold text-lg mb-6">
                Avis clients ({product.reviews.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {product.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-semibold text-sm">{review.author_name}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i <= review.rating ? 'text-brand-orange fill-brand-orange' : 'text-white/15'}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-white/50 text-sm leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
