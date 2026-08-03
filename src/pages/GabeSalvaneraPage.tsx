import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

const stats = [
  { label: 'Tour', value: 'PGA Tour Americas' },
  { label: 'League', value: 'Grass League' },
  { label: 'Specialty', value: 'Swing Mechanics' },
  { label: 'Focus', value: 'Performance Optimization' },
];

const credentials = [
  'PGA Tour Americas competitor',
  'Grass League professional',
  'Certified performance Pro',
  'Specialist in swing optimization and practice structure',
];

const sessionTypes = [
  {
    title: 'Full Swing',
    duration: '1 hour',
    description:
      'Pro will be hitting balls on the range. Golfers will have to pay for their golf balls on the range. Gabe provides real-time feedback on your swing mechanics, ball flight, and practice habits.',
  },
  {
    title: 'Putting',
    duration: '1 hour',
    description: 'Elite putting instruction focusing on path, tempo, and green reading.',
  },
  {
    title: 'Pitch & Chip',
    duration: '1 hour',
    description: 'Refine your short game with professional techniques for chipping and pitching.',
  },
];

export function GabeSalvaneraPage() {
  useEffect(() => {
    // Inject Acuity stylesheet
    const styleId = 'acuity-button-styles';
    if (!document.getElementById(styleId)) {
      const link = document.createElement('link');
      link.id = styleId;
      link.rel = 'stylesheet';
      link.href = 'https://embed.acuityscheduling.com/embed/button/39236931.css';
      document.head.appendChild(link);
    }
    // Inject Acuity script
    const scriptId = 'acuity-button-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://embed.acuityscheduling.com/embed/button/39236931.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="w-full bg-muted pt-24 pb-0 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-end">

              {/* Text side */}
              <div className="py-12 lg:py-20 lg:pr-16">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-8">
                  <Link
                    to="/"
                    className="font-sans text-[11px] text-muted-foreground hover:text-foreground tracking-widest uppercase transition-colors"
                  >
                    Home
                  </Link>
                  <span className="text-muted-foreground text-[11px]">/</span>
                  <span className="font-sans text-[11px] text-accent tracking-widest uppercase">
                    Pro Directory
                  </span>
                </div>

                <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
                  PGA Tour Americas · Grass League
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                  Gabe<br />Salvanera
                </h1>
                <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-lg mb-10">
                  Gabe Salvanera is a PGA Tour Americas and Grass League professional who has built his
                  reputation on elite swing mechanics and performance optimization. His
                  sessions focus on building tour-level habits on the range that translate directly to
                  better ball striking and lower scores.
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-6 mb-10">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-1">
                        {s.label}
                      </p>
                      <p className="font-sans text-sm font-semibold text-foreground">{s.value}</p>
                    </div>
                  ))}
                </div>

                <a
                  href="#book"
                  className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-10 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-200"
                >
                  Book a Session
                </a>
              </div>

              {/* Photo side */}
              <div className="relative flex items-end justify-center lg:justify-end min-h-[380px] lg:min-h-[580px]">
                <div className="w-full max-w-[420px] lg:max-w-full h-[380px] lg:h-[580px] bg-background border border-border flex items-center justify-center relative overflow-hidden">
                  <img
                    src="/images/GabeSand__d54af4a2.webp"
                    alt="Gabe Salvanera"
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Accent corner */}
                  <div className="absolute bottom-0 left-0 w-16 h-[3px] bg-accent" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="w-full bg-background border-b border-border py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-5">
                  Credentials
                </p>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                  Professional Experience
                </h2>
                <ul className="space-y-4">
                  {credentials.map((c) => (
                    <li key={c} className="flex items-start gap-4">
                      <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      <span className="font-sans text-sm text-muted-foreground leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-muted border border-border p-8">
                <p className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-accent mb-4">
                  Instructional Philosophy
                </p>
                <blockquote className="font-serif text-xl text-foreground leading-relaxed italic">
                  "Range practice builds mechanics. Focused range sessions build golfers. I help you
                  optimize your swing, manage your practice time, and turn your repetitions into results."
                </blockquote>
                <p className="font-sans text-sm text-muted-foreground mt-6">- Gabe Salvanera</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sessions */}
        <section id="book" className="w-full bg-muted border-b border-border py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
                Book a Session
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Train with Gabe
              </h2>
              <p className="font-sans text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Choose the session format that fits your goals. All sessions are conducted on the range.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {sessionTypes.map((s) => (
                <div
                  key={s.title}
                  className="bg-background border border-border p-7 hover:border-accent/40 transition-colors duration-300 group"
                >
                  <p className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-accent mb-3">
                    {s.duration}
                  </p>
                  <h3 className="font-serif text-lg font-bold text-foreground mb-3 group-hover:text-accent/90 transition-colors">
                    {s.title}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>

            {/* Booking CTA */}
            <div className="bg-background border border-border p-8 sm:p-12 text-center">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                Ready to Practice with a Pro?
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
                Contact Gabe directly to check availability, discuss your goals, and schedule your
                on-range session.
              </p>
              <a
                href="https://app.acuityscheduling.com/schedule.php?owner=39236931&calendarID=14047266&ref=booking_button"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-12 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-200"
              >
                Schedule Appointment
              </a>
            </div>
          </div>
        </section>

        {/* Back to directory */}
        <section className="w-full bg-background py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link
              to="/"
              className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-8 py-3 border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors duration-200"
            >
              ← Back to Pro Directory
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}