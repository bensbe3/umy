import { useEffect } from 'react';

const BASE_URL = 'https://unitedmoroccanyouth.org'; // ✅ bon domaine

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const canonicalUrl = url ? `${BASE_URL}${url}` : BASE_URL;
    const ogImage = image ?? `${BASE_URL}/images/logoUmy.png`;

    // ✅ Basic
    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);
    if (author) setMeta('author', author);

    // ✅ Canonical link
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // ✅ Open Graph
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:site_name', 'United Moroccan Youth', true); // ✅ nom cohérent

    // ✅ Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // ✅ Article-specific
    if (type === 'article') {
      if (publishedTime) setMeta('article:published_time', publishedTime, true);
      if (modifiedTime) setMeta('article:modified_time', modifiedTime, true);
      if (author) setMeta('article:author', author, true);
    }

    // ✅ JSON-LD dynamique par page
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebPage',
      headline: title,
      description,
      url: canonicalUrl,
      image: ogImage,
      ...(author && { author: { '@type': 'Person', name: author } }),
      ...(publishedTime && { datePublished: publishedTime }),
      ...(modifiedTime && { dateModified: modifiedTime }),
      publisher: {
        '@type': 'Organization',
        name: 'United Moroccan Youth',
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/images/logoUmy.png`,
        },
      },
    };

    // ✅ On cible le bon script (pas celui de l'Organization dans index.html)
    let scriptTag = document.querySelector<HTMLScriptElement>(
      'script[type="application/ld+json"][data-page]'
    );
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-page', 'true');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime]);

  return null;
}