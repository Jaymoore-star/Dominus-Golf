import { Link } from '@tanstack/react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="on-dark bg-black text-white py-20 px-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            The Dominus Standard
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white leading-tight mb-6">
            Discover the Difference:<br />The Science of Feedback
          </h1>
          <div className="w-20 h-1 bg-accent mx-auto" />
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="space-y-8 font-sans text-lg leading-relaxed text-foreground/80 mb-20">
          <p className="text-xl text-foreground font-medium">
            Most golf training aids are designed around a flaw: they try to force your body into a static position using restrictive bands, tracks, or gimmicks. They treat the symptoms of a bad swing rather than training the athlete to feel and correct the root cause.
          </p>
          <p>
            At Dominus Golf, we build our systems on a fundamental truth: <span className="text-accent font-bold">Feel is a lie.</span>
          </p>
          <p>
            What feels like a perfect turn or a square face is often your body compensating for a breakdown in sequencing. The only way to bridge the gap between feel and real is through instant, undeniable, physical information.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mb-24">
          <h2 className="font-serif text-3xl font-bold mb-10 text-center uppercase tracking-tight">How the Tour Pure System Redefines Practice</h2>
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-5 font-serif text-lg font-bold uppercase tracking-wider">Feature</th>
                  <th className="p-5 font-serif text-lg font-bold uppercase tracking-wider">Ordinary Training Aids</th>
                  <th className="p-5 font-serif text-lg font-bold uppercase tracking-wider text-accent">The Tour Pure System</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-5 font-bold bg-muted/20">Feedback Loop</td>
                  <td className="p-5 text-muted-foreground italic">Delayed or Visual (Requires filming your swing or analyzing trackman numbers after the fact).</td>
                  <td className="p-5 font-medium border-l-2 border-accent/20">Instantaneous & Kinetic. You receive physical data the exact millisecond a mechanic breaks down.</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold bg-muted/20">Muscle Memory</td>
                  <td className="p-5 text-muted-foreground italic">Forces mechanical positions artificially, which disappears the moment you take the aid off.</td>
                  <td className="p-5 font-medium border-l-2 border-accent/20">Resistance-Based Sequencing. Trains your core musculature to naturally find and hold elite swing positions.</td>
                </tr>
                <tr>
                  <td className="p-5 font-bold bg-muted/20">Structure</td>
                  <td className="p-5 text-muted-foreground italic">A standalone tool with no direction on how, when, or why to use it to see lasting change.</td>
                  <td className="p-5 font-medium border-l-2 border-accent/20">The 13-to-3 Protocol. Guided by a step-by-step training manual designed to systematically rebuild your mechanics.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Engineering vs Guesswork */}
        <div className="space-y-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 uppercase">Engineering vs. Guesswork</h2>
            <p className="text-muted-foreground">We don’t want you chasing random tips or trying to mimic a tour pro's swing style. We want you to calibrate your own baseline.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <span className="text-5xl font-serif font-black text-accent/20">01</span>
              <h3 className="font-serif text-xl font-bold uppercase">Resistance-Driven Tempo</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Tour Pure Weighted Club uses calibrated weight distribution to naturally slow down a quick transition. It forces your upper body and lower body to sequence correctly. If you rush the downswing, the club physically resists, forcing an immediate mechanical adjustment.
              </p>
            </div>
            <div className="space-y-4">
              <span className="text-5xl font-serif font-black text-accent/20">02</span>
              <h3 className="font-serif text-xl font-bold uppercase">Complete Synchronization</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our ecosystem doesn't just look at one part of the swing. While the weighted club builds sequencing, the upcoming Feel Right Band targets absolute arm-to-body connection. The moment your arms disconnect from your torso during the rotational cycle, you get an immediate alert.
              </p>
            </div>
            <div className="space-y-4">
              <span className="text-5xl font-serif font-black text-accent/20">03</span>
              <h3 className="font-serif text-xl font-bold uppercase">A Repeatable Blueprint</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hardware is useless without a plan. The included Tour Pure Blueprint Manual takes the guesswork out of your range sessions. It provides a structured, metrics-driven regimen that ensures every single practice ball you hit is actively ingraining a connected, consistent swing.
              </p>
            </div>
          </div>
        </div>

        {/* Final Statement */}
        <div className="mt-32 p-12 bg-accent/5 border border-accent/20 text-center rounded-sm">
          <h3 className="font-serif text-2xl font-bold mb-6">The Dominus Standard</h3>
          <p className="font-sans text-lg text-foreground/80 leading-relaxed italic">
            "We don't build toys for the driving range. We engineer high-performance feedback environments for dedicated golfers who demand total control over their game."
          </p>
          <div className="mt-10">
            <Link
              to="/shop/$category"
              params={{ category: 'training-system' }}
              className="inline-block px-12 py-5 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors shadow-2xl"
            >
              Start Training
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}
