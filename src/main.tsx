import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { AppToaster } from './components/layout/AppToaster'
import './index.css'

const queryClient = new QueryClient()

/*
 * createRoot, NOT hydrateRoot - and this is a decision, not an oversight.
 *
 * scripts/prerender.mjs writes every route's body into the HTML, so crawlers
 * get the real page. React does not adopt that markup: it clears #root and
 * renders again. The SEO value is unaffected (the HTML is already correct when
 * it leaves the server); the cost is that the page is painted twice, which
 * holds mobile LCP at ~5.4s against an FCP of 1.5s.
 *
 * hydrateRoot was attempted on 17 Sep 2026 and reverted. It is blocked by a
 * real conflict, not by a bug:
 *
 *   - prerender.mjs puts each route's <title>, <meta>, <link rel=canonical>
 *     and JSON-LD into <head>, and strips them from the body. Without that
 *     strip every page shipped TWO titles and TWO canonicals.
 *   - The client renders those same tags inline in the body via <HeadContent />.
 *
 * So the body a crawler should receive and the body React expects to hydrate
 * are different documents by design. Three mismatches were found and two were
 * genuinely fixed on the way (a <Toaster> missing from the SSR tree, and the
 * router's matches being unresolved on first client render - see AppToaster.tsx
 * and the stores, both kept). The third is the head-tag conflict above and
 * cannot be patched: it needs prerender.mjs moved from renderToString to
 * renderToPipeableStream, so React 19 hoists the head tags itself and the two
 * sides agree by construction.
 *
 * Do not switch this line on its own. See docs/SEO.md.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppToaster />
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
