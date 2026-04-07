import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/home/HeroSection';
import { CredibilitySection } from '../components/home/CredibilitySection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { ProductPositioningSection } from '../components/home/ProductPositioningSection';
import { InHandSection } from '../components/home/InHandSection';
import { MidCTASection } from '../components/home/MidCTASection';
import { WomensSection } from '../components/home/WomensSection';
import { FinalCTASection } from '../components/home/FinalCTASection';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Section 1 — Hero */}
        <HeroSection />
        {/* Section 2 — Credibility */}
        <CredibilitySection />
        {/* Section 3 — How It Works */}
        <HowItWorksSection />
        {/* Section 4 — Product Positioning */}
        <ProductPositioningSection />
        {/* Section 5 — In-Hand Image */}
        <InHandSection />
        {/* Section 6 — Mid CTA */}
        <MidCTASection />
        {/* Section 7 — Women's */}
        <WomensSection />
        {/* Section 8 — Final CTA */}
        <FinalCTASection />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
