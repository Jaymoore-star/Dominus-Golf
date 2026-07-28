import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  HeadContent,
  useRouterState,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import { CartProvider } from './store/cartStore';
import { WishlistProvider } from './store/wishlistStore';
import { AuthPromptProvider } from './store/authPromptStore';
import { LoginPromptModal } from './components/auth/LoginPromptModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { AboutPage } from './pages/AboutPage';
import { TeamPage } from './pages/TeamPage';
import { ContactPage } from './pages/ContactPage';
import { CareersPage } from './pages/CareersPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { SafetyDisclaimerPage } from './pages/SafetyDisclaimerPage';
import { ShippingPolicyPage } from './pages/ShippingPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { BeginnersPage } from './pages/BeginnersPage';
import { TourPureGuidePage } from './pages/TourPureGuidePage';
import { FeelRightBandGuidePage } from './pages/FeelRightBandGuidePage';
import { GrantPage } from './pages/GrantPage';
import { GrantSuccessPage } from './pages/GrantSuccessPage';
import { AccountProfilePage } from './pages/account/AccountProfilePage';
import { AccountOrdersPage } from './pages/account/AccountOrdersPage';
import { AccountAddressesPage } from './pages/account/AccountAddressesPage';
import { AccountPreferencesPage } from './pages/account/AccountPreferencesPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProDirectoryPage } from './pages/ProDirectoryPage';
import { LeroyBatesPage } from './pages/LeroyBatesPage';
import { GabeSalvaneraPage } from './pages/GabeSalvaneraPage';
import { WishlistPage } from './pages/WishlistPage';
import { products } from './data/products';
import {
  seo,
  clamp,
  organizationJsonLd,
  websiteJsonLd,
  productJsonLd,
  breadcrumbJsonLd,
} from './lib/seo';
import { pageHead, SHOP_CATEGORIES } from './lib/pageSeo';
import { initAnalytics, trackPageView } from './lib/analytics';

/**
 * index.html carries a static copy of the sitewide meta tags so that crawlers
 * which do not execute JavaScript (most social link unfurlers) still see
 * something useful. Once the router mounts it manages the head itself, so the
 * static copies are removed to avoid duplicate tags in the live DOM.
 *
 * Prerendering the routes at build time would make this unnecessary.
 */
function useStaticHeadCleanup() {
  useEffect(() => {
    document.querySelectorAll('[data-static-seo]').forEach((el) => el.remove());
  }, []);
}

/** Sends a page view on first load and on every subsequent navigation. */
function AnalyticsTracker() {
  const path = useRouterState({
    select: (s) => s.location.pathname + s.location.searchStr,
  });

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(path);
  }, [path]);

  return null;
}

const rootRoute = createRootRoute({
  // Sitewide defaults. Every child route overrides title/description/canonical;
  // the Organization and WebSite structured data applies to all of them.
  head: () =>
    seo({
      path: '/',
      description:
        'Golf training systems, apparel, and accessories from Dominus Golf.',
      jsonLd: [organizationJsonLd(), websiteJsonLd()],
      // Only the matched page emits a canonical — see the note in SeoInput.
      canonical: false,
    }),
  component: function RootLayout() {
    useStaticHeadCleanup();
    return (
      <>
        <HeadContent />
        <AnalyticsTracker />
        <Outlet />
        <LoginPromptModal />
      </>
    );
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  head: pageHead('/'),
  component: HomePage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop/$category',
  head: ({ params }) => {
    const meta = (SHOP_CATEGORIES as Record<string, { label: string; description: string }>)[
      params.category
    ];
    return seo({
      path: `/shop/${params.category}`,
      title: meta?.label ?? 'Shop',
      description:
        meta?.description ?? 'Browse golf training systems, apparel, and accessories.',
      jsonLd: [
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: meta?.label ?? 'Shop', path: `/shop/${params.category}` },
        ]),
      ],
    });
  },
  component: ShopPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$id',
  head: ({ params }) => {
    const product = products.find((p) => p.id === params.id);

    // Unknown id renders the not-found path — give it a title but keep it out
    // of the index rather than emitting Product schema for nothing.
    if (!product) {
      return seo({
        path: `/product/${params.id}`,
        title: 'Product Not Found',
        description: 'This product could not be found.',
        noindex: true,
      });
    }

    return seo({
      path: `/product/${product.id}`,
      title: product.name,
      // The product's own opening paragraph, clipped — better than a generic
      // template line, and it is copy that was already written deliberately.
      description: clamp(product.description.split('\n\n')[0]),
      // JPEG twin, not the .webp catalog image — see SITE.ogImage.
      image: `/images/og/${product.id}.jpg`,
      type: 'product',
      jsonLd: [
        productJsonLd(product),
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Shop', path: '/shop/all' },
          { name: product.name, path: `/product/${product.id}` },
        ]),
      ],
    });
  },
  component: ProductPage,
});

const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', head: pageHead('/about'), component: AboutPage });
const teamRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about/team', head: pageHead('/about/team'), component: TeamPage });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about/contact', head: pageHead('/about/contact'), component: ContactPage });
const careersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about/careers', head: pageHead('/about/careers'), component: CareersPage });
const sustainabilityRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about/sustainability', head: pageHead('/about/sustainability'), component: SustainabilityPage });
const safetyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/safety-disclaimer', head: pageHead('/safety-disclaimer'), component: SafetyDisclaimerPage });
const shippingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/shipping-policy', head: pageHead('/shipping-policy'), component: ShippingPolicyPage });
const termsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/terms', head: pageHead('/terms'), component: TermsPage });
const beginnersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/beginners', head: pageHead('/beginners'), component: BeginnersPage });
const tourPureGuideRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tour-pure-guide', head: pageHead('/tour-pure-guide'), component: TourPureGuidePage });
const feelRightBandGuideRoute = createRoute({ getParentRoute: () => rootRoute, path: '/feel-right-band-guide', head: pageHead('/feel-right-band-guide'), component: FeelRightBandGuidePage });
const grantRoute = createRoute({ getParentRoute: () => rootRoute, path: '/grant', head: pageHead('/grant'), component: GrantPage });
const grantSuccessRoute = createRoute({ getParentRoute: () => rootRoute, path: '/grant/success', head: pageHead('/grant/success'), component: GrantSuccessPage });
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', head: pageHead('/login'), component: LoginPage });
const signupRoute = createRoute({ getParentRoute: () => rootRoute, path: '/signup', head: pageHead('/signup'), component: SignupPage });
const prosRoute = createRoute({ getParentRoute: () => rootRoute, path: '/pros', head: pageHead('/pros'), component: ProDirectoryPage });
const leroyBatesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/leroy-bates', head: pageHead('/leroy-bates'), component: LeroyBatesPage });
const gabeSalvaneraRoute = createRoute({ getParentRoute: () => rootRoute, path: '/gabe-salvanera', head: pageHead('/gabe-salvanera'), component: GabeSalvaneraPage });
const wishlistRoute = createRoute({ getParentRoute: () => rootRoute, path: '/wishlist', head: pageHead('/wishlist'), component: WishlistPage });
const accountRoute = createRoute({ getParentRoute: () => rootRoute, path: '/account', head: pageHead('/account'), component: AccountProfilePage });
const accountOrdersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/account/orders', head: pageHead('/account/orders'), component: AccountOrdersPage });
const accountAddressesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/account/addresses', head: pageHead('/account/addresses'), component: AccountAddressesPage });
const accountPreferencesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/account/preferences', head: pageHead('/account/preferences'), component: AccountPreferencesPage });

/**
 * Catch-all for unmatched URLs. Without it the not-found page inherits the
 * root's indexable meta, so a mistyped or stale link could be indexed as a
 * normal page. Static routes always outrank a splat, so this only ever matches
 * paths nothing else claims.
 */
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$',
  head: () =>
    seo({
      path: '/',
      title: 'Page Not Found',
      description: 'This page could not be found.',
      noindex: true,
      canonical: false,
    }),
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  productRoute,
  aboutRoute,
  teamRoute,
  contactRoute,
  careersRoute,
  sustainabilityRoute,
  safetyRoute,
  shippingRoute,
  termsRoute,
  beginnersRoute,
  tourPureGuideRoute,
  feelRightBandGuideRoute,
  grantRoute,
  grantSuccessRoute,
  loginRoute,
  signupRoute,
  prosRoute,
  leroyBatesRoute,
  gabeSalvaneraRoute,
  wishlistRoute,
  accountRoute,
  accountOrdersRoute,
  accountAddressesRoute,
  accountPreferencesRoute,
  notFoundRoute,
]);

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
  // Without this, navigation keeps the previous page's scroll offset — following
  // a link near the footer drops you at the bottom of the next page. Scrolls to
  // top on new navigations, and restores position on back/forward.
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <AuthPromptProvider>
          <RouterProvider router={router} />
        </AuthPromptProvider>
      </CartProvider>
    </WishlistProvider>
  );
}
