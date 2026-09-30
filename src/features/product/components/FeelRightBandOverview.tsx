import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

/**
 * Feel Right Band content, rewritten 2026-09-30 from the Feel Right Band
 * product-page mockup. Replaces the earlier "floatie drill" copy, which named a
 * tour professional and described a single trail-arm position.
 *
 * `variant` - see the long note on TourPureOverview. This block renders on
 * /product/feel-right-band ('summary') and /feel-right-band-guide ('full'),
 * and the two should not carry the same text.
 *
 *   'summary' - the problem, the checks, and how it pairs with Tour Pure.
 *   'full'    - the checks, the setup method and the closing CTA.
 *
 * The checks are the only section on both URLs - they are the product.
 *
 * TO FINISH THE ELBOW CHECK: fill in `title` and `body` on the elbow entry
 * below. Until both are set it stays off the live site and the heading reads
 * "One band. Three checks." Once it's filled, the heading updates on its own.
 *
 * PHOTOS: set `image` on any check (a /images/... path) and it renders above
 * that card. Leave it unset and the card shows no photo slot.
 */

type Check = {
  number: string;
  where: string;
  title: string | null;
  body: { label?: string; text: string }[] | null;
  image?: string;
  imageAlt?: string;
};

const CHECKS: Check[] = [
  {
    number: '01',
    where: 'Under the arm',
    title: 'Connection',
    body: [
      {
        label: 'Strapped:',
        text: 'high on the upper arm, touching the side of your chest. Lose that contact and your arm came off your body. It stays on, so you can hit balls with it.',
      },
      {
        label: 'Tucked:',
        text: 'under the arm like a towel, for slow practice swings. If it drops early, you disconnected.',
      },
    ],
  },
  {
    number: '02',
    where: 'Forearm',
    title: 'Visual Reference',
    body: [
      {
        text: 'Wear it on the forearm with the Dominus logo pointed at your target. That logo is your reference line - check it at address and through the swing. Hit balls with it on.',
      },
    ],
  },
  {
    number: '03',
    where: 'Wrist',
    title: 'Cupped or Bowed',
    body: [
      {
        text: 'On the wrist, the band shows you whether the wrist is cupping or bowing. You see the fault instead of guessing at it.',
      },
      {
        label: 'Put it on:',
        text: 'logo on the wrist, the longer part of the strap around the thumb.',
      },
    ],
  },
  {
    number: '04',
    where: 'Elbow',
    // Pending final copy: which elbow, what the golfer feels or sees, and the fault it fixes.
    title: null,
    body: null,
  },
];

const SETUP_STEPS = [
  'Pick the fault you’re working on and slide the band to that spot - under the arm, forearm, wrist or elbow.',
  'Turn the band so the Dominus logo points at your target. Snug, not tight.',
  'Make slow rehearsal swings first. Feel the position, check the band.',
  'Then hit balls with it on. Reps are the unit - build to 100 a day.',
];

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[11px] font-semibold tracking-[0.4em] uppercase text-accent mb-4">
      {children}
    </p>
  );
}

function ChecksSection({ checks }: { checks: Check[] }) {
  const count = NUMBER_WORDS[checks.length] ?? String(checks.length);
  const gridCols = checks.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

  return (
    <section id="checks" className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <Eyebrow>Where to wear it</Eyebrow>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            One band. {count} checks.
          </h2>
        </div>
        <p className="font-sans text-base text-muted-foreground leading-relaxed md:max-w-sm">
          Move the band and you change what it checks. Pick the fault you’re working on and wear it there.
        </p>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-6`}>
        {checks.map((check, i) => (
          <article key={check.number} className="flex flex-col border border-border bg-card">
            {check.image && (
              <img
                src={check.image}
                alt={check.imageAlt ?? `Feel Right Band worn at the ${check.where.toLowerCase()}`}
                loading="lazy"
                className="w-full aspect-[4/3] object-cover border-b border-border"
              />
            )}
            <div className="p-7 flex flex-col gap-4">
              <p className="font-sans text-[11px] font-semibold tracking-[0.3em] uppercase text-accent">
                {String(i + 1).padStart(2, '0')} · {check.where}
              </p>
              <h3 className="font-serif text-2xl font-bold text-foreground">{check.title}</h3>
              {check.body?.map((para, j) => (
                <p key={j} className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {para.label && <strong className="text-foreground font-semibold">{para.label} </strong>}
                  {para.text}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FeelRightBandOverview({ variant = 'full' }: { variant?: 'full' | 'summary' } = {}) {
  const liveChecks = CHECKS.filter((c) => c.title && c.body && c.body.length > 0);

  if (variant === 'summary') {
    return (
      <div className="mt-20 space-y-24">
        {/* The problem */}
        <section id="overview" className="border-y border-border bg-muted/40 py-16 sm:py-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-center">
            <div>
              <Eyebrow>Feel Right Band</Eyebrow>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Feel the position.
                <br />
                See the fault.
              </h2>
            </div>
            <div className="space-y-5 font-sans text-lg leading-relaxed text-muted-foreground">
              <h3 className="font-serif text-2xl font-bold text-foreground">You can’t watch your own swing.</h3>
              <p>
                You make a swing that feels right, and the ball tells you it wasn’t. We have both been there. The
                problem isn’t effort - it’s that you have no reference for where your arms, wrists and elbows
                actually are in the swing.
              </p>
              <p className="text-foreground">
                The Feel Right Band gives you that reference. Wear it. Swing. The band tells you what your eyes
                can’t.
              </p>
            </div>
          </div>
        </section>

        <ChecksSection checks={liveChecks} />

        {/* Pairs with Tour Pure */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="border border-accent/30 bg-accent/5 p-8 sm:p-12">
            <Eyebrow>Built to work with Tour Pure</Eyebrow>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-5 max-w-3xl">
              Train the position. Take the feel to the range.
            </h2>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Tour Pure builds the positions at slow speed. The Feel Right Band keeps that feel on your body when
              you pick up a real club and hit real balls.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop/$category"
                params={{ category: 'training-system' }}
                className="inline-flex items-center justify-center gap-2 font-sans font-semibold text-sm tracking-widest uppercase px-8 py-4 bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
              >
                Shop Tour Pure systems
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/tour-pure-guide"
                className="inline-flex items-center justify-center font-sans font-semibold text-sm tracking-widest uppercase px-8 py-4 border border-border text-foreground hover:border-accent hover:text-accent transition-colors duration-200"
              >
                How Tour Pure works
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mt-16 space-y-24">
      <ChecksSection checks={liveChecks} />

      {/* Setup */}
      <section id="methodology" className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[4fr_7fr] gap-10 lg:gap-16">
          <div>
            <Eyebrow>Setup</Eyebrow>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-5">Logo to the target.</h2>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed">
              Every position starts the same way. Get this right and the band reads true.
            </p>
          </div>
          <ol className="divide-y divide-border border-y border-border">
            {SETUP_STEPS.map((step, i) => (
              <li key={i} className="flex gap-6 sm:gap-8 py-6">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-accent w-10 flex-shrink-0 leading-none">
                  {i + 1}
                </span>
                <span className="font-sans text-base sm:text-lg text-foreground/90 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="text-center py-16 border-t border-border">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-8 leading-tight">
          Stop guessing.
          <br />
          Feel it right.
        </h2>
        <Link
          to="/product/$id"
          params={{ id: 'feel-right-band' }}
          className="inline-flex items-center gap-2 font-sans font-semibold text-sm tracking-widest uppercase px-10 py-4 bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
        >
          Get the Feel Right Band
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="mt-10 font-sans text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground">
          Refuse to lose, dominate the competition.
        </p>
      </section>
    </div>
  );
}
