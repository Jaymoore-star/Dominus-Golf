import { Link } from '@tanstack/react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            Precision-Built. Coach-Led. Veteran-Owned.
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="prose-dominus space-y-6 font-sans text-base leading-relaxed text-foreground/80">
          <p>
            Dominus Golf wasn't born in a boardroom; it was born on the range. Our founder, a U.S. Army Veteran and dedicated Pro, realized that most training aids were either too light to build strength or too complex to use.
          </p>
          <p>
            After developing the Tour Pure system, he watched his own handicap drop from a 13 to a 3 in just three months. We don't sell gimmicks or "swing-fixes" that break after a season. We sell a repeatable, professional-grade swing path built on the same discipline required in military service.
          </p>
          <p>
            Dominus is for the golfer who is tired of band-aid solutions and is ready to master the mechanics of the game.
          </p>
        </div>

        {/* Values Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { label: 'Veteran-Owned', desc: 'Founded on the discipline and integrity of U.S. military service.' },
            { label: 'Pro-Led', desc: 'Every product designed around professional-grade technical instruction.' },
            { label: 'Precision-Built', desc: 'Industrial-grade materials built to outlast any training season.' },
          ].map((val) => (
            <div key={val.label} className="border-t-2 border-accent pt-5">
              <h3 className="font-serif font-semibold text-lg text-foreground mb-2">{val.label}</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex gap-4">
          <Link
            to="/shop/$category"
            params={{ category: 'training-system' }}
            className="btn-primary-black px-8 py-4 font-sans font-semibold text-sm tracking-widest uppercase"
          >
            Shop Training Systems
          </Link>
          <Link
            to="/about/team"
            className="px-8 py-4 font-sans font-semibold text-sm tracking-widest uppercase border border-border hover:bg-muted transition-colors"
          >
            Meet the Team
          </Link>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}
