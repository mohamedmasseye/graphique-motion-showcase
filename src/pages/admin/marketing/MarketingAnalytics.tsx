import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import MarketingTabs from './MarketingTabs';

interface Metric { value: number | null; previousValue: number | null; deltaPercent: number | null }
interface PlatformRow {
  platform: string; followers: Metric; views: Metric; likes: Metric; comments: Metric; shares: Metric;
  postsCount: Metric; avgViewsPerPost: Metric; engagementRate: Metric;
}
interface Section<T> { data?: T; error?: string }
interface Payload {
  configured: boolean; days?: number;
  overview?: Section<Record<string, Metric> & { partialMetrics?: string[]; lastSyncedAt?: string }>;
  breakdown?: Section<{ platforms: PlatformRow[] }>;
  top?: Section<any>;
  sync?: Section<any>;
}

const MIN_VIEWS = 1000;
const MIN_POSTS = 5;
const NAMES: Record<string, string> = { FACEBOOK: 'Facebook', INSTAGRAM: 'Instagram', LINKEDIN: 'LinkedIn', TIKTOK: 'TikTok', TWITTER: 'X' };
const fmt = (n: number | null | undefined, suffix = '') => (n == null ? 'n.c.' : `${Math.round(n * 10) / 10}`.replace('.', ',') + suffix);

function Delta({ m }: { m?: Metric }) {
  if (!m || m.deltaPercent == null) return null;
  const up = m.deltaPercent >= 0;
  return <span className={`text-xs ml-2 ${up ? 'text-[#28C840]' : 'text-[#FF5F57]'}`}>{up ? '+' : ''}{Math.round(m.deltaPercent)} %</span>;
}

/** Pistes prudentes : aucune recommandation de changement de stratégie sur un petit échantillon. */
function insights(ov: NonNullable<Payload['overview']>['data'], pf: PlatformRow[]): string[] {
  const out: string[] = [];
  const views = ov?.views?.value ?? 0;
  const posts = ov?.postsCount?.value ?? 0;
  if (views < MIN_VIEWS || posts < MIN_POSTS) {
    out.push(`Échantillon encore petit (${views} vues, ${posts} publication(s)) : observe sans changer de stratégie.`);
  }
  const withViews = pf.filter((p) => (p.views.value ?? 0) >= 50 && p.engagementRate.value != null);
  if (withViews.length) {
    const best = withViews.reduce((a, b) => ((b.engagementRate.value ?? 0) > (a.engagementRate.value ?? 0) ? b : a));
    out.push(`Meilleur taux d’engagement : ${NAMES[best.platform] ?? best.platform} (${fmt(best.engagementRate.value, ' %')}).`);
  }
  if ((ov?.comments?.value ?? 0) === 0 && views >= 200) out.push('Aucun commentaire malgré les vues : terminer chaque publication par une question.');
  if ((ov?.shares?.value ?? 0) === 0 && views >= 200) out.push('Aucun partage : tester un format à enregistrer ou à envoyer (carrousel éducatif).');
  pf.filter((p) => (p.postsCount.value ?? 0) > 0 && (p.views.value ?? 0) === 0)
    .forEach((p) => out.push(`${NAMES[p.platform] ?? p.platform} : publications mais 0 vue mesurée. Vérifier la synchronisation ou la reconnexion du compte.`));
  return out;
}

export default function MarketingAnalytics() {
  const [days, setDays] = useState<7 | 30>(7);
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/marketing-analytics?days=${days}`, { headers: { Authorization: `Bearer ${session?.access_token ?? ''}` } });
      const ct = res.headers.get('content-type') ?? '';
      if (!ct.includes('application/json')) throw new Error('Service indisponible ici (la fonction serveur existe seulement sur le site déployé).');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `Erreur ${res.status}`);
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { load(); }, [load]);

  const ov = data?.overview?.data;
  const pf = data?.breakdown?.data?.platforms ?? [];
  const cards: [string, string, Metric | undefined][] = ov ? [
    ['Vues', fmt(ov.views?.value), ov.views], ['J’aime', fmt(ov.likes?.value), ov.likes], ['Commentaires', fmt(ov.comments?.value), ov.comments],
    ['Partages', fmt(ov.shares?.value), ov.shares], ['Abonnés', fmt(ov.followers?.value), ov.followers],
    ['Publications', fmt(ov.postsCount?.value), ov.postsCount], ['Engagement', fmt(ov.engagementRate?.value, ' %'), ov.engagementRate],
  ] : [];
  const topList: any[] = Array.isArray(data?.top?.data) ? data!.top!.data : data?.top?.data?.posts ?? data?.top?.data?.items ?? [];
  const lastSync = ov?.lastSyncedAt ? new Date(ov.lastSyncedAt).toLocaleString('fr-FR', { timeZone: 'UTC' }) + ' (heure de Dakar)' : null;

  return (
    <div className="max-w-6xl">
      <MarketingTabs />
      <div className="flex items-center gap-2 mb-5">
        {([7, 30] as const).map((d) => (
          <button key={d} onClick={() => setDays(d)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${days === d ? 'bg-brand-teal text-black' : 'bg-white/[0.05] text-white/60 hover:text-white'}`}>
            {d} jours
          </button>
        ))}
        {lastSync && <span className="text-white/30 text-xs ml-2">Dernière synchronisation : {lastSync}</span>}
      </div>

      {loading && <div className="p-10 text-center"><div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" /></div>}
      {!loading && error && <div className="bg-[#FF5F57]/10 border border-[#FF5F57]/30 rounded-xl p-4 text-sm text-white/80">{error}</div>}
      {!loading && data && !data.configured && (
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5 text-sm text-white/70 space-y-2">
          <p className="text-white font-semibold">Analyses non connectées</p>
          <p>Dans AdaptlyPost : « API et agents IA » puis « Jetons API », créer un jeton avec la seule permission <code>analytics.read</code>.</p>
          <p>Puis ajouter ce jeton dans Cloudflare Pages (variables d’environnement) sous le nom <code>ADAPTLYPOST_API_KEY</code>, et redéployer. Le jeton ne doit jamais être collé dans le code ni dans un message.</p>
        </div>
      )}

      {!loading && data?.configured && (
        <>
          {data.overview?.error && <div className="mb-4 text-sm text-[#F5821F]">{data.overview.error}</div>}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            {cards.map(([l, v, m]) => (
              <div key={l} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3">
                <div className="text-xl font-black text-brand-teal">{v}<Delta m={m} /></div>
                <div className="text-white/40 text-xs">{l}</div>
              </div>
            ))}
          </div>

          <h2 className="text-white font-bold text-sm mb-2">Par réseau</h2>
          {data.breakdown?.error && <div className="mb-2 text-sm text-[#F5821F]">{data.breakdown.error}</div>}
          <div className="overflow-x-auto rounded-xl border border-white/[0.08] mb-6">
            <table className="w-full text-sm text-white/80 min-w-[640px]">
              <thead className="text-white/40 text-xs uppercase tracking-wider bg-white/[0.04]">
                <tr>{['Réseau', 'Publications', 'Vues', 'Vues / post', 'J’aime', 'Commentaires', 'Engagement', 'Abonnés'].map((h) => <th key={h} className="text-left px-3 py-2 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {pf.map((p) => (
                  <tr key={p.platform} className="border-t border-white/[0.06]">
                    <td className="px-3 py-2 font-semibold text-white">{NAMES[p.platform] ?? p.platform}</td>
                    <td className="px-3 py-2">{fmt(p.postsCount.value)}</td><td className="px-3 py-2">{fmt(p.views.value)}</td>
                    <td className="px-3 py-2">{fmt(p.avgViewsPerPost.value)}</td><td className="px-3 py-2">{fmt(p.likes.value)}</td>
                    <td className="px-3 py-2">{fmt(p.comments.value)}</td><td className="px-3 py-2">{fmt(p.engagementRate.value, ' %')}</td>
                    <td className="px-3 py-2">{fmt(p.followers.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {topList.length > 0 && (
            <>
              <h2 className="text-white font-bold text-sm mb-2">Meilleures publications (par vues)</h2>
              <ul className="space-y-2 mb-6">
                {topList.slice(0, 5).map((t: any, i: number) => (
                  <li key={t.id ?? i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/80 flex justify-between gap-3">
                    <span className="truncate">{NAMES[t.platform] ?? t.platform} · {(t.caption ?? t.text ?? t.content ?? '').toString().slice(0, 90)}</span>
                    <span className="text-brand-teal font-bold whitespace-nowrap">{fmt(t.views?.value ?? t.views)} vues</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2 className="text-white font-bold text-sm mb-2">Pistes d’amélioration</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-white/80 mb-4">
            {insights(ov, pf).map((s) => <li key={s}>{s}</li>)}
          </ul>
          <p className="text-white/30 text-xs">« n.c. » = non mesuré par le réseau (pas zéro). Lecture seule : pour forcer une relecture, utiliser « Synchroniser » dans AdaptlyPost.</p>
        </>
      )}
    </div>
  );
}
