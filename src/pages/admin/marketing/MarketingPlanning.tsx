import { useCallback, useEffect, useMemo, useState } from 'react';
import { Copy, Check, RefreshCw, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { PLAN } from '@/data/marketingPlan';
import type { MarketingPost, MarketingKind, MarketingStatus } from '@/types/marketing';
import MarketingTabs from './MarketingTabs';

const NETWORKS: Record<string, { label: string; color: string }> = {
  instagram: { label: 'Instagram', color: '#E0609C' },
  linkedin: { label: 'LinkedIn', color: '#66A5E8' },
  x: { label: 'X', color: '#CDD6DD' },
  tiktok: { label: 'TikTok', color: '#2CC4BD' },
  facebook: { label: 'Facebook', color: '#7FA6E8' },
};
const KINDS: Record<MarketingKind, string> = {
  todo: 'À programmer', scheduled: 'Programmé (Adaptly)', draft: 'Brouillon TikTok', manual: 'À la main',
};
const STATUSES: Record<MarketingStatus, string> = { planned: 'À venir', done: 'Publié', skipped: 'Abandonné' };

const GATE_KEY = 'gm-aimee-ok';
const readGate = () => { try { return localStorage.getItem(GATE_KEY) !== '0'; } catch { return true; } };

const dayKey = (iso: string) => iso.slice(0, 10);
const dayLabel = (key: string) =>
  new Date(key + 'T12:00:00Z').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
const hhmm = (iso: string) => iso.slice(11, 16);

export default function MarketingPlanning() {
  const [rows, setRows] = useState<MarketingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [net, setNet] = useState('all');
  const [status, setStatus] = useState('all');
  const [open, setOpen] = useState<string | null>(null);
  const [aimee, setAimee] = useState(readGate());
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('marketing_posts').select('*').order('scheduled_at');
    if (error) toast.error('Chargement du plan impossible : ' + error.message);
    const list = (data as MarketingPost[]) ?? [];
    setRows(list);
    setLoading(false);
    return list;
  }, []);

  /** Crée les lignes absentes et met à jour les champs du plan, sans toucher à kind, status ni notes. */
  const syncPlan = useCallback(async (existing: MarketingPost[]) => {
    setSyncing(true);
    const known = new Set(existing.map((r) => r.code));
    const toInsert = PLAN.filter((p) => !known.has(p.code)).map((p) => ({
      code: p.code, network: p.network, title: p.title, format_label: p.format_label, scheduled_at: p.scheduled_at,
      kind: p.kind, asset: p.asset, is_price_post: p.is_price_post, text_content: p.text,
      first_comment: p.first_comment, gate: p.gate,
    }));
    let err: string | null = null;
    if (toInsert.length) {
      const { error } = await supabase.from('marketing_posts').insert(toInsert);
      if (error) err = error.message;
    }
    for (const p of PLAN.filter((p) => known.has(p.code))) {
      const { error } = await supabase.from('marketing_posts').update({
        network: p.network, title: p.title, format_label: p.format_label, scheduled_at: p.scheduled_at,
        asset: p.asset, is_price_post: p.is_price_post, text_content: p.text, first_comment: p.first_comment,
        gate: p.gate, updated_at: new Date().toISOString(),
      }).eq('code', p.code);
      if (error) err = error.message;
    }
    setSyncing(false);
    if (err) toast.error('Synchronisation : ' + err);
    else toast.success(toInsert.length ? `${toInsert.length} publication(s) ajoutée(s)` : 'Plan à jour');
    await load();
  }, [load]);

  useEffect(() => {
    load().then((data) => { if (data.length === 0) syncPlan(data); });
  }, [load, syncPlan]);

  const patch = async (id: string, fields: Partial<MarketingPost>) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...fields } : r)));
    const { error } = await supabase.from('marketing_posts').update({ ...fields, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { toast.error('Enregistrement impossible : ' + error.message); load(); }
  };

  const copy = async (key: string, text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 1500); }
    catch { toast.error('Copie impossible'); }
  };

  const now = Date.now();
  const stats = useMemo(() => {
    const planned = rows.filter((r) => r.status === 'planned');
    return {
      total: rows.length,
      upcoming: planned.filter((r) => new Date(r.scheduled_at).getTime() >= now).length,
      done: rows.filter((r) => r.status === 'done').length,
      manual: planned.filter((r) => r.kind === 'manual' || r.kind === 'draft').length,
      todo: planned.filter((r) => r.kind === 'todo').length,
      late: planned.filter((r) => r.kind !== 'scheduled' && new Date(r.scheduled_at).getTime() < now).length,
    };
  }, [rows, now]);

  const visible = rows.filter((r) => (net === 'all' || r.network === net) && (status === 'all' || r.status === status));
  const byDay = visible.reduce<Record<string, MarketingPost[]>>((acc, r) => { (acc[dayKey(r.scheduled_at)] ??= []).push(r); return acc; }, {});
  const next = rows.find((r) => r.status === 'planned' && (r.kind === 'manual' || r.kind === 'draft') && new Date(r.scheduled_at).getTime() >= now);

  const sel = 'bg-white/[0.05] border border-white/10 rounded-lg text-white text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-teal/40';
  const counters: [string, number, string?][] = [
    ['Au plan', stats.total], ['À venir', stats.upcoming], ['Publiées', stats.done],
    ['À la main', stats.manual], ['Pas programmées', stats.todo], ['En retard', stats.late, stats.late ? '#F5821F' : undefined],
  ];

  return (
    <div className="max-w-6xl">
      <MarketingTabs />
      {loading ? (
        <div className="p-10 text-center"><div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
            {counters.map(([l, n, c]) => (
              <div key={l} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3">
                <div className="text-2xl font-black" style={{ color: c ?? '#00B2AA' }}>{n}</div>
                <div className="text-white/40 text-xs">{l}</div>
              </div>
            ))}
          </div>

          {next && (
            <div className="mb-5 rounded-xl border border-brand-teal/40 bg-brand-teal/[0.06] px-4 py-3 text-sm text-white/80">
              <b className="text-white">Prochaine tâche à la main :</b> {dayLabel(dayKey(next.scheduled_at))} à {hhmm(next.scheduled_at)} ·{' '}
              {NETWORKS[next.network]?.label} · {next.format_label}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <select className={sel} value={net} onChange={(e) => setNet(e.target.value)}>
              <option value="all">Tous les réseaux</option>
              {Object.entries(NETWORKS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select className={sel} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Tous les statuts</option>
              {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
              <input type="checkbox" checked={aimee} onChange={(e) => { setAimee(e.target.checked); try { localStorage.setItem(GATE_KEY, e.target.checked ? '1' : '0'); } catch { /* ignore */ } }} />
              Accord de Coach Aimée obtenu
            </label>
            <button
              onClick={() => syncPlan(rows)} disabled={syncing}
              className="ml-auto flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-brand-teal/15 text-brand-teal hover:bg-brand-teal/25 disabled:opacity-50"
            >
              <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} /> Synchroniser le plan
            </button>
          </div>

          {Object.keys(byDay).length === 0 && <p className="text-white/40 text-sm py-8 text-center">Aucune publication pour ces filtres.</p>}

          {Object.entries(byDay).map(([day, list]) => (
            <section key={day} className="mb-6">
              <h2 className="text-white font-bold text-sm capitalize mb-2">{dayLabel(day)}</h2>
              <div className="space-y-2">
                {list.map((r) => {
                  const locked = r.gate === 'aimee' && !aimee;
                  const isOpen = open === r.id;
                  const nc = NETWORKS[r.network];
                  const late = r.status === 'planned' && r.kind !== 'scheduled' && new Date(r.scheduled_at).getTime() < now;
                  const blocks: [string, string, string][] = [['Texte', r.text_content, r.id], ['1er commentaire', r.first_comment, r.id + 'fc']];
                  return (
                    <div key={r.id} className={`bg-white/[0.04] border rounded-xl ${late ? 'border-[#F5821F]/50' : 'border-white/[0.08]'} ${r.status !== 'planned' ? 'opacity-60' : ''}`}>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
                        <span className="text-white font-bold text-sm w-12">{hhmm(r.scheduled_at)}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full border" style={{ color: nc?.color, borderColor: nc?.color }}>{nc?.label ?? r.network}</span>
                        <div className="min-w-0 flex-1 basis-56">
                          <div className="text-white text-sm font-semibold truncate">{r.title}</div>
                          <div className="text-white/40 text-xs truncate">{r.format_label} · {r.asset}</div>
                        </div>
                        {locked && <span className="flex items-center gap-1 text-xs text-[#F5821F]"><Lock size={12} /> Accord requis</span>}
                        {r.is_price_post && <span className="text-xs text-white/40">Prix</span>}
                        <select className={sel} value={r.kind} onChange={(e) => patch(r.id, { kind: e.target.value as MarketingKind })}>
                          {Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        <select className={sel} value={r.status} onChange={(e) => patch(r.id, { status: e.target.value as MarketingStatus })}>
                          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        <button onClick={() => setOpen(isOpen ? null : r.id)} className="text-white/50 hover:text-white" aria-label="Détails">
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                      {isOpen && (
                        <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06] pt-3">
                          {blocks.filter(([, t]) => t).map(([label, text, key]) => (
                            <div key={key}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">{label}</span>
                                <button
                                  disabled={locked} onClick={() => copy(key, text)}
                                  className="flex items-center gap-1 text-xs text-brand-teal disabled:opacity-40"
                                >
                                  {copied === key ? <Check size={12} /> : <Copy size={12} />} {copied === key ? 'Copié' : 'Copier'}
                                </button>
                              </div>
                              <pre className={`whitespace-pre-wrap break-words text-white/80 text-sm bg-black/20 rounded-lg p-3 font-sans ${locked ? 'blur-sm select-none' : ''}`}>{text}</pre>
                            </div>
                          ))}
                          <div>
                            <label className="text-white/50 text-xs font-semibold uppercase tracking-widest">Notes</label>
                            <textarea
                              defaultValue={r.notes} rows={2} placeholder="Lien de la publication, remarque…"
                              onBlur={(e) => e.target.value !== r.notes && patch(r.id, { notes: e.target.value })}
                              className="mt-1 w-full px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <p className="text-white/30 text-xs mt-6">
            Heures de Dakar (= UTC). « Programmé » = déjà dans AdaptlyPost, il part tout seul. « À la main » = stickers, sondages, repartages à publier dans l’application.
          </p>
        </>
      )}
    </div>
  );
}
