/**
 * Writes one fully-rendered static HTML file per route into dist/.
 *
 * ── Why this replaced the prerenderPlugin in vite.config.ts ────────────────
 *
 * That plugin baked each route's <head> into a copy of the shell, which fixed
 * per-page titles and structured data. It left the <body> as
 * `<div id="root"></div>`, so the HTML a crawler receives was 4 KB with no
 * heading, no text and no links. Measured on the live site, 17 Sep 2026:
 *
 *     curl -s https://www.dominusgolf.com/  ->  h1:0  a:0  img:0  words:0
 *
 * Googlebot renders JavaScript and got there eventually, which is why the site
 * indexed at all. Everything else did not: an SEO audit reported "Missing H1
 * (CRITICAL)" and "Thin content (0 words)", Search Console had 8 pages in
 * "crawled/discovered - currently not indexed", and mobile LCP was 6.0s
 * against CLS 0 and TBT 90ms — the signature of a blank page waiting on a
 * bundle, not of slow code.
 *
 * Rendering the body at build time fixes all of those at once.
 *
 * ── Why a script and not a plugin ─────────────────────────────────────────
 *
 * The renderer has to import the real component tree, which means it must be
 * compiled by Vite (JSX, the `@/` alias, CSS imports). A vite.config plugin
 * runs in the config's own module graph and cannot do that. So the build is
 * now two passes — client, then SSR — and this script joins them.
 *
 * ── This HTML is REPLACED on the client, not hydrated ─────────────────────
 *
 * `main.tsx` uses `createRoot`, so React clears #root and renders again. The
 * SEO value is unaffected - the HTML is already correct when it leaves the
 * server, which is the whole point of this file. The cost is that the page is
 * painted twice, holding mobile LCP at ~5.4s against an FCP of 1.5s.
 *
 * `hydrateRoot` was attempted on 17 Sep 2026 and reverted, because of a
 * conflict this script is one half of:
 *
 *   - `stripHeadTags` below removes each route's <title>, <meta>, <link
 *     rel=canonical> and JSON-LD from the body, because they also go into
 *     <head>. Without that strip every page ships TWO titles and TWO
 *     canonicals.
 *   - The client renders those same tags inline in the body via <HeadContent/>.
 *
 * So the body a crawler should receive and the body React expects to hydrate
 * are different documents BY DESIGN. Two other mismatches were found first and
 * both were real - a <Toaster> missing from the SSR tree, and the router's
 * matches being unresolved on the first client render. Both fixes were kept
 * (see AppToaster.tsx, cartStore.tsx, wishlistStore.tsx). This third one is
 * structural.
 *
 * Fixing it means moving this script off `renderToString` and onto
 * `renderToPipeableStream`, so React 19 hoists the head tags into <head>
 * itself and both sides agree by construction - at which point stripHeadTags
 * goes away entirely. That is a real piece of work with its own test round.
 * Do not just flip main.tsx.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'dist');
const shellPath = path.join(outDir, 'index.html');

const SEO_BLOCK = /<!--\s*seo:start[\s\S]*?seo:end\s*-->/;
/** The empty mount point the client build ships. */
const ROOT_DIV = '<div id="root"></div>';

// pathToFileURL, not the bare path: on Windows a dynamic import of `D:\...`
// fails with ERR_UNSUPPORTED_ESM_URL_SCHEME, because ESM specifiers are URLs.
const { renderRoute, prerenderRoutes, notFoundHead, renderHeadHtml } = await import(
  pathToFileURL(path.join(root, '.ssr-build', 'entry-ssr.js')).href
);

if (!fs.existsSync(shellPath)) {
  console.error('prerender: dist/index.html is missing. Run the client build first.');
  process.exit(1);
}

const template = fs.readFileSync(shellPath, 'utf8');

if (!SEO_BLOCK.test(template)) {
  // Failing loudly matters: skipping silently would ship a site whose every
  // page carries the home page's card, which is exactly the bug the head
  // injection exists to fix and is invisible without a crawler test.
  console.error(
    'prerender: could not find the <!-- seo:start --> … <!-- seo:end --> markers in ' +
      'dist/index.html. Were they removed from index.html?',
  );
  process.exit(1);
}

if (!template.includes(ROOT_DIV)) {
  console.error(
    `prerender: could not find ${ROOT_DIV} in dist/index.html. The body cannot be ` +
      'injected, which would silently ship head-only pages again.',
  );
  process.exit(1);
}

/**
 * Remove head-destined tags from the rendered body.
 *
 * `renderToString` of the router emits `<HeadContent />` inline, and React
 * hoists `<link rel="preload">` for every image it renders. All of that lands
 * inside `#root`, which gave each page a SECOND `<title>`, `<meta
 * name="description">`, `<link rel="canonical">` and Organization/WebSite
 * JSON-LD — in the body, below the correct ones already injected into the head.
 * Two canonicals and two titles is worse than none.
 *
 * The head built from `prerenderRoutes()` is authoritative, so these are pure
 * duplicates and are dropped rather than merged.
 *
 * The image preloads are dropped too, deliberately. They look tempting for LCP,
 * but React emits one per image — 13 on /shop/all — and preloading everything
 * just makes them compete for bandwidth. The real LCP win is already here: the
 * `<img src>` tags are now in the HTML, so the browser's preload scanner finds
 * them without waiting for JavaScript.
 */
function stripHeadTags(html) {
  return html
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<link[^>]*>/gi, '');
}

/**
 * One page: route head into the marker block, rendered markup into #root.
 *
 * Both replacements pass a FUNCTION rather than a string, and that is load
 * bearing. Given a string, String.replace interprets the special patterns
 * `$&`, `` $` ``, `$'` and `$n` inside it — and what is being inserted here is
 * arbitrary rendered HTML. A `` $` `` occurring in it expands to "everything
 * before the match", which spliced the entire preceding <head> back into the
 * body: every page came out with a second <title>, a second canonical and a
 * second Organization block sitting inside <div id="root">.
 *
 * A function replacer disables that substitution completely.
 */
function buildPage(template, headHtml, bodyHtml, comment) {
  return template
    .replace(SEO_BLOCK, () => `<!-- ${comment} -->\n${headHtml}`)
    .replace(ROOT_DIV, () => `<div id="root">${stripHeadTags(bodyHtml)}</div>`);
}

let rendered = 0;
let failed = 0;

for (const { path: routePath, head } of prerenderRoutes()) {
  let body = '';
  try {
    body = await renderRoute(routePath);
  } catch (error) {
    // A route that throws server-side still gets its head, so it is never worse
    // than the old head-only output. Reported rather than swallowed, because a
    // silent empty body is the exact bug this script exists to fix.
    failed++;
    console.warn(
      `  \x1b[33m!\x1b[0m ${routePath} did not render server-side (${error.message.split('\n')[0]}) - head only`,
    );
  }

  const html = buildPage(
    template,
    renderHeadHtml(head),
    body,
    `prerendered for ${routePath} - see scripts/prerender.mjs`,
  );

  /* Guard, not a nicety. stripHeadTags once silently did nothing — the regexes
     had been written through a shell heredoc that turned `\b` into a literal
     backspace byte, so `/<title\x08[^>]*>/` matched nothing and every page
     shipped a duplicate <title> and canonical inside the body. It looked
     correct in every isolated test. Fail the build instead. */
  const bodyRegion = html.slice(html.indexOf(ROOT_DIV.slice(0, -6)));
  const leaked = bodyRegion.match(/<title|rel="canonical"|application\/ld\+json/g);
  if (leaked) {
    console.error(
      `prerender: ${routePath} has ${leaked.length} head tag(s) left inside <div id="root">. ` +
        'stripHeadTags is not doing its job - check it for stray control characters.',
    );
    process.exit(1);
  }

  // '/' is the shell itself; everything else becomes <route>/index.html so it
  // resolves both with and without a trailing slash.
  const target =
    routePath === '/'
      ? shellPath
      : path.join(outDir, routePath.replace(/^\//, ''), 'index.html');

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html, 'utf8');
  rendered++;
}

/* The 404 shell. dist/404.html, not 404/index.html, because worker/index.ts
   fetches it by that exact path. Head only on purpose: it is served for URLs
   that do not correspond to a route, so there is nothing to render. */
fs.writeFileSync(
  path.join(outDir, '404.html'),
  buildPage(
    template,
    renderHeadHtml(notFoundHead()),
    '',
    'prerendered 404 shell - served with a real 404 status by worker/index.ts',
  ),
  'utf8',
);

const note = failed ? ` (\x1b[33m${failed} head-only\x1b[0m)` : '';
console.log(`  \x1b[32m✓\x1b[0m prerendered ${rendered} routes + 404.html${note}`);
