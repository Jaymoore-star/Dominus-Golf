import type { LinkProps } from '@tanstack/react-router';

/**
 * A concrete URL string, handed to `<Link to>`.
 *
 * The nav data in Navbar.tsx and Footer.tsx stores finished destinations —
 * `/product/tour-pure-men`, `/shop/apparel`. The router's `to` is typed as the
 * union of route *patterns*, where that product page is `/product/$id` and the
 * id travels separately in `params`. A finished URL matches no pattern in that
 * union, so it cannot be assigned without an assertion.
 *
 * Both spellings work identically at runtime; `Link` parses a plain string. The
 * type-safe alternative is to store `{ to: '/product/$id', params: { id } }` in
 * the nav data instead, which is the better long-term shape — it would catch a
 * link to a route that no longer exists. That is a refactor of every entry in
 * the site's primary navigation, not a lint fix.
 *
 * Until then this keeps the assertion in one place with the reason attached,
 * rather than five bare `as any` casts that say nothing about why.
 */
export function href(path: string): LinkProps['to'] {
  return path as LinkProps['to'];
}
