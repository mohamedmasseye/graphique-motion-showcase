// Exporte les articles du blog en Markdown pour relecture : node scripts/export-blog.mjs sortie.md
import { buildSync } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const out = path.resolve('node_modules/.cache/blog.mjs');
buildSync({ entryPoints: ['src/data/blog.ts'], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
const { ARTICLES } = await import(pathToFileURL(out).href);

let md = '# Articles du blog — à valider avant publication\n\n' +
  'Les 6 articles ci-dessous remplacent les pages « article en cours de rédaction ». Aucun chiffre ou résultat inventé : les seuls montants et délais cités viennent de la page Tarifs.\n\n' +
  '**Points à vérifier en priorité :**\n' +
  '- Article 1 : « notre Pack Vitrine est annoncé en 10 jours à partir du moment où nous avons vos contenus » (la précision sur les contenus est de moi, pas de la page Tarifs).\n' +
  '- Article 5 : « nous commençons par comprendre vos tâches avant de proposer le moindre outil » (décrit votre façon de travailler : est-ce exact ?).\n' +
  '- Signature « Par Mohamed Masseye DIOP » et date du 25 novembre 2026 sur chaque article.\n' +
  '- Article 2 : tarifs affichés (Starter 200 000, Vitrine 450 000, Pro 750 000, App native dès 1 500 000, Refontes 250 000 et 500 000 FCFA).\n\n---\n\n';
ARTICLES.forEach((a, i) => {
  md += `# ${i + 1}. ${a.title}\n\n*${a.category} · ${a.readTime} · /blog/${a.slug}*\n\n> ${a.excerpt}\n\n`;
  for (const b of a.body) md += b.h2 ? `## ${b.h2}\n\n` : b.ul ? b.ul.map((l) => '- ' + l).join('\n') + '\n\n' : b.p + '\n\n';
  md += '---\n\n';
});
fs.writeFileSync(process.argv[2], md);
console.log(md.split(/\s+/).length, 'mots');
