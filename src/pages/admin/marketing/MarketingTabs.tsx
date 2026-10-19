import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/admin/marketing', label: 'Planning', end: true },
  { to: '/admin/marketing/analyses', label: 'Analyses' },
  { to: '/admin/marketing/routine', label: 'Routine' },
];

export default function MarketingTabs() {
  return (
    <div className="mb-6">
      <h1 className="text-white font-black text-2xl">Marketing</h1>
      <p className="text-white/40 text-sm mt-1">Suivi du plan de publication. Les publications se programment dans AdaptlyPost, pas ici.</p>
      <div className="flex gap-1 mt-4 border-b border-white/10">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-semibold -mb-px border-b-2 transition-colors ${
                isActive ? 'border-brand-teal text-brand-teal' : 'border-transparent text-white/50 hover:text-white'
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
