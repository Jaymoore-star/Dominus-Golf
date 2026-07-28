/**
 * Generate Open Graph share images.
 *
 * Why this exists: the catalog images are .webp, and Facebook's link crawler
 * does not reliably render WebP for og:image — shared product links come out
 * with no picture at all. Facebook, WhatsApp, iMessage and LinkedIn all handle
 * JPEG, so every product gets a 1200x630 JPEG twin used purely for previews.
 *
 * Run after adding a product or changing a product photo:
 *
 *     npm run og:images
 *
 * Outputs:
 *     public/og-default.jpg        sitewide fallback (SITE.ogImage in src/lib/seo.ts)
 *     public/images/og/<id>.jpg    per-product, referenced by the product route
 */
import { readFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(ROOT, 'src', 'data', 'products');
const PUBLIC = join(ROOT, 'public');
const OG_DIR = join(PUBLIC, 'images', 'og');

// 1200x630 is the size Facebook, LinkedIn and Twitter all crop to.
const WIDTH = 1200;
const HEIGHT = 630;
// Matches the cream used by the grant email template, so shared links look
// like they belong to the same brand.
const BACKGROUND = { r: 244, g: 241, b: 234 };
const PADDING = 48;
const QUALITY = 88;

/** The product used for the sitewide fallback image. */
const DEFAULT_PRODUCT = 'tour-pure-men';

/** Return [id, imagePath] for every product. */
function parseProducts() {
  const found = [];

  for (const file of readdirSync(DATA_DIR).filter((f) => f.endsWith('.ts')).sort()) {
    const source = readFileSync(join(DATA_DIR, file), 'utf8');

    // Anchor on the 4-space indent of a top-level product entry. Reviews and
    // other nested objects also carry an `id`, and matching those produces
    // bogus OG files for review ids.
    const idPattern = /^ {4}id:\s*'([^']+)'/gm;
    let match;
    while ((match = idPattern.exec(source)) !== null) {
      const rest = source.slice(match.index + match[0].length);
      const image = /^ {4}image:\s*'([^']+)'/m.exec(rest);
      if (image) found.push([match[1], image[1]]);
    }
  }

  return found;
}

/** Fit the source image onto a branded 1200x630 canvas and save as JPEG. */
async function render(sourcePath, targetPath) {
  const art = await sharp(sourcePath)
    .resize({
      width: WIDTH - PADDING * 2,
      height: HEIGHT - PADDING * 2,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toBuffer();

  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: BACKGROUND },
  })
    // Compositing onto an opaque canvas flattens transparent product cut-outs
    // against the cream instead of turning them black.
    .composite([{ input: art, gravity: 'centre' }])
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(targetPath);
}

const products = parseProducts();
if (products.length === 0) {
  console.error(`No products found under ${DATA_DIR}`);
  process.exit(1);
}

mkdirSync(OG_DIR, { recursive: true });

let written = 0;
const missing = [];

for (const [id, imageUrl] of products) {
  const source = join(PUBLIC, imageUrl.replace(/^\//, ''));
  if (!existsSync(source)) {
    missing.push(`${id} -> ${imageUrl}`);
    continue;
  }

  await render(source, join(OG_DIR, `${id}.jpg`));
  written++;

  if (id === DEFAULT_PRODUCT) {
    await render(source, join(PUBLIC, 'og-default.jpg'));
  }
}

console.log(`Wrote ${written} product OG image(s) to ${relative(ROOT, OG_DIR)}`);

if (existsSync(join(PUBLIC, 'og-default.jpg'))) {
  console.log(`Wrote ${relative(ROOT, join(PUBLIC, 'og-default.jpg'))}`);
} else {
  console.log(`WARNING: default product '${DEFAULT_PRODUCT}' not found; no og-default.jpg`);
}

if (missing.length > 0) {
  console.log(`\nWARNING: ${missing.length} product image(s) missing on disk:`);
  for (const entry of missing) console.log(`  ${entry}`);
}
