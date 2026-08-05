import { products } from "../src/data/products"

/**
 * Delivery for products marked `digital` in the catalogue.
 *
 * Buying the eBook used to send the customer nothing at all: the order was
 * recorded, Square emailed a receipt, and the file they had paid for never
 * arrived. The confirmation email now carries the download link.
 *
 * The URLs live here rather than in src/data because everything in src/data is
 * bundled into the browser, which would publish the download to anyone who
 * opened devtools. Only the Worker can see this file.
 */

/**
 * The same file the grant confirmation sends. Both are "The Ultimate Guide to
 * Master the Game"; if the paid edition ever diverges from the grant giveaway,
 * this is the line to change.
 */
const EBOOK_URL =
  "https://drive.google.com/uc?export=download&id=1Ir1DaLgMH-8eVzlQA6xrb7kKO8H_N95p"

/** Keyed by catalogue product id. */
const DOWNLOADS: Record<string, string> = {
  "training-manual-pdf": EBOOK_URL,
}

export type DigitalDownload = { label: string; url: string }

/** Catalogue names, because a Square line item carries a name and not our id. */
const digitalByName = new Map(
  products
    .filter((p) => p.digital && DOWNLOADS[p.id])
    .map((p) => [p.name, { label: p.name, url: DOWNLOADS[p.id] }]),
)

/**
 * The downloads owed for an order, deduplicated — buying two copies of a PDF
 * still only warrants one link.
 */
export function downloadsForLineItems(
  lineItems: { name?: string }[],
): DigitalDownload[] {
  const found = new Map<string, DigitalDownload>()
  for (const item of lineItems) {
    const match = item.name ? digitalByName.get(item.name) : undefined
    if (match) found.set(match.url, match)
  }
  return [...found.values()]
}
