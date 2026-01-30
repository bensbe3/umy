import { useEffect } from 'react';

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
  modifiedTime
}: SEOHeadProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper to set or update meta tag
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);
    if (author) setMeta('author', author);

    // Open Graph tags
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type, true);
    if (url) setMeta('og:url', url, true);
    if (image) setMeta('og:image', image, true);
    setMeta('og:site_name', 'Youth Parliament Morocco - UMY', true);

    // Twitter Card tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    if (image) setMeta('twitter:image', image);

    // Article-specific tags
    if (type === 'article') {
      if (publishedTime) setMeta('article:published_time', publishedTime, true);
      if (modifiedTime) setMeta('article:modified_time', modifiedTime, true);
      if (author) setMeta('article:author', author, true);
    }

    // Structured data (JSON-LD)
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebPage',
      headline: title,
      description: description,
      ...(image && { image: image }),
      ...(url && { url: url }),
      ...(author && {
        author: {
          '@type': 'Person',
          name: author
        }
      }),
      ...(publishedTime && { datePublished: publishedTime }),
      ...(modifiedTime && { dateModified: modifiedTime }),
      publisher: {
        '@type': 'Organization',
        name: 'Youth Parliament Morocco',
        logo: {
          '@type': 'ImageObject',
          url: `${window.location.origin}/logo.png`
        }
      }
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime]);

  return null; // This component doesn't render anything
}
