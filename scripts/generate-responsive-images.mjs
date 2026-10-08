/**
 * Writes smaller copies (640px and 1080px wide) of large images in
 * public/images, for srcset.
 *
 *   npm run images:responsive
 *
 * Run it after adding or replacing an image in public/images, then COMMIT both
 * the new files under public/images/<width>/ and src/data/responsiveImages.generated.ts.
 * Same model as `npm run og:images`: generated once, committed, not built in CI.
 *
 * Why: every <img> pointed at the original, up to 1920px, so a phone showing a
 * product card ~180px wide downloaded the full desktop file. The 1 Oct 2026
 * audit listed "no srcset" as an open performance item (docs/SEO.md §3g).
 * 640 serves cards and thumbnails; 1080 serves a full-width image on a 2x
 * phone (390 x 2 = 780), which is the product page's main photo and its LCP
 * element.
 *
 * A source gets a copy at a width only when it is at least 25% wider than that
 * width; closer than that, the copy saves too little to be worth a second URL.
 * src/lib/responsiveImage.ts reads the generated module to know which copies
 * exist, so an image without one simply keeps its single src.
 *
 * A copy is rewritten only when its source is newer, so re-running is cheap and
 * leaves no spurious diff. Copies whose source has gone are deleted.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = path.join(root, 'public', 'images');
const moduleOut = path.join(root, 'src', 'data', 'responsiveImages.generated.ts');

const WIDTHS = [640, 1080];
const MIN_RATIO = 1.25;
const RASTER = /\.(webp|jpe?g|png)$/i;

for (const w of WIDTHS) fs.mkdirSync(path.join(imagesDir, String(w)), { recursive: true });

/** Original path -> its width and the copy widths it has. */
const images = {};
/** Copy width -> file names expected in that folder. */
const expected = new Map(WIDTHS.map((w) => [w, new Set()]));
let written = 0;

for (const name of fs.readdirSync(imagesDir).sort()) {
  const source = path.join(imagesDir, name);
  if (!fs.statSync(source).isFile() || !RASTER.test(name)) continue;

  const { width } = await sharp(source).metadata();
  const copies = WIDTHS.filter((w) => width && width >= w * MIN_RATIO);
  if (!copies.length) continue;
  images[`/images/${name}`] = { width, copies };

  for (const w of copies) {
    // Always webp, whatever the source format, under the same base name.
    const outName = name.replace(RASTER, '.webp');
    const target = path.join(imagesDir, String(w), outName);
    expected.get(w).add(outName);

    if (fs.existsSync(target) && fs.statSync(target).mtimeMs >= fs.statSync(source).mtimeMs) {
      continue;
    }
    await sharp(source).resize({ width: w }).webp({ quality: 80 }).toFile(target);
    written += 1;
  }
}

// Drop copies whose original was removed or shrunk below the threshold.
for (const [w, names] of expected) {
  const dir = path.join(imagesDir, String(w));
  for (const name of fs.readdirSync(dir)) {
    if (!names.has(name)) fs.rmSync(path.join(dir, name));
  }
}

const entries = Object.entries(images)
  .map(
    ([src, { width, copies }]) =>
      `  ${JSON.stringify(src)}: { width: ${width}, copies: [${copies.join(', ')}] },`,
  )
  .join('\n');

const contents = `/**
 * GENERATED FILE - do not edit by hand.
 *
 * Written by scripts/generate-responsive-images.mjs (\`npm run images:responsive\`).
 * Every image listed here has a copy at each width in \`copies\`, under
 * /images/<copy width>/, always .webp. \`width\` is the original's, which srcset
 * needs. See src/lib/responsiveImage.ts.
 */

export const RESPONSIVE_IMAGES: Record<string, { width: number; copies: number[] }> = {
${entries}
};
`;

if (!fs.existsSync(moduleOut) || fs.readFileSync(moduleOut, 'utf8') !== contents) {
  fs.writeFileSync(moduleOut, contents, 'utf8');
}

console.log(
  `responsive images: ${Object.keys(images).length} with copies, ${written} file(s) (re)written`,
);
