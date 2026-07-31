import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  HeadContent,
  useRouterState,
  lazyRouteComponent,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import { CartProvider } from './store/cartStore';
import { WishlistProvider } from './store/wishlistStore';
import { AuthPromptProvider } from './store/authPromptStore';
import { LoginPromptModal } from './components/auth/LoginPromptModal';

/**
 * Page components are code-split: each becomes its own chunk, fetched when its
 * route is first visited.
 *
 * Before this, all 28 pages were statically imported into one 988 KB bundle
 * (279 KB Brotli) that took ~3.1s to download — and because <body> is an empty
 * #root div, nothing rendered until it finished. A visitor reading one product
 * page was paying for the grant form, every legal page and the whole account
 * section.
 *
 * HomePage and NotFoundPage stay eagerly imported on purpose. Home is the most
 * common landing page, and making it lazy would add a second sequential request
 * before first paint — exactly the delay this is meant to remove. NotFoundPage
 * is the router's fallback and must be available synchronously.
 */
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

const ShopPage = lazyRouteComponent(() => import('./pages/ShopPage'), 'ShopPage');
const ProductPage = lazyRouteComponent(() => import('./pages/ProductPage'), 'ProductPage');
const AboutPage = lazyRouteComponent(() => import('./pages/AboutPage'), 'AboutPage');
const TeamPage = lazyRouteComponent(() => import('./pages/TeamPage'), 'TeamPage');
const ContactPage = lazyRouteComponent(() => import('./pages/ContactPage'), 'ContactPage');
const CareersPage = lazyRouteComponent(() => import('./pages/CareersPage'), 'CareersPage');
const SustainabilityPage = lazyRouteComponent(
  () => import('./pages/SustainabilityPage'),
  'SustainabilityPage',
);
const SafetyDisclaimerPage = lazyRouteComponent(
  () => import('./pages/SafetyDisclaimerPage'),
  'SafetyDisclaimerPage',
);
const ShippingPolicyPage = lazyRouteComponent(
  () => import('./pages/ShippingPolicyPage'),
  'ShippingPolicyPage',
);
const TermsPage = lazyRouteComponent(() => import('./pages/TermsPage'), 'TermsPage');
const BeginnersPage = lazyRouteComponent(() => import('./pages/BeginnersPage'), 'BeginnersPage');
const TourPureGuidePage = lazyRouteComponent(
  () => import('./pages/TourPureGuidePage'),
  'TourPureGuidePage',
);
const FeelRightBandGuidePage = lazyRouteComponent(
  () => import('./pages/FeelRightBandGuidePage'),
  'FeelRightBandGuidePage',
);
const GrantPage = lazyRouteComponent(() => import('./pages/GrantPage'), 'GrantPage');
const GrantSuccessPage = lazyRouteComponent(
  () => import('./pages/GrantSuccessPage'),
  'GrantSuccessPage',
);
const AccountProfilePage = lazyRouteComponent(
  () => import('./pages/account/AccountProfilePage'),
  'AccountProfilePage',
);
const AccountOrdersPage = lazyRouteComponent(
  () => import('./pages/account/AccountOrdersPage'),
  'AccountOrdersPage',
);
const AccountWishlistPage = lazyRouteComponent(
  () => import('./pages/account/AccountWishlistPage'),
  'AccountWishlistPage',
);
const AccountAddressesPage = lazyRouteComponent(
  () => import('./pages/account/AccountAddressesPage'),
  'AccountAddressesPage',
);
const AccountPreferencesPage = lazyRouteComponent(
  () => import('./pages/account/AccountPreferencesPage'),
  'AccountPreferencesPage',
);
const LoginPage = lazyRouteComponent(() => import('./pages/LoginPage'), 'LoginPage');
const SignupPage = lazyRouteComponent(() => import('./pages/SignupPage'), 'SignupPage');
const ProDirectoryPage = lazyRouteComponent(
  () => import('./pages/ProDirectoryPage'),
  'ProDirectoryPage',
);
const LeroyBatesPage = lazyRouteComponent(() => import('./pages/LeroyBatesPage'), 'LeroyBatesPage');
const GabeSalvaneraPage = lazyRouteComponent(
  () => import('./pages/GabeSalvaneraPage'),
  'GabeSalvaneraPage',
);
const WishlistPage = lazyRouteComponent(() => import('./pages/WishlistPage'), 'WishlistPage');
const AffiliatesPage = lazyRouteComponent(
  () => import('./pages/AffiliatesPage'),
  'AffiliatesPage',
);
const AuthConfirmedPage = lazyRouteComponent(
  () => import('./pages/AuthConfirmedPage'),
  'AuthConfirmedPage',
);
const AuthResetPasswordPage = lazyRouteComponent(
  () => import('./pages/AuthResetPasswordPage'),
  'AuthResetPasswordPage',
);

import { seo, organizationJsonLd, websiteJsonLd } from './lib/seo';
import { pageHead, shopCategoryHead, productHead } from './lib/pageSeo';
import { initAnalytics, trackPageView } from './lib/analytics';

/**
 * Every prerendered HTML file carries a static copy of that route's meta tags so
 * crawlers which do not execute JavaScript (most social link unfurlers) see the
 * right ones. Once the router mounts it manages the head itself, so the static
 * copies are removed to avoid duplicate tags in the live DOM.
 *
 * This is load-bearing, not a leftover: the prerender plugin marks everything it
 * writes with data-static-seo precisely so this can clear it. Without it, a
 * client-side navigation would leave the previous page's og:* and canonical tags
 * sitting alongside the new page's.
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
  head: ({ params }) => shopCategoryHead(params.category),
  component: ShopPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$id',
  head: ({ params }) => productHead(params.id),
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
const authConfirmedRoute = createRoute({ getParentRoute: () => rootRoute, path: '/auth/confirmed', head: pageHead('/auth/confirmed'), component: AuthConfirmedPage });
const authResetPasswordRoute = createRoute({ getParentRoute: () => rootRoute, path: '/auth/reset-password', head: pageHead('/auth/reset-password'), component: AuthResetPasswordPage });
const prosRoute = createRoute({ getParentRoute: () => rootRoute, path: '/pros', head: pageHead('/pros'), component: ProDirectoryPage });
const leroyBatesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/leroy-bates', head: pageHead('/leroy-bates'), component: LeroyBatesPage });
const gabeSalvaneraRoute = createRoute({ getParentRoute: () => rootRoute, path: '/gabe-salvanera', head: pageHead('/gabe-salvanera'), component: GabeSalvaneraPage });
const wishlistRoute = createRoute({ getParentRoute: () => rootRoute, path: '/wishlist', head: pageHead('/wishlist'), component: WishlistPage });
const affiliatesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/affiliates', head: pageHead('/affiliates'), component: AffiliatesPage });
const accountRoute = createRoute({ getParentRoute: () => rootRoute, path: '/account', head: pageHead('/account'), component: AccountProfilePage });
const accountOrdersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/account/orders', head: pageHead('/account/orders'), component: AccountOrdersPage });
const accountWishlistRoute = createRoute({ getParentRoute: () => rootRoute, path: '/account/wishlist', head: pageHead('/account/wishlist'), component: AccountWishlistPage });
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
  authConfirmedRoute,
  authResetPasswordRoute,
  prosRoute,
  leroyBatesRoute,
  gabeSalvaneraRoute,
  wishlistRoute,
  affiliatesRoute,
  accountRoute,
  accountOrdersRoute,
  accountWishlistRoute,
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
