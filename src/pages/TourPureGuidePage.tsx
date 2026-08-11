import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { TourPureOverview } from '../features/product/components/TourPureOverview';
import { ProductCard } from '../components/ui/ProductCard';
import { products } from '../data/products';

/* Derived from the catalogue rather than listed by hand, so a fourth Tour Pure
   appears here the day it is added and a discontinued one leaves. */
const tourPureProducts = products.filter((p) => p.id.startsWith('tour-pure'));

export function TourPureGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Tour Pure Swing Trainer Guide
            </h1>
            <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
              Master your mechanics, tempo, and strength with our comprehensive guide to the Dominus Golf Tour Pure Swing Trainer.
            </p>
          </div>
          
          <TourPureOverview />

          {/* The guide is the page that answers an informational search — "how to
              fix an over the top swing", "swing path drills". Until now it named
              the Tour Pure throughout and offered no way to reach it: a reader
              who wanted one had to go back to the menu, and no link equity
              flowed from this page to the products it is about. */}
          {tourPureProducts.length > 0 && (
            <section className="mt-24 pt-12 border-t border-border">
              <div className="text-center mb-10">
                <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-2">
                  Train With It
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  Get the Tour Pure
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-8">
                {tourPureProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
