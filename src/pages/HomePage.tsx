import { Navbar } from '../components/layout/Navbar';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { TrustBadges } from '../components/home/TrustBadges';
import { PromoSection } from '../components/home/PromoSection';
import { ProofSection } from '../components/home/ProofSection';
import { ProductCarousel } from '../components/home/ProductCarousel';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroCarousel />
        <TrustBadges />
        <CategoryGrid />
        <FeaturedProducts />
        <ProofSection />
        <PromoSection />
        <ProductCarousel />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
