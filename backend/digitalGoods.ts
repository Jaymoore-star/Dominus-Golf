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
  "https://drive.google.com/uc?export=download&id=1R4xzR1mozZP1qu8wVymm1AMmx3O_q-Zb"

/** Keyed by catalogue product id. */
const DOWNLOADS: Record<string, string> = {
  "training-manual-pdf": EBOOK_URL,
}

/** `free`: a gift with a trainer rather than something bought, which the email says. */
export type DigitalDownload = { label: string; url: string; free?: boolean }

/** Catalogue names, because a Square line item carries a name and not our id. */
const digitalByName = new Map(
  products
    .filter((p) => p.digital && DOWNLOADS[p.id])
    .map((p) => [p.name, { label: p.name, url: DOWNLOADS[p.id] }]),
)

/**
 * The PDF is free with every Tour Pure trainer - the book's product pages say
 * so - but nothing delivered it: only buying the PDF itself sent the link, so
 * a trainer buyer got nothing they were promised. Any order holding a trainer,
 * whatever else is in it, now gets the same download as a PDF purchase.
 *
 * Read from the catalogue by category, so a new trainer added to
 * training-system qualifies without an edit here.
 */
const FREE_EBOOK: DigitalDownload = {
  label: products.find((p) => p.id === "training-manual-pdf")?.name ?? "Ultimate Guide to Mastering the Game (PDF)",
  url: EBOOK_URL,
  free: true,
}
const trainerNames = new Set(products.filter((p) => p.category === "training-system").map((p) => p.name))

/**
 * The downloads owed for an order, deduplicated by URL - buying two copies of
 * the PDF, or the PDF and a trainer, still only warrants one link.
 */
export function downloadsForLineItems(
  lineItems: { name?: string }[],
): DigitalDownload[] {
  const found = new Map<string, DigitalDownload>()
  for (const item of lineItems) {
    if (!item.name) continue
    const match = digitalByName.get(item.name)
    // A bought copy wins over the gift, whichever line comes first: someone who
    // paid for the PDF should not be told it was free.
    if (match) found.set(match.url, match)
    if (trainerNames.has(item.name) && !found.has(FREE_EBOOK.url)) found.set(FREE_EBOOK.url, FREE_EBOOK)
  }
  return [...found.values()]
}
