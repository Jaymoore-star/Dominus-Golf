/**
 * Tells IndexNow search engines (Bing, Yandex, Seznam, Naver...) that pages
 * changed, so they recrawl in hours rather than whenever they next get round
 * to it. Google does not use IndexNow; Search Console's sitemap covers it.
 *
 *   npm run seo:indexnow -- /product/tour-pure-men /shop/apparel   # these pages
 *   npm run seo:indexnow                                           # whole sitemap
 *
 * Run it AFTER the change is live - an engine that crawls straight away and
 * finds the old page has wasted the ping. Not part of the build or the deploy,
 * for that reason: Workers Builds has no post-deploy step, and pinging from
 * the build would announce pages before they exist.
 *
 * Prefer naming the pages you changed. The whole sitemap is for a first run or
 * a site-wide change; IndexNow asks for changed URLs only, and resubmitting
 * unchanged ones on every deploy can get a host's pings deprioritised.
 *
 * The key is not a secret. IndexNow proves ownership by fetching
 * https://www.dominusgolf.com/<key>.txt and comparing, so it is public by design,
 * and lives in public/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HOST = 'www.dominusgolf.com';
const ORIGIN = `https://${HOST}`;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const keyFile = fs
  .readdirSync(path.join(root, 'public'))
  .find((name) => /^[0-9a-f]{32}\.txt$/.test(name));
if (!keyFile) {
  console.error('indexnow: no <32-hex-key>.txt in public/. See the header of this script.');
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, '');

// The live key file must match, or every engine rejects the submission (403).
const live = await fetch(`${ORIGIN}/${keyFile}`);
if (!live.ok || (await live.text()).trim() !== key) {
  console.error(`indexnow: ${ORIGIN}/${keyFile} is not live yet. Deploy first.`);
  process.exit(1);
}

let urls = process.argv.slice(2).map((p) => new URL(p, ORIGIN).href);
if (urls.length === 0) {
  const sitemap = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const foreign = urls.filter((u) => new URL(u).host !== HOST);
if (foreign.length) {
  console.error(`indexnow: every URL must be on ${HOST}:\n  ${foreign.join('\n  ')}`);
  process.exit(1);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `${ORIGIN}/${keyFile}`, urlList: urls }),
});

// 200 = accepted, 202 = accepted and the key is still being validated.
if (response.status === 200 || response.status === 202) {
  console.log(`indexnow: submitted ${urls.length} URL(s) (HTTP ${response.status})`);
} else {
  console.error(`indexnow: HTTP ${response.status} ${await response.text()}`);
  process.exit(1);
}
