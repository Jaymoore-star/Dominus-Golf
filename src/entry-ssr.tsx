/**
 * Build-time server renderer. Never shipped to the browser.
 *
 * `vite build --ssr` compiles this into `.ssr-build/`, and
 * `scripts/prerender.mjs` imports it to write one fully-rendered HTML file per
 * route. See the header of that script for why this exists.
 *
 * It re-exports the head helpers too, so the prerender script has a single
 * import and never needs to load TypeScript directly from Node.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RouterProvider,
  createRouter,
  createMemoryHistory,
} from '@tanstack/react-router';
import { routeTree } from './App';
import { WishlistProvider } from './store/wishlistStore';
import { CartProvider } from './store/cartStore';
import { AuthPromptProvider } from './store/authPromptStore';

export { prerenderRoutes, notFoundHead } from './lib/pageSeo';
export { renderHeadHtml } from './lib/headHtml';

/**
 * Render one route to HTML.
 *
 * A fresh router per call, on a memory history: routers hold the current
 * location, so reusing one across routes would render every page as whichever
 * was rendered first.
 *
 * The providers mirror `main.tsx` and `App.tsx`. `<Toaster>` is deliberately
 * absent — it renders nothing until a toast fires, and it reaches for
 * `document` on mount.
 */
export async function renderRoute(url: string): Promise<string> {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [url] }),
  });

  await router.load();

  return renderToString(
    <StrictMode>
      <QueryClientProvider client={new QueryClient()}>
        <WishlistProvider>
          <CartProvider>
            <AuthPromptProvider>
              <RouterProvider router={router} />
            </AuthPromptProvider>
          </CartProvider>
        </WishlistProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
