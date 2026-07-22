import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import { CartProvider } from './store/cartStore';
import { WishlistProvider } from './store/wishlistStore';
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
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProDirectoryPage } from './pages/ProDirectoryPage';
import { LeroyBatesPage } from './pages/LeroyBatesPage';
import { GabeSalvaneraPage } from './pages/GabeSalvaneraPage';
import { WishlistPage } from './pages/WishlistPage';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop/$category',
  component: ShopPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$id',
  component: ProductPage,
});

const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: AboutPage });
const teamRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about/team', component: TeamPage });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about/contact', component: ContactPage });
const careersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about/careers', component: CareersPage });
const sustainabilityRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about/sustainability', component: SustainabilityPage });
const safetyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/safety-disclaimer', component: SafetyDisclaimerPage });
const shippingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/shipping-policy', component: ShippingPolicyPage });
const termsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/terms', component: TermsPage });
const beginnersRoute = createRoute({ getParentRoute: () => rootRoute, path: '/beginners', component: BeginnersPage });
const tourPureGuideRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tour-pure-guide', component: TourPureGuidePage });
const feelRightBandGuideRoute = createRoute({ getParentRoute: () => rootRoute, path: '/feel-right-band-guide', component: FeelRightBandGuidePage });
const grantRoute = createRoute({ getParentRoute: () => rootRoute, path: '/grant', component: GrantPage });
const grantSuccessRoute = createRoute({ getParentRoute: () => rootRoute, path: '/grant/success', component: GrantSuccessPage });
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginPage });
const signupRoute = createRoute({ getParentRoute: () => rootRoute, path: '/signup', component: SignupPage });
const prosRoute = createRoute({ getParentRoute: () => rootRoute, path: '/pros', component: ProDirectoryPage });
const leroyBatesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/leroy-bates', component: LeroyBatesPage });
const gabeSalvaneraRoute = createRoute({ getParentRoute: () => rootRoute, path: '/gabe-salvanera', component: GabeSalvaneraPage });
const wishlistRoute = createRoute({ getParentRoute: () => rootRoute, path: '/wishlist', component: WishlistPage });

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
]);

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
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
        <RouterProvider router={router} />
      </CartProvider>
    </WishlistProvider>
  );
}
