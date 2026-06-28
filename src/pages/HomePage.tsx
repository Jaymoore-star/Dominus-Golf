import { Navbar } from '../components/layout/Navbar';
import { NewHeroSection } from '../components/home/new/NewHeroSection';
import { WhySection } from '../components/home/new/WhySection';
import { SystemSection } from '../components/home/new/SystemSection';
import { PrincipleSection } from '../components/home/new/PrincipleSection';
import { ConnectionSection } from '../components/home/new/ConnectionSection';
import { ResultsSection } from '../components/home/new/ResultsSection';
import { MissionSection } from '../components/home/new/MissionSection';
import { FinalSection } from '../components/home/new/FinalSection';
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
        <ConnectionSection />
        <ResultsSection />
        <MissionSection />
        <FinalSection />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
