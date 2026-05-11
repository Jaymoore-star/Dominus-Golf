import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import { CartProvider } from './store/cartStore';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { AboutPage } from './pages/AboutPage';
import { TeamPage } from './pages/TeamPage';
import { ContactPage } from './pages/ContactPage';
import { CareersPage } from './pages/CareersPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { GabeSalvaneraPage } from './pages/GabeSalvaneraPage';

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
const gabeSalvaneraRoute = createRoute({ getParentRoute: () => rootRoute, path: '/gabe-salvanera', component: GabeSalvaneraPage });

const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  productRoute,
  aboutRoute,
  teamRoute,
  contactRoute,
  careersRoute,
  sustainabilityRoute,
  gabeSalvaneraRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
