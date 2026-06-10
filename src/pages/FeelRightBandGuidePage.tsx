import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { FeelRightBandOverview } from '../features/product/components/FeelRightBandOverview';
import { Link } from '@tanstack/react-router';

export function FeelRightBandGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link 
              to="/product/$id" 
              params={{ id: 'feel-right-band' }}
              className="font-sans text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
            >
              ← Back to Feel Right Band
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Feel Right Band Training Guide
            </h1>
            <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Master the tour-level "floatie drill" mechanics used by world #1 Nelly Korda to build a more repeatable and efficient swing.
            </p>
          </div>
          
          <FeelRightBandOverview />
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
