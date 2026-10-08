import { RESPONSIVE_IMAGES } from '../data/responsiveImages.generated';

/**
 * `srcSet` and `sizes` props for an `<img>`, spread after `src`:
 *
 *   <img src={image} {...responsiveImage(image, '(min-width: 1024px) 25vw, 50vw')} />
 *
 * Offers the smaller copies from `npm run images:responsive` alongside the
 * original, so a phone takes a small one and a large screen the full one. An
 * image with no copies (small already, remote, or added without re-running the
 * script) gets no props and keeps its single `src`, so a missing copy can never
 * break an image.
 *
 * `sizes` is the image's rendered width at each breakpoint. It is what the
 * browser picks with, so err wide: too wide costs bytes, too narrow costs sharpness.
 */
export function responsiveImage(
  src: string | undefined,
  sizes: string,
): { srcSet?: string; sizes?: string } {
  const entry = src ? RESPONSIVE_IMAGES[src] : undefined;
  if (!src || !entry) return {};

  const copies = entry.copies.map((w) => {
    const copy = src.replace(/^\/images\//, `/images/${w}/`).replace(/\.(jpe?g|png)$/i, '.webp');
    return `${copy} ${w}w`;
  });
  return {
    srcSet: [...copies, `${src} ${entry.width}w`].join(', '),
    sizes,
  };
}
