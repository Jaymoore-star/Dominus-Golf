import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

export function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Our Commitment
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            Built for the Long Game.
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <p className="font-sans text-base leading-relaxed text-foreground/80 mb-16">
          At Dominus, sustainability means quality. We reject the "disposable" culture of cheap plastic training aids that end up in landfills after a few months of use.
        </p>

        <div className="space-y-10">
          {[
            {
              title: 'Industrial Durability',
              body: 'Our trainers are built with high-grade materials designed to last a lifetime. When you invest in a Tour Pure system, you are investing in a tool that will outlast trends, seasons, and lesser products.',
            },
            {
              title: 'Streamlined Packaging',
              body: 'We are committed to reducing waste by using recyclable shipping materials and minimal, effective packaging. No excess. No waste. Just the product.',
            },
            {
              title: 'Buy It Once',
              body: 'Our philosophy is simple-buy a quality tool once, use it forever, and leave the course better than you found it. Every Dominus product is built with that promise.',
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-6 items-start">
              <div className="w-1 shrink-0 self-stretch bg-accent" />
              <div>
                <h3 className="font-serif font-bold text-xl text-foreground mb-2">{item.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-muted p-8 text-center">
          <p className="font-serif text-lg font-semibold text-foreground mb-1">
            "Buy a quality tool once. Use it forever."
          </p>
          <p className="font-sans text-sm text-muted-foreground">- The Dominus Philosophy</p>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}
