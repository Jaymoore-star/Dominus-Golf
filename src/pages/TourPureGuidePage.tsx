import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { TourPureOverview } from '../features/product/components/TourPureOverview';

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
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
