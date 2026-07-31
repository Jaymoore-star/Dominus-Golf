import { Navbar } from '../components/layout/Navbar';
import { NewHeroSection } from '../components/home/new/NewHeroSection';
import { WhySection } from '../components/home/new/WhySection';
import { SystemSection } from '../components/home/new/SystemSection';
import { PrincipleSection } from '../components/home/new/PrincipleSection';
import { ResultsSection } from '../components/home/new/ResultsSection';
import { MissionSection } from '../components/home/new/MissionSection';
import { AffiliateSection } from '../components/home/new/AffiliateSection';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <NewHeroSection />
        <WhySection />
        <SystemSection />
        <PrincipleSection />
        <ResultsSection />
        {/* Affiliate sits here, not last: it is the only dark band, and the footer
            is also bg-primary — the two would merge into one dark block with no
            seam. Mission closes the page on a light background instead. */}
        <AffiliateSection />
        <MissionSection />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
