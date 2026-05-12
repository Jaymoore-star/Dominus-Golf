import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/home/HeroSection';
import { CredibilitySection } from '../components/home/CredibilitySection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { ProductPositioningSection } from '../components/home/ProductPositioningSection';
import { MidCTASection } from '../components/home/MidCTASection';
import { WomensSection } from '../components/home/WomensSection';
import { ProDirectorySection } from '../components/home/ProDirectorySection';
import { FAQSection } from '../components/home/FAQSection';
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
        {/* Section 7 — Mid CTA */}
        <MidCTASection />
        {/* Section 8 — Women's */}
        <WomensSection />
        {/* Section 9 — Pro Directory */}
        <ProDirectorySection />
        {/* Section 10 — FAQ */}
        <FAQSection />
        {/* Section 11 — Final CTA */}
        <FinalCTASection />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
