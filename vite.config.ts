import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * The canonical origin of the deployed site.
 *
 * Set the SITE_URL environment variable (in CI it comes from the repository
 * variable `SITE_URL`) to the production origin, e.g. https://ajaykumar.dev.
 * When it is unset we deliberately emit *no* canonical link, no og:url and no
 * sitemap <loc> entries: a wrong canonical is worse for SEO than an absent one,
 * and a sitemap full of guessed URLs gets ignored by crawlers.
 */
// Read through globalThis rather than `process`: the config is typechecked by
// tsconfig.node.json, which deliberately has no Node type definitions.
const nodeEnv =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
const siteUrl = (nodeEnv.SITE_URL ?? '').replace(/\/+$/, '');
const hasSiteUrl = /^https?:\/\/[^/]+$/i.test(siteUrl);

/** Single-page site: one URL, but every section is a deep-linkable anchor. */
const SECTION_ANCHORS: readonly (readonly [string, string, number])[] = [
  ['', 'Home', 1.0],
  ['#about', 'About', 0.9],
  ['#journey', 'Journey', 0.8],
  ['#originals', 'Originals', 0.9],
  ['#picks', 'Top picks', 0.7],
  ['#skills', 'Capabilities', 0.7],
  ['#moments', 'Recognition', 0.6],
  ['#continueWatching', 'Continue Watching', 0.8],
  ['#story', 'CV', 0.9],
  ['#contact', "Let's build", 0.8],
];

/**
 * Injects the URL-dependent head tags and writes robots.txt + sitemap.xml.
 *
 * Kept as a plugin rather than as static files in public/ so the canonical
 * origin has exactly one source of truth (SITE_URL), and local/preview builds
 * never advertise a production URL.
 */
function seoPlugin(): Plugin {
  return {
    name: 'seo',
    transformIndexHtml(html) {
      const tags: string[] = [];
      if (hasSiteUrl) {
        tags.push(
          `<link rel="canonical" href="${siteUrl}/" />`,
          `<meta property="og:url" content="${siteUrl}/" />`,
          `<link rel="alternate" hreflang="en" href="${siteUrl}/" />`,
        );
      }
      tags.push(
        '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />',
        `<script type="application/ld+json">${JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Person',
              '@id': hasSiteUrl ? `${siteUrl}/#person` : '#person',
              name: 'Ajay Kumar Myakala',
              alternateName: 'Ajay Kumar',
              jobTitle: 'Lead Product Designer & Design Leader',
              description:
                'Lead Product Designer and design leader with 10+ years across FinTech, healthcare, mortgage and lending, procurement, GovTech, media, AdTech, MarTech and recruitment technology. UX strategy, enterprise product experience and design systems.',
              email: 'mailto:ajaykumarmyakala@outlook.com',
              telephone: '+91 7382328066',
              knowsAbout: [
                'UX Strategy',
                'Enterprise Product Experience',
                'Design Leadership',
                'Product Strategy',
                'Design Systems',
                'Enterprise UX',
                'AI-Enabled Product Development',
                'Human-Computer Interaction',
                'AI Experience (AIX)',
                'Design Governance',
                'Accessibility',
              ],
              address: { '@type': 'PostalAddress', addressLocality: 'Hyderabad', addressCountry: 'IN' },
              sameAs: ['https://www.linkedin.com/in/ajaykumarmyakala'],
            },
            {
              '@type': 'WebSite',
              '@id': hasSiteUrl ? `${siteUrl}/#website` : '#website',
              ...(hasSiteUrl ? { url: `${siteUrl}/` } : {}),
              name: 'Ajay Kumar Myakala — The Series',
              inLanguage: 'en',
              publisher: { '@id': hasSiteUrl ? `${siteUrl}/#person` : '#person' },
            },
          ],
        })}</script>`,
      );
      return html.replace('<!--seo-->', tags.join('\n    '));
    },
    generateBundle() {
      const robots = [
        'User-agent: *',
        'Allow: /',
        '',
        '# The admin portal and the API are not content — keep them out of the index.',
        'Disallow: /admin',
        'Disallow: /api/',
        '',
      ];
      if (hasSiteUrl) robots.push(`Sitemap: ${siteUrl}/sitemap.xml`, '');
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots.join('\n') });

      if (!hasSiteUrl) return;
      const today = new Date().toISOString().slice(0, 10);
      const body = SECTION_ANCHORS.map(
        ([anchor, , priority]) =>
          `  <url>\n    <loc>${siteUrl}/${anchor}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`,
      ).join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin()],
  clearScreen: false,
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'pv-368e1c2f0384-af8fecbe-c733-4a1f-8761-4f20a965c2ca.style.dev',
      'pv-368e1c2f0384-b5555cb8-b6f4-40e9-9d12-75728b0627e0.style.dev',
    ],
  },
  define: {
    'import.meta.env.VITE_SITE_URL': JSON.stringify(hasSiteUrl ? siteUrl : ''),
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: { motion: ['framer-motion'], react: ['react', 'react-dom'] },
      },
    },
  },
});
