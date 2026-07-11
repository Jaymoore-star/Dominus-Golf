import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Award, Clock, FileText, Loader2, MapPin, Star, Users } from 'lucide-react';

const BACKEND_URL = 'https://45pi183s.backend.blink.new';

/* ─── Scroll-triggered entrance wrapper ─── */
function FadeUpSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Gold CTA Button ─── */
function GrantCTA({ className = '', onClick }: { className?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-semibold tracking-wider uppercase
        bg-[#C4952A] text-black hover:bg-[#D4A840] active:scale-[0.98]
        transition-all duration-200 ${className}`}
    >
      Apply Now <ArrowRight className="w-4 h-4" />
    </button>
  );
}

/* ─── Section divider ─── */
function Divider() {
  return <div className="w-full h-px bg-white/8" />;
}

/* ===================================================================
   STATS BAR DATA
   =================================================================== */
const STATS = [
  { value: '$5,000', label: 'Award' },
  { value: '1', label: 'Winner' },
  { value: 'Aug 15', label: 'Deadline' },
  { value: 'Aug 22', label: 'Winner Notified' },
];

/* ===================================================================
   DETAILS CARD DATA
   =================================================================== */
const DETAILS = [
  { icon: Award, label: 'Award', value: '$5,000' },
  { icon: Users, label: 'Winners', value: '1 Golfer' },
  { icon: MapPin, label: 'Open To', value: 'U.S. Residents & Territories' },
  { icon: Star, label: 'Age', value: '18+ (Juniors via Guardian)' },
  { icon: Star, label: 'Handicap', value: 'No Restriction' },
  { icon: FileText, label: 'Application', value: 'Text-Only · 5 Minutes' },
  { icon: Clock, label: 'Deadline', value: 'August 15, 2026' },
  { icon: Award, label: 'Winner Notified', value: 'August 22, 2026' },
];

/* ===================================================================
   HOW IT WORKS STEPS
   =================================================================== */
const STEPS = [
  {
    num: '01',
    title: 'Complete the Application',
    body: 'Answer 3 essay questions about your development plan, training regimen, and competitive vision.',
  },
  {
    num: '02',
    title: 'Pay $15 via Square',
    body: 'A secure, non-refundable $15.00 application fee processed by Square.',
  },
  {
    num: '03',
    title: 'Executive Review',
    body: 'All applications are screened on a 100-point rubric. Top finalists reviewed personally by the Dominus Golf Executive Team.',
  },
  {
    num: '04',
    title: 'Winner Notified Aug 22',
    body: 'One winner selected and notified August 22, 2026. $5,000 disbursed with no restrictions.',
  },
];

/* ===================================================================
   ELIGIBILITY CARDS
   =================================================================== */
const ELIGIBILITY = [
  {
    icon: MapPin,
    title: 'U.S. Residents & Territories',
    body: 'Open to all golfers residing in the United States and its territories.',
  },
  {
    icon: Star,
    title: 'All Skill Levels Welcome',
    body: 'No handicap requirement. Competitive amateurs, weekend players, college golfers, mini-tour players, and juniors all eligible.',
  },
  {
    icon: Users,
    title: 'Ages 18+ (Junior Provision)',
    body: 'Applicants must be 18+. Junior golfers encouraged - a parent or legal guardian must complete and sign the application.',
  },
];

/* ===================================================================
   FORM FIELDS
   =================================================================== */
const FORM_FIELDS = [
  {
    id: 'developmentPlan',
    label: 'Development Plan',
    placeholder: 'Describe your golf development plan. What specific areas are you working on? What goals have you set for the next 12 months?',
    maxLength: 2000,
  },
  {
    id: 'trainingRegimen',
    label: 'Training Regimen',
    placeholder: 'Detail your current training regimen. How often do you practice? What does a typical training session look like? Who do you work with?',
    maxLength: 2000,
  },
  {
    id: 'competitiveVision',
    label: 'Competitive Vision',
    placeholder: 'Share your competitive vision. What tournaments or milestones are you targeting? How will this grant accelerate your journey?',
    maxLength: 2000,
  },
];

/* ===================================================================
   PAGE COMPONENT
   =================================================================== */
export function GrantPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.25]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.97]);

  const [currentYear] = useState(() => new Date().getFullYear());

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [developmentPlan, setDevelopmentPlan] = useState('');
  const [trainingRegimen, setTrainingRegimen] = useState('');
  const [competitiveVision, setCompetitiveVision] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!name.trim() || !email.trim()) {
      setError('Please provide your name and email.');
      return;
    }
    if (!developmentPlan.trim() || !trainingRegimen.trim() || !competitiveVision.trim()) {
      setError('Please answer all three essay questions.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    // Open blank window synchronously during click (avoids popup blocker)
    const paymentWindow = window.open('', '_blank');

    try {
      const origin = window.location.origin;
      const res = await fetch(`${BACKEND_URL}/api/grant/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName: name.trim(),
          applicantEmail: email.trim(),
          developmentPlan: developmentPlan.trim(),
          trainingRegimen: trainingRegimen.trim(),
          competitiveVision: competitiveVision.trim(),
          successUrl: `${origin}/grant/success`,
          cancelUrl: `${origin}/grant`,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        paymentWindow?.close();
        setError(data.error || 'Failed to create payment link. Please try again.');
        setSubmitting(false);
        return;
      }

      // Redirect the already-opened window to Square
      if (paymentWindow) {
        paymentWindow.location.href = data.url;
      } else {
        // Fallback if popup was blocked entirely
        window.location.href = data.url;
      }
      setSubmitting(false);
    } catch (err) {
      paymentWindow?.close();
      setError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-inter overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative min-h-screen flex flex-col">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 lg:px-8 pb-20 pt-24 sm:pt-32"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block border border-[#C4952A]/40 px-4 py-1.5 mb-6 sm:mb-8"
          >
            <span className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-[#C4952A] font-inter font-medium">
              {currentYear} Application Cycle - Now Open
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center leading-[1.08] max-w-4xl tracking-tight"
          >
            Dominus Golf
            <br />
            <span className="text-[#C4952A]">Development Grant</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45 }}
            className="mt-5 sm:mt-6 text-lg sm:text-xl text-white/60 italic font-serif text-center max-w-xl"
          >
            The Feedback Your Swing Has Been Missing.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-9 sm:mt-11 flex flex-wrap items-center justify-center gap-3 sm:gap-0"
          >
            <div className="flex flex-wrap items-center justify-center gap-0 border border-white/10 bg-white/[0.03]">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex items-center gap-0 px-4 sm:px-6 py-3 sm:py-4 ${
                    i < STATS.length - 1 ? 'border-r border-white/10' : ''
                  }`}
                >
                  <span className="text-lg sm:text-xl font-bold font-serif text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="ml-2.5 text-[11px] sm:text-xs uppercase tracking-wider text-white/40 font-inter font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.8 }}
            className="mt-9 sm:mt-10"
          >
            <GrantCTA onClick={scrollToForm} />
          </motion.div>

          {/* Free gift banner */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
            className="mt-10 sm:mt-12 max-w-lg mx-auto text-center"
          >
            <div className="border border-[#C4952A]/20 bg-[#C4952A]/[0.04] px-5 py-4">
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-inter">
                Every applicant receives a free digital copy of{' '}
                <span className="text-white/80 italic">The Ultimate Guide to Master the Game</span>{' '}
                <span className="text-white/40">($14.99 value)</span> delivered to their inbox
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>

      <Divider />

      {/* ═══════════════════════════════════════════════════
          ABOUT SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            <FadeUpSection className="lg:col-span-3">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] tracking-tight">
                A $5,000 Investment in One Golfer&apos;s Future
              </h2>
              <p className="mt-6 text-base sm:text-lg text-white/55 leading-relaxed max-w-xl font-inter">
                The Dominus Golf Development Grant was created to identify a golfer with the drive,
                commitment, and vision to take their game to the next level - and give them the
                resources to do it.
              </p>
              <p className="mt-4 text-base sm:text-lg text-white/55 leading-relaxed max-w-xl font-inter">
                No restrictions on how the award is used. The $5,000 goes directly to the winner.
                One application. One winner. One opportunity.
              </p>
            </FadeUpSection>

            <FadeUpSection className="lg:col-span-2" delay={0.15}>
              <div className="border border-white/10 bg-white/[0.02] p-6 sm:p-7">
                <h3 className="font-serif text-lg font-semibold text-white mb-5 tracking-tight">
                  Grant Details
                </h3>
                <dl className="space-y-0 divide-y divide-white/6">
                  {DETAILS.map((d, i) => (
                    <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <dt className="flex items-center gap-2.5 text-xs uppercase tracking-wider text-white/35 font-inter font-medium">
                        <d.icon className="w-3.5 h-3.5 text-[#C4952A]" />
                        {d.label}
                      </dt>
                      <dd className="text-sm text-white/80 font-inter font-medium text-right">
                        {d.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </FadeUpSection>
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <FadeUpSection className="text-center mb-14 sm:mb-18">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              How It Works
            </h2>
          </FadeUpSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8">
            {STEPS.map((step, i) => (
              <FadeUpSection key={step.num} delay={i * 0.1} className="bg-[#0a0a0a]">
                <div className="p-6 sm:p-7 lg:p-8 h-full flex flex-col">
                  <span className="text-[#C4952A] text-xs tracking-[0.25em] uppercase font-inter font-semibold mb-4">
                    Step {step.num}
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-white mb-3 tracking-tight leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed mt-auto font-inter">
                    {step.body}
                  </p>
                </div>
              </FadeUpSection>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════
          ELIGIBILITY
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <FadeUpSection className="text-center mb-14 sm:mb-18">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Eligibility
            </h2>
          </FadeUpSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ELIGIBILITY.map((card, i) => (
              <FadeUpSection
                key={card.title}
                delay={i * 0.1}
                className="border border-white/10 bg-white/[0.02] p-7 sm:p-8 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center border border-[#C4952A]/30 mb-5">
                  <card.icon className="w-5 h-5 text-[#C4952A]" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-white mb-3 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed font-inter">
                  {card.body}
                </p>
              </FadeUpSection>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════
          APPLICATION FORM
          ═══════════════════════════════════════════════════ */}
      <section ref={formRef} className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6 lg:px-8" id="apply">
        <div className="max-w-3xl mx-auto">
          <FadeUpSection className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Apply Now
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/50 leading-relaxed max-w-lg mx-auto font-inter">
              Three essay questions. Five minutes. One $5,000 grant.
            </p>
            <p className="mt-2 text-sm text-[#C4952A] font-inter font-medium">
              $15.00 non-refundable application fee · Processed securely by Square
            </p>
          </FadeUpSection>

          <FadeUpSection delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-widest text-white/50 font-inter font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    disabled={submitting}
                    className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white font-inter
                      placeholder:text-white/25 focus:outline-none focus:border-[#C4952A]/60 transition-colors
                      disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-white/50 font-inter font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={submitting}
                    className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white font-inter
                      placeholder:text-white/25 focus:outline-none focus:border-[#C4952A]/60 transition-colors
                      disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Essay questions */}
              {FORM_FIELDS.map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-xs uppercase tracking-widest text-white/50 font-inter font-semibold mb-2"
                  >
                    {field.label} *
                  </label>
                  <textarea
                    id={field.id}
                    value={(field.id === 'developmentPlan' ? developmentPlan : field.id === 'trainingRegimen' ? trainingRegimen : competitiveVision)}
                    onChange={(e) => {
                      if (field.id === 'developmentPlan') setDevelopmentPlan(e.target.value);
                      else if (field.id === 'trainingRegimen') setTrainingRegimen(e.target.value);
                      else setCompetitiveVision(e.target.value);
                    }}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    rows={6}
                    required
                    disabled={submitting}
                    className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white font-inter
                      placeholder:text-white/25 focus:outline-none focus:border-[#C4952A]/60 transition-colors
                      resize-y min-h-[140px] disabled:opacity-50"
                  />
                  <p className="text-right text-[10px] text-white/25 mt-1 font-inter">
                    {field.id === 'developmentPlan'
                      ? developmentPlan.length
                      : field.id === 'trainingRegimen'
                        ? trainingRegimen.length
                        : competitiveVision.length}
                    /{field.maxLength}
                  </p>
                </div>
              ))}

              {/* Error */}
              {error && (
                <div className="border border-red-500/30 bg-red-500/[0.06] px-4 py-3">
                  <p className="text-sm text-red-400 font-inter">{error}</p>
                </div>
              )}

              {/* Submit */}
              <div className="flex flex-col items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2.5 px-10 py-4 text-sm font-semibold tracking-wider uppercase
                    bg-[#C4952A] text-black hover:bg-[#D4A840] active:scale-[0.98]
                    transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Payment Link...
                    </>
                  ) : (
                    <>
                      Pay $15 with Square <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <div className="flex items-center gap-2 text-[10px] text-white/25 font-inter">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Secure payment via Square
                </div>
              </div>
            </form>
          </FadeUpSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          GOLD QUOTE SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6 lg:px-8 bg-[#C4952A]">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUpSection>
            <blockquote>
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl italic text-black leading-[1.25]">
                &ldquo;Excellence Recognized. Development Funded.&rdquo;
              </p>
            </blockquote>
            <p className="mt-6 text-sm text-black/60 tracking-wide uppercase font-inter font-medium">
              - Jay Moore, Founder &amp; CEO, Dominus Golf
            </p>
          </FadeUpSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER LEGAL
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUpSection>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Your Game. Your Grant.
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/50 leading-relaxed max-w-lg mx-auto font-inter">
              Text-only application. Takes 5 minutes. Closes August 15, 2026. One golfer will be
              selected. One award will be made.
            </p>
            <div className="mt-9">
              <GrantCTA onClick={scrollToForm} />
            </div>
          </FadeUpSection>

          <FadeUpSection delay={0.2} className="mt-14">
            <p className="text-[11px] sm:text-xs text-white/20 leading-relaxed max-w-2xl mx-auto font-inter">
              Void where prohibited. Open to U.S. residents and territories, all skill levels, ages
              18+ or minors via parental submission. Grant funds ($5,000) are paid out directly to
              the recipient. The $15.00 application fee is strictly non-refundable. Free copy of{' '}
              <span className="italic">The Ultimate Guide to Master the Game</span> ($14.99 retail
              value) delivered digitally upon payment confirmation while promotional supplies last.
              Dominus Golf reserves the right to make the final determination of all award
              recipients.
            </p>
          </FadeUpSection>
        </div>
      </section>
    </div>
  );
}
