import { Link } from '@tanstack/react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

export function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Team Dominus Golf
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            The Standard of Excellence.
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="space-y-6 font-sans text-base leading-relaxed text-foreground/80">
          <p>
            Our team is comprised of Veterans, elite coaches, and performance experts who understand that discipline is the bridge between goals and accomplishment. Headquartered in Florence, Arizona, we serve a community of golfers who demand more from their gear.
          </p>
          <p>
            When you join Team Dominus, you aren't just a customer; you are part of a stable of golfers committed to elite performance. We bring a "no-nonsense" coaching philosophy to everything we build, ensuring that every product in our line has a specific, result-driven purpose.
          </p>
        </div>

        {/* Pillars */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { label: 'Integrity', desc: 'We say what we mean and build what we promise.' },
            { label: 'Discipline', desc: 'The bridge between goals and accomplishment.' },
            { label: 'Improvement', desc: 'A relentless, never-satisfied drive to get better.' },
          ].map((pillar) => (
            <div key={pillar.label} className="bg-muted p-6">
              <h3 className="font-serif font-semibold text-lg text-foreground mb-2">{pillar.label}</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* HQ callout */}
        <div className="mt-14 border-l-4 border-accent pl-6">
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Headquarters:</span> Florence, Arizona
          </p>
          <p className="font-sans text-sm text-muted-foreground mt-1 leading-relaxed">
            Serving a global community of golfers who demand professional-grade training at every level.
          </p>
        </div>

        <div className="mt-14 flex gap-4">
          <Link
            to="/about/careers"
            className="btn-primary-black px-8 py-4 font-sans font-semibold text-sm tracking-widest uppercase"
          >
            Join the Stable
          </Link>
          <Link
            to="/about/contact"
            className="px-8 py-4 font-sans font-semibold text-sm tracking-widest uppercase border border-border hover:bg-muted transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}
