import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Package, Search, X, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/formatPrice';
import type { Product, Category, ProductStatus } from '@/types/database';

const statusLabels: Record<ProductStatus, { label: string; color: string }> = {
  active:   { label: 'Actif',    color: '#28C840' },
  draft:    { label: 'Brouillon', color: '#F5821F' },
  archived: { label: 'Archivé',  color: '#FF5F57' },
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setProducts((prodRes.data ?? []) as Product[]);
    setCategories((catRes.data ?? []) as Category[]);
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditing({
      name: '', slug: '', description: '', short_description: '', price: 0, compare_price: null,
      category_id: categories[0]?.id ?? null, images: [], stock: 0, status: 'draft',
      featured: false, has_variants: false, tags: [], brand: '', sku: '', weight: null,
      warranty: '', specifications: {}, meta_title: '', meta_description: '',
    });
  };

  const openEdit = (p: Product) => {
    setEditing({ ...p });
  };

  const handleSave = async () => {
    if (!editing?.name) return;
    setSaving(true);

    const slug = editing.slug || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      name: editing.name,
      slug,
      description: editing.description || null,
      short_description: editing.short_description || null,
      price: editing.price ?? 0,
      compare_price: editing.compare_price || null,
      category_id: editing.category_id || null,
      images: editing.images ?? [],
      stock: editing.stock ?? 0,
      status: editing.status ?? 'draft',
      featured: editing.featured ?? false,
      has_variants: editing.has_variants ?? false,
      tags: editing.tags ?? [],
      brand: editing.brand || null,
      sku: editing.sku || null,
      weight: editing.weight || null,
      warranty: editing.warranty || null,
      specifications: editing.specifications ?? {},
      meta_title: editing.meta_title || null,
      meta_description: editing.meta_description || null,
    };

    if (editing.id) {
      await supabase.from('products').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('products').insert(payload);
    }

    setSaving(false);
    setEditing(null);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadProducts();
  };

  const updateField = (field: string, value: any) => {
    setEditing((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const inputClass = "w-full px-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-2xl">Produits</h1>
          <p className="text-white/40 text-sm mt-1">{products.length} produit{products.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal/85 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition-all"
        />
      </div>

      {/* Products table */}
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Package size={32} className="text-white/10 mx-auto mb-2" />
            <p className="text-white/30 text-sm">Aucun produit</p>
            <button onClick={openNew} className="text-brand-teal text-sm mt-2 hover:underline">Ajouter un produit</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Produit</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Prix</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Stock</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Catégorie</th>
                  <th className="text-left text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Statut</th>
                  <th className="text-right text-white/30 text-xs font-semibold uppercase tracking-widest px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const st = statusLabels[product.status];
                  return (
                    <tr key={product.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/[0.06] overflow-hidden shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><ImageIcon size={14} className="text-white/15" /></div>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{product.name}</p>
                            {product.brand && <p className="text-white/30 text-xs">{product.brand}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-white font-semibold">{formatPrice(product.price)}</td>
                      <td className="px-5 py-3">
                        <span className={product.stock === 0 ? 'text-red-400 font-bold' : product.stock <= 5 ? 'text-brand-orange font-bold' : 'text-white/60'}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-white/50 text-xs">{(product.category as any)?.name ?? '—'}</td>
                      <td className="px-5 py-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: st.color + '15', color: st.color }}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => openEdit(product)} className="text-white/30 hover:text-brand-teal transition-colors p-1.5"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(product.id)} className="text-white/30 hover:text-red-400 transition-colors p-1.5 ml-1"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Create modal */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)} />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0C0C12] border-l border-white/10 z-50 flex flex-col"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <h2 className="text-white font-bold">{editing.id ? 'Modifier' : 'Nouveau'} produit</h2>
                <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Nom *</label>
                  <input value={editing.name ?? ''} onChange={(e) => updateField('name', e.target.value)} className={inputClass} placeholder="Canon EOS R50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Prix (FCFA) *</label>
                    <input type="number" value={editing.price ?? 0} onChange={(e) => updateField('price', Number(e.target.value))} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Ancien prix</label>
                    <input type="number" value={editing.compare_price ?? ''} onChange={(e) => updateField('compare_price', e.target.value ? Number(e.target.value) : null)} className={inputClass} placeholder="Prix barré" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Stock *</label>
                    <input type="number" value={editing.stock ?? 0} onChange={(e) => updateField('stock', Number(e.target.value))} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">SKU</label>
                    <input value={editing.sku ?? ''} onChange={(e) => updateField('sku', e.target.value)} className={inputClass} placeholder="CAM-001" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Marque</label>
                    <input value={editing.brand ?? ''} onChange={(e) => updateField('brand', e.target.value)} className={inputClass} placeholder="Canon" />
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Garantie</label>
                    <input value={editing.warranty ?? ''} onChange={(e) => updateField('warranty', e.target.value)} className={inputClass} placeholder="1 an" />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Catégorie</label>
                  <select value={editing.category_id ?? ''} onChange={(e) => updateField('category_id', e.target.value || null)} className={inputClass}>
                    <option value="">Aucune</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Description courte</label>
                  <input value={editing.short_description ?? ''} onChange={(e) => updateField('short_description', e.target.value)} className={inputClass} placeholder="Résumé en 1 ligne" />
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Description complète</label>
                  <textarea value={editing.description ?? ''} onChange={(e) => updateField('description', e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Description détaillée du produit..." />
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Images (URLs Cloudinary, une par ligne)</label>
                  <textarea
                    value={(editing.images ?? []).join('\n')}
                    onChange={(e) => updateField('images', e.target.value.split('\n').filter(Boolean))}
                    rows={3}
                    className={`${inputClass} resize-none font-mono text-xs`}
                    placeholder="https://res.cloudinary.com/..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Statut</label>
                    <select value={editing.status ?? 'draft'} onChange={(e) => updateField('status', e.target.value)} className={inputClass}>
                      <option value="draft">Brouillon</option>
                      <option value="active">Actif (visible)</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-4 pb-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editing.featured ?? false} onChange={(e) => updateField('featured', e.target.checked)} className="accent-brand-teal" />
                      <span className="text-white/60 text-sm">Populaire</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/[0.06]">
                <button
                  onClick={handleSave}
                  disabled={saving || !editing.name}
                  className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal/85 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all"
                >
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement…</> : <><Save size={16} /> {editing.id ? 'Enregistrer' : 'Créer le produit'}</>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
