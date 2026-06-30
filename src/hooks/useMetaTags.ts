import { useEffect } from 'react';

interface MetaTagsOptions {
  title?: string;
  description?: string;
  image?: string;
}

const META_SELECTORS = {
  description: 'meta[name="description"]',
  ogTitle: 'meta[property="og:title"]',
  ogDescription: 'meta[property="og:description"]',
  ogImage: 'meta[property="og:image"]',
  twitterTitle: 'meta[name="twitter:title"]',
  twitterDescription: 'meta[name="twitter:description"]',
  twitterImage: 'meta[name="twitter:image"]',
} as const;

/** Overrides document title + meta/OG/Twitter tags for the lifetime of the component, restoring the previous values on unmount. */
export function useMetaTags({ title, description, image }: MetaTagsOptions) {
  useEffect(() => {
    if (!title && !description && !image) return;

    const originalTitle = document.title;
    const originals = Object.fromEntries(
      Object.entries(META_SELECTORS).map(([key, selector]) => [
        key,
        document.querySelector(selector)?.getAttribute('content') ?? null,
      ])
    ) as Record<keyof typeof META_SELECTORS, string | null>;

    if (title) {
      document.title = title;
      document.querySelector(META_SELECTORS.ogTitle)?.setAttribute('content', title);
      document.querySelector(META_SELECTORS.twitterTitle)?.setAttribute('content', title);
    }
    if (description) {
      document.querySelector(META_SELECTORS.description)?.setAttribute('content', description);
      document.querySelector(META_SELECTORS.ogDescription)?.setAttribute('content', description);
      document.querySelector(META_SELECTORS.twitterDescription)?.setAttribute('content', description);
    }
    if (image) {
      document.querySelector(META_SELECTORS.ogImage)?.setAttribute('content', image);
      document.querySelector(META_SELECTORS.twitterImage)?.setAttribute('content', image);
    }

    return () => {
      document.title = originalTitle;
      Object.entries(META_SELECTORS).forEach(([key, selector]) => {
        const value = originals[key as keyof typeof META_SELECTORS];
        if (value !== null) document.querySelector(selector)?.setAttribute('content', value);
      });
    };
  }, [title, description, image]);
}

/** Injects a JSON-LD <script> tag for the lifetime of the component, removing it on unmount. */
export function useJsonLd(data: object | null) {
  useEffect(() => {
    if (!data) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
}
