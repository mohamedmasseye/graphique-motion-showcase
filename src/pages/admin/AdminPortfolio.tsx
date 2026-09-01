import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, FolderKanban, X, Save, Loader2,
  Image as ImageIcon, Copy, Eye, Search, Star, ExternalLink,
  FileText, Tag, Code, Settings, Layout
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';
import {
  PROJECT_TYPE_LABELS,
  PORTFOLIO_DEFAULTS,
} from '@/types/database';
import type { PortfolioProject, ProjectType } from '@/types/database';

/* ═══ Options ═══════════════════════════════════════════════════ */
const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: 'digital_product', label: 'Digital Product' },
  { value: 'website', label: 'Website' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'web_application', label: 'Web Application' },
  { value: 'mobile_pwa', label: 'Mobile / PWA' },
  { value: 'branding', label: 'Branding' },
  { value: 'graphic_design', label: 'Graphic Design' },
  { value: 'event', label: 'Event' },
  { value: 'other', label: 'Other' },
];

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'web', label: 'Site Web' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'branding', label: 'Branding' },
  { value: 'logo', label: 'Logo' },
  { value: 'design', label: 'Design' },
  { value: 'print', label: 'Print' },
  { value: 'video', label: 'Vidéo' },
  { value: 'app', label: 'Application' },
  { value: 'pwa', label: 'PWA' },
  { value: 'event', label: 'Événementiel' },
];

/** Calculate content completeness percentage for a project */
function getCompleteness(p: Partial<PortfolioProject>): number {
  const required = [p.title, p.slug, p.description, p.image, p.category, p.project_type];
  const important = [p.tags?.length, p.seo_title, p.seo_description];
  const bonus = [p.short_description, p.client_name, p.year, p.technologies?.length];
  const csFields = p.case_study ? [p.challenge, p.strategy, p.solution] : [];
  const all = [...required, ...important, ...bonus, ...csFields];
  const filled = all.filter((v) => v && v !== '' && v !== 0).length;
  return Math.round((filled / all.length) * 100);
}

/** Get featured order conflicts */
function getFeaturedConflicts(projects: PortfolioProject[]): Map<string, number> {
  const counts = new Map<string, number>();
  projects.filter((p) => p.featured && p.featured_order).forEach((p) => {
    const key = String(p.featured_order);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return counts;
}

type Tab = 'general' | 'media' | 'classification' | 'content' | 'seo' | 'publishing';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'Général', icon: FileText },
  { id: 'media', label: 'Média', icon: ImageIcon },
  { id: 'classification', label: 'Classification', icon: Tag },
  { id: 'content', label: 'Contenu', icon: Layout },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'publishing', label: 'Publication', icon: Settings },
];

function newProject(): Partial<PortfolioProject> {
  return {
    title: '', slug: '', category: 'web', image: '', link: '',
    description: '', tags: [], sort_order: 0,
    ...PORTFOLIO_DEFAULTS,
  };
}

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<PortfolioProject> | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const load = useCallback(async () => {
    const { data } = await supabase.from('portfolio').select('*').order('sort_order');
    setProjects((data ?? []) as PortfolioProject[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = projects.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat !== 'all' && p.category !== filterCat) return false;
    return true;
  });

  const featuredConflicts = getFeaturedConflicts(projects);

  const handleSave = async () => {
    if (!editing?.title || !editing?.image) return;
    setSaving(true);
    const slug = editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      title: editing.title, slug, category: editing.category ?? 'web',
      image: editing.image, link: editing.link || null,
      description: editing.description || null,
      short_description: editing.short_description || null,
      long_description: editing.long_description || null,
      client_name: editing.client_name || null,
      industry: editing.industry || null, year: editing.year || null,
      tags: editing.tags ?? [], technologies: editing.technologies ?? [],
      images: editing.images ?? [],
      project_type: editing.project_type ?? 'website',
      featured: editing.featured ?? false,
      featured_order: editing.featured_order ?? null,
      case_study: editing.case_study ?? false,
      challenge: editing.challenge || null,
      strategy: editing.strategy || null,
      solution: editing.solution || null,
      development: editing.development || null,
      outcome: editing.outcome || null,
      seo_title: editing.seo_title || null,
      seo_description: editing.seo_description || null,
      og_image: editing.og_image || null,
      published: editing.published ?? true,
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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer "${title}" ? Cette action est irréversible.`)) return;
    await supabase.from('portfolio').delete().eq('id', id);
    load();
  };

  const handleDuplicate = async (p: PortfolioProject) => {
    const { id, created_at, updated_at, ...rest } = p;
    rest.title = `${p.title} (copie)`;
    rest.slug = `${p.slug}-copy`;
    rest.featured = false;
    rest.featured_order = null;
    rest.published = false;
    await supabase.from('portfolio').insert(rest);
    load();
  };

  const updateField = (field: string, value: any) => {
    setEditing((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const inputClass = "w-full px-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition-all";
  const labelClass = "block text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-2xl">Portfolio</h1>
          <p className="text-white/40 text-sm mt-1">{projects.length} projet{projects.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditing(newProject()); setActiveTab('general'); }}
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal/85 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un projet..."
            className="w-full pl-9 pr-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="bg-white/[0.05] border border-white/10 rounded-xl text-white text-xs px-3 py-2">
          <option value="all">Toutes catégories</option>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Grid — layout identique au screenshot existant */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-white/[0.06]" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-white/[0.08] rounded-full w-3/4" />
                <div className="h-2 bg-white/[0.06] rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-10 text-center">
          <FolderKanban size={32} className="text-white/10 mx-auto mb-2" />
          <p className="text-white/30 text-sm">
            {projects.length === 0 ? 'Aucun projet' : 'Aucun projet ne correspond à votre recherche'}
          </p>
          {projects.length === 0 && (
            <button onClick={() => { setEditing(newProject()); setActiveTab('general'); }}
              className="text-brand-teal text-sm mt-2 hover:underline">Ajouter un projet</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <motion.div key={p.id} layout
              className="group bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.15] transition-colors">
              {/* Image */}
              <div className="aspect-video bg-white/[0.06] overflow-hidden relative">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={24} className="text-white/10" /></div>
                )}
                {/* Status badges */}
                <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                  {p.featured && (
                    <span className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white ${
                      p.featured_order && (featuredConflicts.get(String(p.featured_order)) ?? 0) > 1
                        ? 'bg-red-500/90' : 'bg-brand-orange/90'
                    }`}>
                      <Star size={8} /> Featured{p.featured_order ? ` #${p.featured_order}` : ''}
                    </span>
                  )}
                  {p.case_study && (
                    <span className="text-[9px] font-bold bg-brand-teal/90 text-white px-1.5 py-0.5 rounded-md">Case Study</span>
                  )}
                  {!p.published && (
                    <span className="text-[9px] font-bold bg-yellow-500/90 text-white px-1.5 py-0.5 rounded-md">Brouillon</span>
                  )}
                </div>
                {/* Action buttons on hover */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing({ ...p }); setActiveTab('general'); }}
                    className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-brand-teal"
                    title="Modifier"><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(p.id, p.title)}
                    className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-red-400"
                    title="Supprimer"><Trash2 size={12} /></button>
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-bold truncate">{p.title}</p>
                  <span className="flex items-center gap-1 shrink-0">
                    {p.featured && <Star size={10} className="text-brand-orange" />}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      getCompleteness(p) >= 80 ? 'bg-green-500/20 text-green-400' :
                      getCompleteness(p) >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-white/10 text-white/40'
                    }`}>{getCompleteness(p)}%</span>
                  </span>
                </div>
                <p className="text-white/30 text-xs capitalize">
                  {CATEGORIES.find((c) => c.value === p.category)?.label ?? p.category}
                  {p.client_name && ` · ${p.client_name}`}
                </p>
                {/* Quick actions row */}
                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer"
                      className="text-white/30 hover:text-brand-teal" title="Voir"><ExternalLink size={11} /></a>
                  )}
                  <button onClick={() => handleDuplicate(p)}
                    className="text-white/30 hover:text-brand-orange" title="Dupliquer"><Copy size={11} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ═══ Edit Drawer — adapté avec tabs ═══════════════════ */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)} />
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-[#0C0C12] border-l border-white/10 z-50 flex flex-col"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-white font-bold">{editing.id ? 'Modifier' : 'Nouveau'} projet</h2>
                  {editing.slug && <p className="text-white/30 text-xs mt-0.5">/{editing.slug}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {editing.id && editing.slug && (
                    <a href={`/portfolio/${editing.slug}`} target="_blank" rel="noopener noreferrer"
                      className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/[0.06]"><Eye size={16} /></a>
                  )}
                  <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/[0.06]"><X size={18} /></button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 px-4 py-2 border-b border-white/[0.06] overflow-x-auto scrollbar-hide">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        activeTab === tab.id ? 'bg-brand-teal/15 text-brand-teal' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                      }`}>
                      <Icon size={13} /> {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* GENERAL */}
                {activeTab === 'general' && (
                  <>
                    <div>
                      <label className={labelClass}>Titre *</label>
                      <input value={editing.title ?? ''} onChange={(e) => {
                        updateField('title', e.target.value);
                        if (!editing.id) updateField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }} className={inputClass} placeholder="Nom du projet" />
                    </div>
                    <div>
                      <label className={labelClass}>Slug *</label>
                      <input value={editing.slug ?? ''} onChange={(e) => updateField('slug', e.target.value)}
                        className={inputClass} placeholder="mon-projet" />
                      <p className="text-white/20 text-[10px] mt-1">URL: /portfolio/{editing.slug || '...'}</p>
                    </div>
                    <div>
                      <label className={labelClass}>Description courte</label>
                      <input value={editing.short_description ?? ''} onChange={(e) => updateField('short_description', e.target.value)}
                        className={inputClass} placeholder="Une ligne résumant le projet" />
                    </div>
                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea value={editing.description ?? ''} onChange={(e) => updateField('description', e.target.value)}
                        rows={3} className={`${inputClass} resize-none`} placeholder="Présentation du projet" />
                    </div>
                    <div>
                      <label className={labelClass}>Description longue</label>
                      <textarea value={editing.long_description ?? ''} onChange={(e) => updateField('long_description', e.target.value)}
                        rows={6} className={`${inputClass} resize-none`} placeholder="Description détaillée du projet" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Client</label>
                        <input value={editing.client_name ?? ''} onChange={(e) => updateField('client_name', e.target.value)}
                          className={inputClass} placeholder="Nom du client" />
                      </div>
                      <div>
                        <label className={labelClass}>Industrie</label>
                        <input value={editing.industry ?? ''} onChange={(e) => updateField('industry', e.target.value)}
                          className={inputClass} placeholder="ex: Agriculture, Fitness" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Année</label>
                        <input type="number" value={editing.year ?? ''} onChange={(e) => updateField('year', e.target.value ? Number(e.target.value) : null)}
                          className={inputClass} placeholder="2024" />
                      </div>
                      <div>
                        <label className={labelClass}>Lien du projet</label>
                        <input value={editing.link ?? ''} onChange={(e) => updateField('link', e.target.value)}
                          className={inputClass} placeholder="https://..." />
                      </div>
                    </div>
                  </>
                )}

                {/* MEDIA */}
                {activeTab === 'media' && (
                  <>
                    <div>
                      <label className={labelClass}>Image principale *</label>
                      <ImageUploader images={editing.image ? [editing.image] : []}
                        onChange={(imgs) => updateField('image', imgs[imgs.length - 1] ?? '')}
                        folder="portfolio" max={1} />
                    </div>
                    <div>
                      <label className={labelClass}>Images galerie</label>
                      <p className="text-white/20 text-[10px] mb-2">Images supplémentaires pour la galerie du projet</p>
                      <ImageUploader images={editing.images ?? []}
                        onChange={(imgs) => updateField('images', imgs)}
                        folder="portfolio-gallery" max={20} />
                    </div>
                    <div>
                      <label className={labelClass}>Image OG (partage social)</label>
                      <p className="text-white/20 text-[10px] mb-2">Utilise l'image principale si vide</p>
                      <ImageUploader images={editing.og_image ? [editing.og_image] : []}
                        onChange={(imgs) => updateField('og_image', imgs[imgs.length - 1] ?? '')}
                        folder="portfolio-og" max={1} />
                    </div>
                  </>
                )}

                {/* CLASSIFICATION */}
                {activeTab === 'classification' && (
                  <>
                    <div>
                      <label className={labelClass}>Type de projet</label>
                      <select value={editing.project_type ?? 'website'} onChange={(e) => updateField('project_type', e.target.value)}
                        className={inputClass}>
                        {PROJECT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Catégorie</label>
                      <select value={editing.category ?? 'web'} onChange={(e) => updateField('category', e.target.value)}
                        className={inputClass}>
                        {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Tags</label>
                      <input value={(editing.tags ?? []).join(', ')}
                        onChange={(e) => updateField('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                        className={inputClass} placeholder="SaaS, UI/UX, Restaurant, Telecom" />
                      <p className="text-white/20 text-[10px] mt-1">Séparés par des virgules</p>
                    </div>
                    <div>
                      <label className={labelClass}>Technologies</label>
                      <input value={(editing.technologies ?? []).join(', ')}
                        onChange={(e) => updateField('technologies', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                        className={inputClass} placeholder="React, TypeScript, Supabase, Tailwind" />
                      <p className="text-white/20 text-[10px] mt-1">Séparées par des virgules</p>
                      {(editing.technologies ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {editing.technologies!.map((t) => (
                            <span key={t} className="text-[10px] bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* CONTENT — Case Study */}
                {activeTab === 'content' && (
                  <>
                    <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                      <div>
                        <p className="text-white text-sm font-semibold">Activer le Case Study</p>
                        <p className="text-white/30 text-xs">Affiche les sections détaillées sur la page projet</p>
                      </div>
                      <button onClick={() => updateField('case_study', !editing.case_study)}
                        className={`w-11 h-6 rounded-full transition-colors ${editing.case_study ? 'bg-brand-teal' : 'bg-white/10'}`}>
                        <div className="w-5 h-5 rounded-full bg-white transition-transform"
                          style={{ transform: editing.case_study ? 'translateX(22px)' : 'translateX(2px)' }} />
                      </button>
                    </div>
                    {editing.case_study && (
                      <div className="space-y-5 mt-4">
                        <div>
                          <label className={labelClass}>Défi / Challenge</label>
                          <textarea value={editing.challenge ?? ''} onChange={(e) => updateField('challenge', e.target.value)}
                            rows={4} className={`${inputClass} resize-none`} placeholder="Quel était le défi ?" />
                        </div>
                        <div>
                          <label className={labelClass}>Stratégie</label>
                          <textarea value={editing.strategy ?? ''} onChange={(e) => updateField('strategy', e.target.value)}
                            rows={4} className={`${inputClass} resize-none`} placeholder="Quelle a été notre approche ?" />
                        </div>
                        <div>
                          <label className={labelClass}>Solution</label>
                          <textarea value={editing.solution ?? ''} onChange={(e) => updateField('solution', e.target.value)}
                            rows={4} className={`${inputClass} resize-none`} placeholder="Qu'avons-nous livré ?" />
                        </div>
                        <div>
                          <label className={labelClass}>Développement</label>
                          <textarea value={editing.development ?? ''} onChange={(e) => updateField('development', e.target.value)}
                            rows={4} className={`${inputClass} resize-none`} placeholder="Détails techniques" />
                        </div>
                        <div>
                          <label className={labelClass}>Résultat / Outcome</label>
                          <textarea value={editing.outcome ?? ''} onChange={(e) => updateField('outcome', e.target.value)}
                            rows={4} className={`${inputClass} resize-none`} placeholder="Résultats du projet" />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* SEO */}
                {activeTab === 'seo' && (
                  <>
                    <div>
                      <label className={labelClass}>Titre SEO</label>
                      <input value={editing.seo_title ?? ''} onChange={(e) => updateField('seo_title', e.target.value)}
                        className={inputClass} placeholder={`${editing.title || 'Titre'} — Graphique & Motion`} />
                      <p className="text-white/20 text-[10px] mt-1">{(editing.seo_title || '').length}/60 caractères recommandés</p>
                    </div>
                    <div>
                      <label className={labelClass}>Description SEO</label>
                      <textarea value={editing.seo_description ?? ''} onChange={(e) => updateField('seo_description', e.target.value)}
                        rows={3} className={`${inputClass} resize-none`} placeholder="Description pour les moteurs de recherche" />
                      <p className="text-white/20 text-[10px] mt-1">{(editing.seo_description || '').length}/160 caractères recommandés</p>
                    </div>
                    {/* Google preview */}
                    <div className="bg-white rounded-xl p-4 mt-4">
                      <p className="text-blue-700 text-sm font-medium truncate">{editing.seo_title || editing.title || 'Titre du projet'}</p>
                      <p className="text-green-700 text-xs mt-0.5">graphiquemotion.com/portfolio/{editing.slug || '...'}</p>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">{editing.seo_description || editing.short_description || editing.description || 'Aucune description définie'}</p>
                    </div>
                  </>
                )}

                {/* PUBLISHING */}
                {activeTab === 'publishing' && (
                  <>
                    <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                      <div>
                        <p className="text-white text-sm font-semibold">Publié</p>
                        <p className="text-white/30 text-xs">Visible sur le site public</p>
                      </div>
                      <button onClick={() => updateField('published', !editing.published)}
                        className={`w-11 h-6 rounded-full transition-colors ${editing.published ? 'bg-brand-teal' : 'bg-white/10'}`}>
                        <div className="w-5 h-5 rounded-full bg-white transition-transform"
                          style={{ transform: editing.published ? 'translateX(22px)' : 'translateX(2px)' }} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                      <div>
                        <p className="text-white text-sm font-semibold">En avant (Featured)</p>
                        <p className="text-white/30 text-xs">Affiché sur la page d'accueil</p>
                      </div>
                      <button onClick={() => updateField('featured', !editing.featured)}
                        className={`w-11 h-6 rounded-full transition-colors ${editing.featured ? 'bg-brand-orange' : 'bg-white/10'}`}>
                        <div className="w-5 h-5 rounded-full bg-white transition-transform"
                          style={{ transform: editing.featured ? 'translateX(22px)' : 'translateX(2px)' }} />
                      </button>
                    </div>
                    {editing.featured && (
                      <div>
                        <label className={labelClass}>Ordre Featured (1-6)</label>
                        <input type="number" min={1} max={6} value={editing.featured_order ?? ''}
                          onChange={(e) => updateField('featured_order', e.target.value ? Number(e.target.value) : null)}
                          className={inputClass} placeholder="Position sur l'accueil" />
                        {/* Show existing featured orders */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {projects.filter((p) => p.featured && p.featured_order && p.id !== editing.id).map((p) => (
                            <span key={p.id} className={`text-[9px] px-1.5 py-0.5 rounded ${
                              editing.featured_order === p.featured_order ? 'bg-red-500/20 text-red-400 font-bold' : 'bg-white/10 text-white/40'
                            }`}>
                              #{p.featured_order} {p.title.length > 15 ? p.title.slice(0, 15) + '...' : p.title}
                            </span>
                          ))}
                        </div>
                        {editing.featured_order && (featuredConflicts.get(String(editing.featured_order)) ?? 0) > 0 && (
                          <p className="text-red-400 text-[10px] mt-1 font-semibold">
                            ⚠️ Cette position est déjà utilisée par un autre projet featured
                          </p>
                        )}
                      </div>
                    )}
                    <div>
                      <label className={labelClass}>Ordre de tri</label>
                      <input type="number" value={editing.sort_order ?? 0}
                        onChange={(e) => updateField('sort_order', Number(e.target.value))}
                        className={inputClass} />
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-white/[0.06] flex gap-3">
                <button onClick={() => setEditing(null)}
                  className="flex-1 text-center py-3 rounded-xl border border-white/10 text-white/50 text-sm font-semibold hover:bg-white/[0.04] transition-colors">
                  Annuler
                </button>
                <button onClick={handleSave} disabled={saving || !editing.title || !editing.image}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal/85 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all">
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
