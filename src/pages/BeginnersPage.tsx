import { Link } from '@tanstack/react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

const steps = [
  {
    number: '01',
    title: 'Start with the Fundamentals',
    body: `Before you think about distance, think about control. The biggest mistake beginners make is trying to swing hard. Slow, controlled repetitions with the Tour Pure system build the muscle memory that creates a repeatable, consistent swing.`,
  },
  {
    number: '02',
    title: 'Train Swing Path First',
    body: `Your swing path determines everything - ball flight, spin, and direction. The Tour Pure weighted trainer forces your body to feel the correct path through impact. Train 10-15 minutes daily at 50-60% swing speed. Feel the club tracking on plane.`,
  },
  {
    number: '03',
    title: 'Build Tempo, Not Power',
    body: `Power is a by-product of tempo. Tempo is the rhythm of your swing - the pace from takeaway to follow-through. Golfers who prioritize tempo over power consistently outperform those who try to muscle the ball. Use Tour Pure to develop a smooth, rhythmic motion.`,
  },
  {
    number: '04',
    title: 'Take Your Training Further',
    body: `Once your swing path and tempo feel consistent, start integrating advanced feedback-based drills. Move beyond the basics and start focusing on specific performance outcomes to build a swing that lasts.`,
  },
];

const myths = [
  {
    myth: '"I need to swing harder to hit farther."',
    truth: 'Speed comes from proper sequencing and centrifugal force - not brute strength. Train the path first.',
  },
  {
    myth: '"Standard range lessons will fix my game."',
    truth: 'Range practice builds mechanics. Technical instruction builds consistency. You need both.',
  },
  {
    myth: '"Training aids are just gimmicks."',
    truth: 'The right training aid trains movement patterns. Tour Pure does exactly that - weighted repetitions that transfer.',
  },
  {
    myth: '"I need expensive equipment to improve."',
    truth: 'A $59.99 Tour Pure system and 15 minutes a day will do more for your game than a $500 driver.',
  },
];

export function BeginnersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="bg-muted py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            New to Golf
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-6">
            The Beginner's Guide<br />to Dominus Golf
          </h1>
          <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            You don't need to spend thousands to get better. You need the right system, the right fundamentals, and 15 minutes a day.
          </p>
        </div>
      </section>

      {/* 4 Steps */}
      <section className="w-full bg-background border-b border-border py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              The Path
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              How to Get Started
            </h2>
          </div>

          <div className="space-y-0 divide-y divide-border border border-border">
            {steps.map((s) => (
              <div key={s.number} className="flex gap-8 p-8 hover:bg-muted transition-colors">
                <span className="font-sans text-[13px] font-semibold tracking-widest text-accent shrink-0 w-8">
                  {s.number}
                </span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-3">{s.title}</h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Myth Busting */}
      <section className="w-full bg-muted border-b border-border py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              Common Mistakes
            </p>
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Golf Myths - Debunked
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {myths.map((m) => (
              <div key={m.myth} className="bg-background border border-border p-7 hover:border-accent/30 transition-colors">
                <p className="font-serif text-base font-semibold text-muted-foreground italic mb-4">{m.myth}</p>
                <div className="w-8 h-px bg-accent mb-4" />
                {/* The truth outranked the myth in the dark theme (white/70 over
                    white/50). Both mapped to muted-foreground, so it takes the
                    stronger token back to keep that order. */}
                <p className="font-sans text-sm text-foreground leading-relaxed">{m.truth}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety note */}
      <section className="w-full bg-background border-b border-border py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 bg-accent/10 border border-accent/20 p-6">
            <span className="text-accent text-lg shrink-0 mt-0.5">⚠</span>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-accent">Safety First:</span> Always use Tour Pure at 50-75% of maximum swing speed. Warm up before every session. Read the full{' '}
              <Link to="/safety-disclaimer" className="text-accent hover:underline">
                Safety Disclaimer
              </Link>{' '}
              before your first use.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-muted py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Ready to Begin?
          </p>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-5">
            Your First Step Starts Here
          </h2>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto">
            Pick up the Tour Pure Men's or Women's trainer and start building the swing that holds up when it counts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/product/$id"
              params={{ id: 'tour-pure-men' }}
              className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-10 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-200"
            >
              Shop Tour Pure Men
            </Link>
            <Link
              to="/product/$id"
              params={{ id: 'tour-pure-women' }}
              className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-10 py-4 border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors duration-200"
            >
              Shop Tour Pure Women
            </Link>
          </div>

          {/* This page is written for someone searching "golf training aid for
              beginners", and the next thing they need is the method, not another
              product. It previously linked to neither guide. */}
          <p className="font-sans text-sm text-muted-foreground leading-relaxed mt-8">
            Not sure how to train with it yet? Start with the{' '}
            <Link to="/tour-pure-guide" className="text-accent hover:underline">
              Tour Pure training guide
            </Link>{' '}
            or the{' '}
            <Link to="/feel-right-band-guide" className="text-accent hover:underline">
              Feel Rite Band guide
            </Link>
            .
          </p>
        </div>
      </section>

      <Footer />
      <CartDrawer />
    </div>
  );
}
