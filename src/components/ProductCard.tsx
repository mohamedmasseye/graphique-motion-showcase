import { motion } from 'framer-motion';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/formatPrice';
import type { Product } from '@/types/database';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const image = product.images?.[0];
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0;

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-brand-teal/30 transition-all duration-300"
    >
      {/* Image */}
      <Link to={`/boutique/${product.slug}`} className="block relative aspect-square overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-white/[0.06] flex items-center justify-center">
            <ShoppingCart size={32} className="text-white/10" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-brand-orange text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              -{discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="bg-brand-teal text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              Populaire
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="bg-red-500/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              Plus que {product.stock}
            </span>
          )}
        </div>

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/boutique/${product.slug}`}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <Eye size={16} />
          </Link>
          {!product.has_variants && product.stock > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              className="w-10 h-10 rounded-full bg-brand-teal/80 backdrop-blur-sm border border-brand-teal flex items-center justify-center text-white hover:bg-brand-teal transition-colors"
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        {product.brand && (
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-1">{product.brand}</p>
        )}
        <Link to={`/boutique/${product.slug}`}>
          <h3 className="text-white text-sm font-bold leading-snug hover:text-brand-teal transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.short_description && (
          <p className="text-white/40 text-xs mt-1 line-clamp-1">{product.short_description}</p>
        )}

        {/* Rating */}
        {avgRating && (
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={11}
                className={i <= Math.round(avgRating) ? 'text-brand-orange fill-brand-orange' : 'text-white/15'}
              />
            ))}
            <span className="text-white/30 text-[10px] ml-1">({product.reviews!.length})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-brand-teal font-bold text-base">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-white/30 text-xs line-through">{formatPrice(product.compare_price!)}</span>
          )}
        </div>

        {/* Stock status */}
        {product.stock === 0 && (
          <p className="text-red-400 text-[10px] font-semibold mt-2">Rupture de stock</p>
        )}
        {product.has_variants && product.stock > 0 && (
          <p className="text-white/30 text-[10px] mt-2">{product.variants?.length ?? 0} variantes disponibles</p>
        )}
      </div>
    </motion.div>
  );
}
