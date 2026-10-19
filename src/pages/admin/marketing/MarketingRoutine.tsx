import { useEffect, useState } from 'react';
import { ROUTINE, RULES } from '@/data/marketingRoutine';
import MarketingTabs from './MarketingTabs';

// La période courante détermine quand les cases se remettent à zéro.
function period(id: string): string {
  const d = new Date();
  if (id === 'daily') return d.toISOString().slice(0, 10);
  if (id === 'monthly') return d.toISOString().slice(0, 7);
  if (id === 'weekly') {
    const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
    const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return `${t.getUTCFullYear()}-W${Math.ceil(((+t - +y) / 86400000 + 1) / 7)}`;
  }
  return 'always';
}

const read = (k: string): string[] => {
  try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; }
};

export default function MarketingRoutine() {
  const [done, setDone] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setDone(Object.fromEntries(ROUTINE.map((b) => [b.id, read(`gm-routine-${b.id}-${period(b.id)}`)])));
  }, []);

  const toggle = (blockId: string, itemId: string) => {
    const cur = done[blockId] ?? [];
    const next = cur.includes(itemId) ? cur.filter((x) => x !== itemId) : [...cur, itemId];
    setDone({ ...done, [blockId]: next });
    try { localStorage.setItem(`gm-routine-${blockId}-${period(blockId)}`, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const reset = (blockId: string) => {
    setDone({ ...done, [blockId]: [] });
    try { localStorage.removeItem(`gm-routine-${blockId}-${period(blockId)}`); } catch { /* ignore */ }
  };

  return (
    <div className="max-w-4xl">
      <MarketingTabs />
      <div className="grid gap-4 md:grid-cols-2">
        {ROUTINE.map((b) => {
          const n = (done[b.id] ?? []).length;
          const pct = Math.round((n / b.items.length) * 100);
          return (
            <div key={b.id} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-white font-bold">{b.title}</h2>
                <span className="text-white/40 text-xs">{n}/{b.items.length}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full my-3 overflow-hidden"><div className="h-full bg-brand-teal transition-all" style={{ width: `${pct}%` }} /></div>
              <ul className="space-y-2">
                {b.items.map((i) => (
                  <li key={i.id}>
                    <label className="flex items-start gap-2 text-sm text-white/80 cursor-pointer">
                      <input type="checkbox" className="mt-1" checked={(done[b.id] ?? []).includes(i.id)} onChange={() => toggle(b.id, i.id)} />
                      <span className={(done[b.id] ?? []).includes(i.id) ? 'line-through text-white/40' : ''}>{i.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between mt-3">
                <span className="text-white/30 text-xs">{b.reset}</span>
                {b.id !== 'once' && <button onClick={() => reset(b.id)} className="text-xs text-white/50 hover:text-white">Remettre à zéro</button>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 bg-[#F5821F]/10 border border-[#F5821F]/30 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-2">Règles à garder en tête</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm text-white/80">{RULES.map((r) => <li key={r}>{r}</li>)}</ul>
      </div>
      <p className="text-white/30 text-xs mt-4">Les cases sont mémorisées dans ce navigateur : elles ne sont pas partagées entre appareils.</p>
    </div>
  );
}
