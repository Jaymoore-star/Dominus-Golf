/**
 * Serialises router `head()` output into static HTML, for build-time prerendering.
 *
 * Only the prerender plugin in vite.config.ts uses this. It lives under src/ so
 * `npm run lint:types` checks it, and so it stays next to seo.ts where the shape
 * it consumes is defined.
 *
 * Every tag is emitted with `data-static-seo`, which is the contract with
 * useStaticHeadCleanup() in App.tsx: the router manages the head once React
 * mounts, so the prerendered copies are removed to avoid duplicate tags.
 */

type HeadOutput = {
  meta: Array<Record<string, unknown>>;
  links: Array<Record<string, unknown>>;
};

/** Escape a string for use inside a double-quoted HTML attribute. */
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Escape text appearing between tags (only <title> here). */
function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Serialise JSON-LD for embedding in a <script> block.
 *
 * `</script>` anywhere in the data would end the block early and turn the rest
 * of the payload into parsed markup, so `<` is escaped to its < form. That
 * stays valid JSON and every JSON-LD consumer unescapes it.
 */
function jsonLdScript(data: unknown): string {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<script data-static-seo type="application/ld+json">${json}</script>`;
}

/** Render one `meta` array entry, matching the router's own interpretation. */
function renderMetaEntry(entry: Record<string, unknown>): string | null {
  if (typeof entry.title === 'string') {
    return `<title data-static-seo>${escapeText(entry.title)}</title>`;
  }

  if (entry['script:ld+json']) {
    return jsonLdScript(entry['script:ld+json']);
  }

  const attrs = Object.entries(entry)
    .filter(([, value]) => typeof value === 'string')
    .map(([key, value]) => `${key}="${escapeAttr(value as string)}"`);

  if (!attrs.length) return null;
  return `<meta data-static-seo ${attrs.join(' ')} />`;
}

function renderLinkEntry(entry: Record<string, unknown>): string | null {
  const attrs = Object.entries(entry)
    .filter(([, value]) => typeof value === 'string')
    .map(([key, value]) => `${key}="${escapeAttr(value as string)}"`);

  if (!attrs.length) return null;
  return `<link data-static-seo ${attrs.join(' ')} />`;
}

/** Render a route's head as indented HTML ready to splice into index.html. */
export function renderHeadHtml({ meta, links }: HeadOutput): string {
  const tags = [
    ...meta.map(renderMetaEntry),
    ...links.map(renderLinkEntry),
  ].filter((tag): tag is string => tag !== null);

  return tags.map((tag) => `  ${tag}`).join('\n');
}
