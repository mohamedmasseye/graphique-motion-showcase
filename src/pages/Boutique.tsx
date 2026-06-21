import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ShoppingBag, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name';

export default function Boutique() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');

  const { data: products = [], isLoading } = useProducts(selectedCategory, search);
  const { data: categories = [] } = useCategories();
  const cartItemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.open);

  const sorted = [...products].sort((a, b) => {
    switch (sort) {
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar />
      <CartDrawer />

      <main className="min-h-screen bg-black pt-24 pb-16">
        {/* Hero Banner */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,178,170,0.08)_0%,transparent_60%)]" />
          <div className="container mx-auto px-4 py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-3">Boutique</p>
              <h1 className="font-syne text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
                Équipement <span className="text-brand-orange">pro</span> pour créateurs.
              </h1>
              <p className="mt-4 text-[#A0A0A0] text-lg max-w-xl">
                Caméras, micros, éclairages, trépieds — tout ce qu'il faut pour vos vidéos, lives TikTok et productions.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          {/* Filters Bar */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8 sticky top-20 z-30 bg-black/80 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-white/[0.06]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal/40 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Category filters */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    !selectedCategory
                      ? 'bg-brand-teal text-white'
                      : 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/70'
                  }`}
                >
                  Tous
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug === selectedCategory ? undefined : cat.slug)}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      selectedCategory === cat.slug
                        ? 'bg-brand-teal text-white'
                        : 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1] hover:text-white/70'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none bg-white/[0.06] border border-white/10 rounded-xl text-white text-xs font-semibold pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 cursor-pointer"
                >
                  <option value="newest">Plus récents</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="name">Nom A-Z</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              </div>

              {/* Cart button */}
              <button
                onClick={openCart}
                className="relative p-2.5 bg-white/[0.06] border border-white/10 rounded-xl hover:bg-white/[0.1] transition-colors"
              >
                <ShoppingBag size={18} className="text-white/60" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-teal rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </motion.div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-white/[0.06]" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-white/[0.08] rounded-full w-1/3" />
                    <div className="h-4 bg-white/[0.08] rounded-full w-3/4" />
                    <div className="h-4 bg-white/[0.08] rounded-full w-1/2 mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <SlidersHorizontal size={48} className="text-white/10 mx-auto mb-4" />
              <p className="text-white/40 text-lg font-semibold">Aucun produit trouvé</p>
              <p className="text-white/25 text-sm mt-1">Essayez de modifier vos filtres</p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className="mt-4 text-brand-teal text-sm hover:underline"
                >
                  Voir tous les produits
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <p className="text-white/30 text-sm mb-4">{sorted.length} produit{sorted.length > 1 ? 's' : ''}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sorted.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
