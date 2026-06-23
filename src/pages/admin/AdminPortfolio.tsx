import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, FolderKanban, X, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';
import type { PortfolioProject } from '@/types/database';

const categoryOptions = [
  { value: 'web', label: 'Site Web' },
  { value: 'pwa', label: 'Application PWA' },
  { value: 'app', label: 'App Mobile' },
  { value: 'logo', label: 'Logo' },
  { value: 'print', label: 'Print' },
  { value: 'event', label: 'Événementiel' },
];

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<PortfolioProject> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('portfolio').select('*').order('sort_order');
    setProjects((data ?? []) as PortfolioProject[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing({ title: '', slug: '', category: 'web', image: '', link: '', description: '', tags: [], sort_order: 0 });
  };

  const handleSave = async () => {
    if (!editing?.title || !editing?.image) return;
    setSaving(true);

    const slug = editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      title: editing.title,
      slug,
      category: editing.category ?? 'web',
      image: editing.image,
      link: editing.link || null,
      description: editing.description || null,
      tags: editing.tags ?? [],
      sort_order: editing.sort_order ?? 0,
    };

    if (editing.id) {
      await supabase.from('portfolio').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('portfolio').insert(payload);
    }

    setSaving(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return;
    await supabase.from('portfolio').delete().eq('id', id);
    load();
  };

  const updateField = (field: string, value: any) => {
    setEditing((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const inputClass = "w-full px-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition-all";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-2xl">Portfolio</h1>
          <p className="text-white/40 text-sm mt-1">{projects.length} projet{projects.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal/85 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-center">
          <div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-10 text-center">
          <FolderKanban size={32} className="text-white/10 mx-auto mb-2" />
          <p className="text-white/30 text-sm">Aucun projet</p>
          <button onClick={openNew} className="text-brand-teal text-sm mt-2 hover:underline">Ajouter un projet</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {projects.map((p) => (
            <motion.div
              key={p.id}
              layout
              className="group bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden"
            >
              <div className="aspect-video bg-white/[0.06] overflow-hidden relative">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={24} className="text-white/10" /></div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditing({ ...p })} className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-brand-teal">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-red-400">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-white text-sm font-bold truncate">{p.title}</p>
                <p className="text-white/30 text-xs capitalize">{categoryOptions.find((c) => c.value === p.category)?.label ?? p.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit drawer */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)} />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0C0C12] border-l border-white/10 z-50 flex flex-col"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                <h2 className="text-white font-bold">{editing.id ? 'Modifier' : 'Nouveau'} projet</h2>
                <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Titre *</label>
                  <input value={editing.title ?? ''} onChange={(e) => updateField('title', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Catégorie</label>
                  <select value={editing.category ?? 'web'} onChange={(e) => updateField('category', e.target.value)} className={inputClass}>
                    {categoryOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <ImageUploader
                  images={editing.image ? [editing.image] : []}
                  onChange={(imgs) => updateField('image', imgs[imgs.length - 1] ?? '')}
                  folder="portfolio"
                  max={1}
                />
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Lien (optionnel)</label>
                  <input value={editing.link ?? ''} onChange={(e) => updateField('link', e.target.value)} className={inputClass} placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Description</label>
                  <textarea value={editing.description ?? ''} onChange={(e) => updateField('description', e.target.value)} rows={3} className={`${inputClass} resize-none`} />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">Tags (séparés par virgule)</label>
                  <input
                    value={(editing.tags ?? []).join(', ')}
                    onChange={(e) => updateField('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                    className={inputClass} placeholder="React, Tailwind, E-commerce"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-white/[0.06]">
                <button onClick={handleSave} disabled={saving || !editing.title || !editing.image}
                  className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal/85 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all">
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement…</> : <><Save size={16} /> {editing.id ? 'Enregistrer' : 'Créer'}</>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
