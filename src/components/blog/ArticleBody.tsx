import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import type { Block } from '@/data/blog';

/** Rend [texte](/chemin) en lien interne et **gras** en <strong>. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          return href.startsWith('/')
            ? <Link key={i} to={href} className="text-brand-teal underline underline-offset-2 hover:text-white transition-colors">{label}</Link>
            : <a key={i} href={href} className="text-brand-teal underline underline-offset-2 hover:text-white transition-colors">{label}</a>;
        }
        if (p.startsWith('**')) return <strong key={i} className="text-white font-semibold">{p.slice(2, -2)}</strong>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        if ('h2' in b) return <h2 key={i} className="font-syne text-2xl font-bold text-white pt-6 leading-snug">{b.h2}</h2>;
        if ('ul' in b)
          return (
            <ul key={i} className="space-y-3">
              {b.ul.map((li, k) => (
                <li key={k} className="flex gap-3.5 text-[#B4B4B4] text-[16px] leading-[1.8]">
                  <span className="mt-[12px] w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0" />
                  <span><Rich text={li} /></span>
                </li>
              ))}
            </ul>
          );
        return <p key={i} className="text-[#B4B4B4] text-[16px] leading-[1.85]"><Rich text={b.p} /></p>;
      })}
    </div>
  );
}
