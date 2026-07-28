import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { products } from './src/data/products';
import { PAGE_SEO, SHOP_CATEGORIES } from './src/lib/pageSeo';
import { SITE } from './src/lib/seo';

/**
 * Generates sitemap.xml from the live catalog, so a new product is listed for
 * search engines the moment it ships — no separate file to remember to update.
 *
 * Pages marked noindex in PAGE_SEO are excluded: listing a page in the sitemap
 * while telling robots not to index it sends Google contradictory signals.
 */
function sitemapPlugin(): Plugin {
  const build = () => {
    const lastmod = new Date().toISOString().slice(0, 10);

    const urls: Array<{ loc: string; priority: string }> = [];

    for (const [routePath, meta] of Object.entries(PAGE_SEO)) {
      if ('noindex' in meta && meta.noindex) continue;
      urls.push({
        loc: `${SITE.url}${routePath === '/' ? '/' : routePath}`,
        priority: routePath === '/' ? '1.0' : '0.7',
      });
    }

    for (const category of Object.keys(SHOP_CATEGORIES)) {
      urls.push({ loc: `${SITE.url}/shop/${category}`, priority: '0.8' });
    }

    for (const product of products) {
      urls.push({ loc: `${SITE.url}/product/${product.id}`, priority: '0.9' });
    }

    const body = urls
      .map(
        ({ loc, priority }) =>
          `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`,
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  };

  return {
    name: 'dominus-sitemap',

    // Serve it in dev too, so the output can be checked without a full build.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== '/sitemap.xml') return next();
        res.setHeader('Content-Type', 'application/xml');
        res.end(build());
      });
    },

    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(outDir)) return;
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), build(), 'utf8');
      console.log('  \x1b[32m✓\x1b[0m sitemap.xml generated');
    },
  };
}

export default defineConfig({
  plugins: [react(), sitemapPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    allowedHosts: true,
  }
});
