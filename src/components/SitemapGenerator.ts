// scripts/generate-sitemap.ts
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const BASE_URL = 'https://unitedmoroccanyouth.org';

async function generateSitemap() {
  // Pages statiques
  const staticPages = [
    { url: '/',              priority: '1.0', changefreq: 'weekly' },
    { url: '/commissions',   priority: '0.9', changefreq: 'weekly' },
    { url: '/orientation',   priority: '0.9', changefreq: 'monthly' },
    { url: '/decryptmundi',  priority: '0.8', changefreq: 'daily'  },
    { url: '/gallery',       priority: '0.7', changefreq: 'monthly' },
    { url: '/contact',       priority: '0.8', changefreq: 'monthly' },
    { url: '/sponsor',       priority: '0.6', changefreq: 'monthly' },
    { url: '/terms',         priority: '0.3', changefreq: 'yearly'  },
    { url: '/privacy',       priority: '0.3', changefreq: 'yearly'  },
    { url: '/credits',       priority: '0.2', changefreq: 'yearly'  },
  ];

  // Articles DecryptMundi
  const { data: articles } = await supabase
    .from('decryptmundi_articles')
    .select('slug, published_at, updated_at')
    .eq('status', 'published');

  // Actualités
  const { data: actualites } = await supabase
    .from('commission_actualites')
    .select('id, published_at, updated_at')
    .eq('status', 'published');

  const today = new Date().toISOString().split('T')[0];

  const urls = [
    ...staticPages.map(p => `
  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),

    ...(articles || []).map(a => `
  <url>
    <loc>${BASE_URL}/decryptmundi/${a.slug}</loc>
    <lastmod>${(a.updated_at || a.published_at || today).split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`),

    ...(actualites || []).map(a => `
  <url>
    <loc>${BASE_URL}/actualite/${a.id}</loc>
    <lastmod>${(a.updated_at || a.published_at || today).split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  writeFileSync('./public/sitemap.xml', xml);
  console.log(`✅ Sitemap généré — ${urls.length} URLs`);
}

generateSitemap();