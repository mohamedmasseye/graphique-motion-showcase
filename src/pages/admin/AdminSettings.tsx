import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Settings, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types/database';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('*').single().then(({ data }) => {
      if (data) setSettings(data as SiteSettings);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { id, updated_at, ...payload } = settings;
    await supabase.from('site_settings').update(payload).eq('id', id!);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateField = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const inputClass = "w-full px-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition-all";

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-white font-black text-2xl">Paramètres</h1>
        <p className="text-white/40 text-sm mt-1">Coordonnées et réseaux sociaux du site</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 space-y-5"
      >
        <div>
          <label className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Phone size={12} /> Téléphone
          </label>
          <input value={settings.phone ?? ''} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} placeholder="+221775644478" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Mail size={12} /> Email
          </label>
          <input value={settings.email ?? ''} onChange={(e) => updateField('email', e.target.value)} className={inputClass} placeholder="support@graphiquemotion.com" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <MapPin size={12} /> Adresse
          </label>
          <input value={settings.address ?? ''} onChange={(e) => updateField('address', e.target.value)} className={inputClass} placeholder="Dakar, Sénégal" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5">
            <MessageSquare size={12} /> Lien WhatsApp
          </label>
          <input value={settings.whatsapp ?? ''} onChange={(e) => updateField('whatsapp', e.target.value)} className={inputClass} placeholder="https://wa.me/221775644478" />
        </div>

        <div>
          <label className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5 block">Instagram</label>
          <input value={settings.instagram ?? ''} onChange={(e) => updateField('instagram', e.target.value)} className={inputClass} placeholder="https://www.instagram.com/graphiquemotion" />
        </div>

        <div>
          <label className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1.5 block">Facebook</label>
          <input value={settings.facebook ?? ''} onChange={(e) => updateField('facebook', e.target.value)} className={inputClass} placeholder="https://www.facebook.com/..." />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal/85 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all"
        >
          {saving ? (
            <><Loader2 size={16} className="animate-spin" /> Enregistrement…</>
          ) : saved ? (
            <><Settings size={16} /> Enregistré ✓</>
          ) : (
            <><Save size={16} /> Enregistrer</>
          )}
        </button>
      </motion.div>
    </div>
  );
}
