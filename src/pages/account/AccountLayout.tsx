import { useEffect, type ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Heart, Loader2, LogOut, MapPin, Package, SlidersHorizontal, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { stashPostLoginRedirect } from '../../hooks/useRequireAuth';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/cart/CartDrawer';

export type AccountSection = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'preferences';

const NAV: { key: AccountSection; label: string; to: string; icon: ReactNode }[] = [
  { key: 'profile', label: 'Profile', to: '/account', icon: <User size={16} /> },
  { key: 'orders', label: 'Orders', to: '/account/orders', icon: <Package size={16} /> },
  { key: 'wishlist', label: 'Wishlist', to: '/wishlist', icon: <Heart size={16} /> },
  { key: 'addresses', label: 'Addresses', to: '/account/addresses', icon: <MapPin size={16} /> },
  {
    key: 'preferences',
    label: 'Preferences',
    to: '/account/preferences',
    icon: <SlidersHorizontal size={16} />,
  },
];

type Props = {
  active: AccountSection;
  title: string;
  description?: string;
  children: ReactNode;
};

/**
 * Shared chrome for every /account page: sidebar navigation plus the sign-in
 * guard. Guards on `isLoading` as well, since the Supabase session restores
 * asynchronously and redirecting on `!isAuthenticated` alone would bounce
 * signed-in users to /login on every hard refresh.
 */
export function AccountLayout({ active, title, description, children }: Props) {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    stashPostLoginRedirect();
    navigate({ to: '/login' });
  }, [isLoading, isAuthenticated, navigate]);

  const ready = !isLoading && isAuthenticated;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {!ready ? (
          <div className="flex justify-center py-32" aria-label="Loading your account">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-10">
              <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-2">
                My Account
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">{title}</h1>
              {description && (
                <p className="font-sans text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <div className="grid lg:grid-cols-[220px_1fr] gap-10 lg:gap-14 items-start">
              {/* Sidebar */}
              <nav aria-label="Account" className="lg:sticky lg:top-32">
                <div className="border border-border">
                  <div className="px-4 py-4 border-b border-border">
                    <p className="font-sans text-sm font-medium text-foreground truncate">
                      {user?.displayName || 'Member'}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>

                  <ul>
                    {NAV.map((item) => {
                      const isActive = item.key === active;
                      return (
                        <li key={item.key}>
                          <Link
                            to={item.to}
                            aria-current={isActive ? 'page' : undefined}
                            className={`flex items-center gap-2.5 px-4 py-3 font-sans text-sm transition-colors border-l-2 ${
                              isActive
                                ? 'border-accent text-accent bg-accent/5 font-medium'
                                : 'border-transparent text-foreground hover:bg-muted'
                            }`}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                    <li className="border-t border-border">
                      <button
                        type="button"
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-2.5 px-4 py-3 font-sans text-sm text-foreground hover:bg-muted transition-colors border-l-2 border-transparent"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </nav>

              <div className="min-w-0">{children}</div>
            </div>
          </>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}

/** Bordered panel used to group related settings on the account pages. */
export function AccountCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-border p-6 sm:p-8 mb-8 last:mb-0">
      <h2 className="font-serif text-xl font-bold text-foreground tracking-tight">{title}</h2>
      {description && (
        <p className="font-sans text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
      )}
      <div className="mt-6">{children}</div>
    </section>
  );
}
