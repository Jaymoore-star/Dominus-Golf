import { Link } from '@tanstack/react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

const stats = [
  { label: 'Network', value: 'National' },
  { label: 'Focus', value: 'Technical Proficiency' },
  { label: 'System', value: 'Tour Pure Integration' },
  { label: 'Method', value: 'Range-Based diagnostic' },
];

const features = [
  {
    title: 'Gabe Salvanera',
    role: 'PGA Tour Americas Professional',
    bio: 'Specialist in technical optimization and performance. Gabe helps serious golfers refine their mechanics and practice with tour-level purpose.',
    href: '/gabe-salvanera',
  },
  {
    title: 'Leroy Bates',
    role: 'Golf Junkyz Foundation Pro',
    bio: 'Expert in swing consistency and technical proficiency. Leroy provides a structured, repeatable path to technical mastery.',
    href: '/leroy-bates',
  },
];

const packages = [
  {
    title: 'Technical Masterclass',
    duration: '1 Hour Session',
    description: 'The complete technical experience. Your pro analyzes your swing on the range, coaching in real-time on every repetition and drill.',
  },
  {
    title: 'Swing Diagnostic',
    duration: 'Single Session',
    description: 'A range-based diagnostic and planning session. Your pro evaluates your technique and builds your 90-day technical roadmap.',
  },
];

const benefits = [
  {
    title: 'Technical Precision',
    body: 'Master the mechanics that matter. Our pros focus on swing optimization, ball flight consistency, and tour-level impact positions.',
  },
  {
    title: 'Practice Structure',
    body: 'Technical proficiency is built on the range. Our pros teach you how to practice with purpose, providing structured drills that translate to elite performance.',
  },
  {
    title: 'Pressure Training',
    body: 'Simulate the pressure of competition through targeted range drills. Learn to maintain your technique under stress and build a repeatable routine.',
  },
  {
    title: '90-Day Blueprint',
    body: 'Every session ends with a personalized 90-day technical roadmap. You leave with a structured plan you can execute on your own — no full-time coach required.',
  },
];

export function PracticeWithProsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="w-full bg-[#0a0a0a] pt-24 pb-20 px-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Elite Range Training
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
            Practice with a Pro
          </h1>
          <p className="font-sans text-lg text-white/70 max-w-2xl mx-auto leading-relaxed mb-10">
            Professional-grade mentorship from Dominus Golf's national network of pros. Refine your technique,
            build tour-level mechanics, and master your practice on the range.
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
                Why Range Practice?
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
                Master Your Technique.
              </h2>
              <p className="font-sans text-sm text-white/60 leading-relaxed mb-5">
                Range lessons are invaluable for refining swing mechanics. Our pros focus on the technical aspects of your game, ensuring you build a repeatable and powerful swing.
              </p>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                Our Pros don't just watch you hit balls. They analyze your swing, provide targeted drills, and help you understand the biomechanics behind a tour-level game.
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
            {packages.map((s) => (
              <div
                key={s.title}
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
                <h3 className="font-serif text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="font-sans text-[11px] font-semibold tracking-widest uppercase text-white/30 mb-4">
                  {s.duration}
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
            {features.map((pro) => (
              <div
                key={pro.title}
                className="bg-[#141414] border border-white/10 p-7 hover:border-accent/40 transition-colors group"
              >
                {/* Photo placeholder */}
                <div className="w-16 h-16 bg-[#1e1e1e] border border-white/10 flex items-center justify-center mb-5">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
                <Link to={pro.href}>
                  <h3 className="font-serif text-xl font-bold text-white mb-1 group-hover:text-accent/90 transition-colors">
                    {pro.title}
                  </h3>
                </Link>
                <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-accent mb-4">
                  {pro.role}
                </p>
                <p className="font-sans text-sm text-white/50 leading-relaxed mb-6">{pro.bio}</p>
                <Link
                  to={pro.href}
                  className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-6 py-3 bg-accent text-white hover:bg-accent/90 transition-colors duration-200 text-center"
                >
                  View Profile &amp; Book
                </Link>
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
              <span className="font-semibold text-accent">Safety Notice:</span> All on-range sessions incorporate Tour Pure training exercises. Participants should review the{' '}
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