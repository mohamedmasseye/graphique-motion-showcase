import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE } from '@/data/content';

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: string;
  jsonLd?: object | object[];
}

function setMeta(selector: string, attr: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    if (attr === 'property') el.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
    else el.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Head({
  title,
  description,
  image,
  canonical,
  type = 'website',
  jsonLd,
}: HeadProps) {
  const location = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
    const desc = description || SITE.description;
    const url = canonical || `${SITE.url}${location.pathname}`;
    const img = image || `${SITE.url}/og-image.png`;

    document.title = fullTitle;

    setMeta('meta[name="description"]', 'name', desc);
    setMeta('meta[property="og:title"]', 'property', fullTitle);
    setMeta('meta[property="og:description"]', 'property', desc);
    setMeta('meta[property="og:url"]', 'property', url);
    setMeta('meta[property="og:type"]', 'property', type);
    setMeta('meta[property="og:image"]', 'property', img);
    setMeta('meta[name="twitter:title"]', 'name', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', desc);
    setMeta('meta[name="twitter:image"]', 'name', img);
    setMeta('link[rel="canonical"]', 'rel', url);

    // Remove old JSON-LD scripts
    document.querySelectorAll('script[data-dynamic-jsonld]').forEach((s) => s.remove());

    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic-jsonld', 'true');
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, image, canonical, type, jsonLd, location.pathname]);

  return null;
}
