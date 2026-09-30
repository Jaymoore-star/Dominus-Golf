import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

/**
 * Tour Pure Laser Path Trainer content, from Jay's product brief (30 Sep 2026):
 * the "See It, Feel It, Build It" concept, a safety note, and the way back to
 * the trainers it fits. Specs live in the product data and render in the
 * accordion, so they are not repeated here.
 *
 * The safety note is not optional copy. The unit is a Class 2/3R laser with a
 * DANGER label, and the Tour Pure Jr is sold to children.
 */

const STEPS = [
  {
    word: 'See It',
    text: 'Watch the red laser line trace your backswing and downswing paths on the mat in real time.',
  },
  {
    word: 'Feel It',
    text: 'Practice with the exact weight and feel of your weighted Tour Pure handle.',
  },
  {
    word: 'Build It',
    text: 'Muscle memory repetition turns accurate visual feedback into a consistent golf swing.',
  },
];

export function LaserOverview() {
  return (
    <div className="mt-20 space-y-20">
      <section className="border-y border-border bg-muted/40 py-16 sm:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="font-sans text-[11px] font-semibold tracking-[0.4em] uppercase text-accent mb-4">
            Tour Pure Laser Path Trainer
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight max-w-3xl">
            Master your swing plane with real-time laser feedback.
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <article key={step.word} className="border border-border bg-card p-7">
                <p className="font-sans text-[11px] font-semibold tracking-[0.3em] uppercase text-accent">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-serif text-2xl font-bold text-foreground">{step.word}</h3>
                <p className="mt-3 font-sans text-sm text-muted-foreground leading-relaxed">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-accent/30 bg-accent/5 p-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Built for Tour Pure</h2>
          <p className="font-sans text-base text-muted-foreground leading-relaxed mb-6">
            Fits the Men's, Women's and Junior trainers, left- or right-handed. Get the laser on its own, or save with
            the Pro Path Bundle: a Tour Pure trainer, the laser and the free 90-day guide.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/product/$id"
              params={{ id: 'tour-pure-pro-path-bundle-men' }}
              className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-xs tracking-widest uppercase px-6 py-3.5 bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
            >
              See the bundle
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop/$category"
              params={{ category: 'training-system' }}
              className="inline-flex items-center justify-center font-sans font-semibold text-xs tracking-widest uppercase px-6 py-3.5 border border-border text-foreground hover:border-accent hover:text-accent transition-colors duration-200"
            >
              Shop Tour Pure
            </Link>
          </div>
        </div>

        <div className="border-l-4 border-accent bg-muted p-8">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Laser safety</h2>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            This is a Class 2/3R laser product. Never look into the beam or point it at anyone's eyes, including pets.
            Junior golfers should use it only with adult supervision. Read the full{' '}
            <Link to="/safety-disclaimer" className="text-accent hover:underline">
              safety guidance
            </Link>{' '}
            before your first session.
          </p>
        </div>
      </section>
    </div>
  );
}
