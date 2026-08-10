import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { products } from './src/data/products';
import { PAGE_SEO, SHOP_CATEGORIES, prerenderRoutes, routeSourceFiles } from './src/lib/pageSeo';
import { renderHeadHtml } from './src/lib/headHtml';
import { SITE } from './src/lib/seo';
import { FILE_DATES } from './src/data/fileDates.generated';

/**
 * Generates sitemap.xml from the live catalog, so a new product is listed for
 * search engines the moment it ships - no separate file to remember to update.
 *
 * Pages marked noindex in PAGE_SEO are excluded: listing a page in the sitemap
 * while telling robots not to index it sends Google contradictory signals.
 */
function sitemapPlugin(): Plugin {
  const buildDate = new Date().toISOString().slice(0, 10);

  /**
   * Last-changed date of the files backing a route, as YYYY-MM-DD.
   *
   * Stamping every URL with the build date - which is what this did - tells
   * Google all 36 pages changed on every deploy. Identical dates that all move
   * together are exactly the pattern Google treats as noise and ignores, so the
   * signal was worth nothing. Real per-page dates make it worth something.
   *
   * Read from the committed snapshot in data/fileDates.generated.ts rather than
   * by calling git here. Workers Builds clones shallowly, so a `git log` at
   * build time returns nothing in CI and every URL quietly fell back to the
   * build date - which shipped once before this was caught.
   *
   * Still falls back to the build date for a file with no entry yet, e.g. a
   * page added since the last `npm run seo:dates`.
   */
  const lastChanged = (files: string[]): string => {
    const dates = files
      .map((file) => FILE_DATES[file])
      .filter((date): date is string => Boolean(date));

    // A category page lists several catalog files; the newest edit is the one
    // that changed what a visitor sees.
    return dates.length ? dates.sort().at(-1)! : buildDate;
  };

  const build = () => {
    const urls: Array<{ loc: string; priority: string; lastmod: string }> = [];

    const add = (routePath: string, priority: string) => {
      urls.push({
        loc: `${SITE.url}${routePath}`,
        priority,
        lastmod: lastChanged(routeSourceFiles(routePath)),
      });
    };

    for (const [routePath, meta] of Object.entries(PAGE_SEO)) {
      if ('noindex' in meta && meta.noindex) continue;
      add(routePath, routePath === '/' ? '1.0' : '0.7');
    }

    for (const category of Object.keys(SHOP_CATEGORIES)) {
      add(`/shop/${category}`, '0.8');
    }

    for (const product of products) {
      add(`/product/${product.id}`, '0.9');
    }

    const body = urls
      .map(
        ({ loc, priority, lastmod }) =>
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

/** Region of index.html the prerenderer owns - see the markers in that file. */
const SEO_BLOCK = /<!--\s*seo:start[\s\S]*?<!--\s*seo:end\s*-->/;

/**
 * Writes one static HTML file per route, with that route's real title, meta,
 * Open Graph and JSON-LD baked into the <head>.
 *
 * Why this exists: the app is client-rendered, so its per-route SEO only appears
 * after JavaScript runs. Google executes JS, but social link unfurlers do not -
 * Facebook, WhatsApp, LinkedIn and iMessage read the raw HTML and stop. Before
 * this, every shared link showed the same generic sitewide card no matter which
 * product it pointed at.
 *
 * This is deliberately NOT server-side rendering. Only the <head> is generated;
 * the <body> stays the empty #root div and the app boots normally. That keeps it
 * to a build step with no runtime behaviour change, and avoids auditing every
 * component for SSR safety (Three.js, framer-motion and the localStorage-backed
 * cart would all need work). Unfurlers only ever read the head, so they get
 * everything they need; users get the identical app they had before.
 *
 * Runs in closeBundle, after Vite has written dist/index.html, so each route
 * inherits the real hashed asset tags by copying that file rather than
 * reconstructing it.
 */
function prerenderPlugin(): Plugin {
  return {
    name: 'dominus-prerender',
    // Must run after Vite's own HTML emit.
    enforce: 'post',

    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      const shell = path.join(outDir, 'index.html');
      if (!fs.existsSync(shell)) return;

      const template = fs.readFileSync(shell, 'utf8');

      if (!SEO_BLOCK.test(template)) {
        // Failing loudly matters: silently skipping would ship a site whose
        // every page carries the homepage's card, which is exactly the bug
        // this plugin exists to fix and is invisible without a crawler test.
        this.error(
          'prerender: could not find the <!-- seo:start --> … <!-- seo:end --> markers in ' +
            'dist/index.html. Were they removed from index.html?',
        );
      }

      let count = 0;

      for (const { path: routePath, head } of prerenderRoutes()) {
        const html = template.replace(
          SEO_BLOCK,
          `<!-- prerendered for ${routePath} - see prerenderPlugin in vite.config.ts -->\n${renderHeadHtml(head)}`,
        );

        // '/' is the shell itself and doubles as the SPA fallback for any URL
        // with no prerendered file; everything else becomes <route>/index.html
        // so it resolves both with and without a trailing slash.
        const target =
          routePath === '/'
            ? shell
            : path.join(outDir, routePath.replace(/^\//, ''), 'index.html');

        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, html, 'utf8');
        count++;
      }

      console.log(`  \x1b[32m✓\x1b[0m prerendered ${count} routes`);
    },
  };
}

export default defineConfig({
  plugins: [react(), sitemapPlugin(), prerenderPlugin()],
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
