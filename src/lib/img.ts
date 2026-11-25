/** Redimensionne et recompresse à la volée les images hébergées sur Cloudinary
 *  (format moderne automatique, qualité automatique, largeur plafonnée). Autres URL : inchangées. */
export function optimizeImage(url: string | null | undefined, width = 800): string {
  if (!url) return '';
  const marker = '/image/upload/';
  if (!url.includes('res.cloudinary.com') || !url.includes(marker)) return url;
  const [head, tail] = url.split(marker);
  // déjà transformée (f_auto, w_…) : on ne touche à rien
  if (/^(?:[a-z]{1,3}_[^/,]+,?)+\//i.test(tail) && !/^v\d+\//.test(tail)) return url;
  return `${head}${marker}f_auto,q_auto,w_${width},c_limit/${tail}`;
}
