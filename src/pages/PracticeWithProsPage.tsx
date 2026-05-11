import { Link } from '@tanstack/react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

const benefits = [
  {
    title: 'Real-World Lies',
    body: 'No two shots on a golf course are the same. Our pros coach you through uneven lies, tight fairways, and awkward stances — conditions the range can never replicate.',
  },
  {
    title: 'Course Management',
    body: 'Scoring isn\'t just about swing mechanics. Our pros teach you when to attack, when to lay up, how to read greens, and how to manage your game from the first tee to the 18th hole.',
  },
  {
    title: 'Pressure Performance',
    body: 'Playing with a pro simulates the mental pressure of competition. You learn how to breathe through difficult shots, reset after bad holes, and carry your practice into real rounds.',
  },
  {
    title: '90-Day Blueprint',
    body: 'Every session ends with a personalised 90-day improvement roadmap. You leave with a structured plan you can execute on your own — no full-time coach required.',
  },
];

const pros = [
  {
    name: 'Gabe Salvanera',
    title: 'PGA Tour Americas · Grass League',
    bio: 'Specialist in on-course strategy and tournament performance. Gabe helps serious golfers think, manage, and compete like a tour pro.',
    href: '/gabe-salvanera',
  },
  {
    name: 'Leroy Bates',
    title: 'Golf Junkyz Foundation · First Tee',
    bio: 'Expert in consistency and the 90-Day On-Course Blueprint. Leroy builds repeatable habits that lower scores for everyday golfers.',
    href: '/leroy-bates',
  },
];

const sessionFormats = [
  {
    format: 'Full Round (18 Holes)',
    time: 'Approx. 4–5 hours',
    description: 'The complete on-course experience. Your pro plays alongside you for all 18 holes, coaching in real-time on every shot, lie, and decision.',
    featured: true,
  },
  {
    format: 'Half Round (9 Holes)',
    time: 'Approx. 2–3 hours',
    description: 'A focused session on the front or back nine. Great for targeting a specific area of your game — scoring, short game, or mental strategy.',
    featured: false,
  },
  {
    format: '90-Day Blueprint Consult',
    time: 'Approx. 2 hours',
    description: 'An on-course diagnostic and planning session. No full round — your pro evaluates your game and builds your 90-day improvement roadmap.',
    featured: false,
  },
];

export function PracticeWithProsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="w-full bg-[#0a0a0a] pt-24 pb-20 px-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-5">
            On-Course Coaching
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-7">
            Practice With<br />the Pros
          </h1>
          <p className="font-sans text-base text-white/60 leading-relaxed max-w-xl mx-auto mb-10">
            Range lessons fix swings. On-course sessions fix scores. Play alongside a Dominus Golf Pro and transform the way you think about, manage, and score the game.
          </p>
          <a
            href="#book"
            className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-12 py-4 bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
          >
            Book a Session
          </a>
        </div>
      </section>

      {/* Why On-Course */}
      <section className="w-full bg-[#0e0e0e] border-b border-white/10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            <div>
              <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
                Why On-Course?
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
                Range Practice Has Limits.
              </h2>
              <p className="font-sans text-sm text-white/60 leading-relaxed mb-5">
                Range lessons are valuable for mechanics. But they can't simulate the decisions, lies, and mental pressure of an actual round. That's where our on-course coaching program changes everything.
              </p>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                Our Pros don't stand on a mat and watch you hit balls. They walk the course with you, coach every shot in real-time, and give you a 90-day blueprint to keep improving long after the session is over.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((b) => (
                <div key={b.title} className="flex gap-5 items-start">
                  <div className="w-1.5 h-1.5 bg-accent mt-2 shrink-0" />
                  <div>
                    <h3 className="font-sans text-sm font-semibold text-white mb-1">{b.title}</h3>
                    <p className="font-sans text-sm text-white/50 leading-relaxed">{b.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Session Formats */}
      <section className="w-full bg-[#111] border-b border-white/10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              Session Types
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Choose Your Format
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sessionFormats.map((s) => (
              <div
                key={s.format}
                className={`p-7 flex flex-col ${
                  s.featured
                    ? 'bg-[#1a1a1a] border-2 border-accent'
                    : 'bg-[#141414] border border-white/10 hover:border-accent/30 transition-colors'
                }`}
              >
                {s.featured && (
                  <span className="font-sans text-[10px] font-semibold tracking-widest uppercase text-accent mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="font-serif text-xl font-bold text-white mb-2">{s.format}</h3>
                <p className="font-sans text-[11px] font-semibold tracking-widest uppercase text-white/30 mb-4">
                  {s.time}
                </p>
                <p className="font-sans text-sm text-white/55 leading-relaxed flex-1">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Pros */}
      <section id="book" className="w-full bg-[#0e0e0e] border-b border-white/10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              Our Coaches
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Meet the Pros
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pros.map((pro) => (
              <div
                key={pro.name}
                className="bg-[#141414] border border-white/10 p-7 hover:border-accent/40 transition-colors group"
              >
                {/* Photo placeholder */}
                <div className="w-16 h-16 bg-[#1e1e1e] border border-white/10 flex items-center justify-center mb-5">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-1 group-hover:text-accent/90 transition-colors">
                  {pro.name}
                </h3>
                <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-accent mb-4">
                  {pro.title}
                </p>
                <p className="font-sans text-sm text-white/50 leading-relaxed mb-6">{pro.bio}</p>
                <a
                  href={pro.href}
                  className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-6 py-3 bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
                >
                  View Profile &amp; Book
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Note */}
      <section className="w-full bg-[#0a0a0a] border-b border-white/10 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 bg-accent/5 border border-accent/20 p-6">
            <span className="text-accent text-lg shrink-0 mt-0.5">⚠</span>
            <p className="font-sans text-sm text-white/70 leading-relaxed">
              <span className="font-semibold text-accent">Safety Notice:</span> All on-course sessions incorporate Tour Pure training exercises. Participants should review the{' '}
              <Link to="/safety-disclaimer" className="text-accent hover:underline">
                Safety Disclaimer
              </Link>{' '}
              before their session.
            </p>
          </div>
        </div>
      </section>

      {/* Back nav */}
      <section className="w-full bg-[#0a0a0a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            to="/"
            className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-8 py-3 border border-white/20 text-white/60 hover:border-white hover:text-white transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </section>

      <Footer />
      <CartDrawer />
    </div>
  );
}
