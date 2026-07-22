import { Link } from '@tanstack/react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="max-w-md w-full text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-6">
            Error 404
          </p>
          <h1 className="font-serif text-6xl sm:text-7xl font-bold text-foreground leading-none">
            404
          </h1>
          <h2 className="font-serif text-2xl font-bold text-foreground mt-6">
            Page not found
          </h2>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed mt-4">
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back on course.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground font-sans text-[13px] font-semibold tracking-[0.15em] uppercase px-8 py-4 hover:opacity-90 transition-opacity"
            >
              Back to Home
            </Link>
            <Link
              to="/shop/$category"
              params={{ category: 'all' }}
              className="inline-flex items-center justify-center border border-border text-foreground font-sans text-[13px] font-semibold tracking-[0.15em] uppercase px-8 py-4 hover:bg-muted transition-colors"
            >
              Shop All
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
