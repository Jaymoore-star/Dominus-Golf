import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowRight as ArrowRightIcon, Award, Check, Clock, FileText, Loader2, MapPin, Star, Trophy, Users } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

const HUBSPOT_PORTAL_ID = '246543983';
const HUBSPOT_FORM_ID = '084f3e9c-31da-4700-a691-592e947cf4b7';
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
        btn-gold active:scale-[0.98] transition-all duration-200 ${className}`}
    >
      Apply Now <ArrowRightIcon className="w-4 h-4" />
    </button>
  );
}

/* ─── Section divider ─── */
function Divider() {
  return <div className="w-full h-px bg-border" />;
}

/* ─── Progress bar for form steps ─── */
function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2 flex-1 last:flex-[0_0_auto]">
          <div
            className={`w-8 h-8 flex items-center justify-center text-xs font-sans font-semibold border transition-colors
              ${i < current ? 'bg-accent border-accent text-accent-foreground' : 
                i === current ? 'border-accent text-accent bg-background' : 
                'border-border text-muted-foreground bg-background'}`}
          >
            {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`flex-1 h-px ${i < current ? 'bg-accent' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );
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
  { icon: Star, label: 'Age', value: 'All Ages Welcome' },
  { icon: Trophy, label: 'Junior Golfers', value: 'Via Parent/Guardian' },
  { icon: FileText, label: 'Application', value: 'Text-Only · 5 Minutes' },
  { icon: Clock, label: 'Deadline', value: 'August 15, 2026' },
  { icon: Award, label: 'Winner Notified', value: 'August 22, 2026' },
];

/* ===================================================================
   HOW IT WORKS STEPS
   =================================================================== */
const STEPS = [
  { num: '01', title: 'Complete the Application', body: 'Answer essay questions about your development plan, training regimen, and competitive vision.' },
  { num: '02', title: 'Proceed to Payment', body: 'A non-refundable application fee secures your submission. Your free PDF guide is delivered to your inbox instantly.' },
  { num: '03', title: 'Selection', body: 'One recipient will be selected based on merit, drive, and the strength of their vision.' },
  { num: '04', title: 'Winner Notified Aug 22', body: 'One winner is selected and notified directly on August 22, 2026. The $5,000 award is disbursed with no restrictions on use.' },
];

/* ===================================================================
   ELIGIBILITY CARDS
   =================================================================== */
const ELIGIBILITY = [
  { icon: MapPin, title: 'U.S. Residents & Territories', body: 'Open to all golfers residing in the United States and its territories. No geographic restrictions within the U.S.' },
  { icon: Star, title: 'All Skill Levels Welcome', body: 'No handicap requirement. Competitive amateurs, weekend players, college golfers, mini-tour players, and juniors — all eligible.' },
  { icon: Users, title: 'Junior Golfers Welcome', body: 'Junior golfers are encouraged to apply. A parent or legal guardian must complete and submit the application on their behalf.' },
];

/* ===================================================================
   AGE GROUP OPTIONS
   =================================================================== */
const AGE_GROUPS = ['Under 18', '18-24', '25-34', '35+'];

/* ===================================================================
   PAGE COMPONENT
   =================================================================== */
export function GrantPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.25]);
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.97]);

  const [currentYear] = useState(() => new Date().getFullYear());

  // Form state — multi-step
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  // Step 1: Player Profile
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [city, setCity] = useState('');
  const [currentHandicap, setCurrentHandicap] = useState('');
  const [targetHandicap, setTargetHandicap] = useState('');

  // Step 2: Essays
  const [roadmap, setRoadmap] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [vision, setVision] = useState('');
  const [connection, setConnection] = useState('');

  // Step 3: Junior Provision
  const [guardianName, setGuardianName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const validateStep1 = (): boolean => {
    if (!firstName.trim()) { setError('First name is required.'); return false; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('A valid email is required.'); return false; }
    if (!ageGroup) { setError('Please select your age group.'); return false; }
    if (!stateRegion.trim()) { setError('State/Region is required.'); return false; }
    if (!city.trim()) { setError('City is required.'); return false; }
    if (!currentHandicap.trim()) { setError('Current handicap is required.'); return false; }
    setError(null);
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!roadmap.trim()) { setError('Grant Essay Roadmap is required.'); return false; }
    if (!discipline.trim()) { setError('Grant Essay Discipline is required.'); return false; }
    if (!vision.trim()) { setError('Grant Essay Vision is required.'); return false; }
    if (!connection.trim()) { setError('Grant Essay Connection is required.'); return false; }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    if (step === 1 && !validateStep2()) return;
    setStep(step + 1);
    setError(null);
  };

  const handlePrev = () => {
    setStep(step - 1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Step 1 validation
    if (!firstName.trim() || !email.trim() || !ageGroup || !stateRegion.trim() || !city.trim() || !currentHandicap.trim()) {
      setError('Please complete all required fields in Section 1.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Step 2 validation
    if (!roadmap.trim() || !discipline.trim() || !vision.trim() || !connection.trim()) {
      setError('Please complete all essay questions.');
      return;
    }

    setSubmitting(true);

    // Open Square payment window
    const paymentWindow = window.open('', '_blank');

    try {
      // 1. Submit to HubSpot
      const hubspotRes = await fetch(
        `https://forms-na2.hsforms.com/submissions/v3/public/submit/formsnext/multipart/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: [
              { name: 'firstname', value: firstName.trim() },
              { name: 'lastname', value: lastName.trim() },
              { name: 'email', value: email.trim() },
              { name: 'age_group', value: ageGroup },
              { name: 'state', value: stateRegion.trim() },
              { name: 'city', value: city.trim() },
              { name: 'current_handicap', value: currentHandicap.trim() },
              { name: 'target_handicap_milestones', value: targetHandicap.trim() },
              { name: 'grant_essay_roadmap', value: roadmap.trim() },
              { name: 'grant_essay_discipline', value: discipline.trim() },
              { name: 'grant_essay_vision', value: vision.trim() },
              { name: 'essay_connection', value: connection.trim() },
              { name: 'guardian_name', value: guardianName.trim() },
              { name: 'guardian_email', value: guardianEmail.trim() },
            ],
            context: {
              pageUri: window.location.href,
              pageName: 'Dominus Golf Development Grant — Application',
            },
          }),
        }
      );

      if (!hubspotRes.ok) {
        const hubErr = await hubspotRes.json();
        console.error('HubSpot error:', hubErr);
        const hsErrors = hubErr?.errors || [];
        const errMsg = hsErrors[0]?.message || 'Failed to submit application.';
        paymentWindow?.close();
        setError(errMsg);
        setSubmitting(false);
        return;
      }

      // 2. HubSpot submitted successfully — now create Square payment link
      const origin = window.location.origin;
      const squareRes = await fetch(`${BACKEND_URL}/api/grant/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName: `${firstName.trim()} ${lastName.trim()}`,
          applicantEmail: email.trim(),
          developmentPlan: roadmap.trim(),
          trainingRegimen: discipline.trim(),
          competitiveVision: vision.trim(),
          successUrl: `${origin}/grant/success`,
          cancelUrl: `${origin}/grant`,
        }),
      });

      const squareData = await squareRes.json();

      if (!squareRes.ok || squareData.error) {
        paymentWindow?.close();
        // HubSpot submission succeeded but Square failed — still show error
        setError(squareData.error || 'Payment link creation failed. Your application was submitted but payment could not be processed. Please contact us.');
        setSubmitting(false);
        return;
      }

      // 3. Redirect to Square payment
      if (paymentWindow) {
        paymentWindow.location.href = squareData.url;
      } else {
        window.location.href = squareData.url;
      }
      setSubmitting(false);
    } catch (err) {
      paymentWindow?.close();
      setError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  };

  const inputBaseClass = "w-full bg-background border border-border px-4 py-3 text-sm text-foreground font-sans placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-colors disabled:opacity-50";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative min-h-[90vh] flex flex-col pt-20">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="flex-1 flex flex-col items-center justify-center px-5 sm:px-6 lg:px-8 pb-20"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-sans text-[11px] tracking-widest uppercase text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="text-border">/</span>
            <span className="text-foreground">Development Grant</span>
          </nav>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block border border-accent/40 px-4 py-1.5 mb-6 sm:mb-8"
          >
            <span className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-accent font-sans font-medium">
              {currentYear} Application Cycle — Now Open
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center leading-[1.08] max-w-4xl tracking-tight"
          >
            Dominus Golf<br /><span className="text-accent">Development Grant</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45 }}
            className="mt-5 sm:mt-6 text-lg sm:text-xl text-muted-foreground italic font-serif text-center max-w-xl"
          >
            Excellence Recognized. Development Funded.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-9 sm:mt-11 flex flex-wrap items-center justify-center"
          >
            <div className="flex flex-wrap items-center justify-center border border-border bg-secondary">
              {STATS.map((stat, i) => (
                <div key={stat.label} className={`flex items-center px-4 sm:px-6 py-3 sm:py-4 ${i < STATS.length - 1 ? 'border-r border-border' : ''}`}>
                  <span className="text-lg sm:text-xl font-bold font-serif text-foreground tracking-tight">{stat.value}</span>
                  <span className="ml-2.5 text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground font-sans font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.8 }}
            className="mt-9 sm:mt-10"
          >
            <GrantCTA onClick={scrollToForm} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
            className="mt-10 sm:mt-12 max-w-lg mx-auto text-center"
          >
            <div className="border border-accent/20 bg-accent/5 px-5 py-4">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                Every applicant receives a free digital copy of{' '}
                <span className="text-foreground italic">The Ultimate Guide to Master the Game</span>{' '}
                <span className="text-muted-foreground/60">($14.99 value)</span> delivered to their inbox
              </p>
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-foreground/30 to-transparent" />
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
                A $5,000 Investment in One Golfer's Future
              </h2>
              <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-sans">
                The Dominus Golf Development Grant was created to identify a golfer with the drive,
                commitment, and vision to take their game to the next level — and give them the
                resources to do it.
              </p>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-sans">
                No restrictions on how the award is used. The $5,000 goes directly to the winner.
                One application. One winner. One opportunity.
              </p>
            </FadeUpSection>

            <FadeUpSection className="lg:col-span-2" delay={0.15}>
              <div className="border border-border bg-secondary p-6 sm:p-7">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-5 tracking-tight">Grant Details</h3>
                <dl className="space-y-0 divide-y divide-border">
                  {DETAILS.map((d, i) => (
                    <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <dt className="flex items-center gap-2.5 text-xs uppercase tracking-wider text-muted-foreground font-sans font-medium">
                        <d.icon className="w-3.5 h-3.5 text-accent" />{d.label}
                      </dt>
                      <dd className="text-sm text-foreground font-sans font-medium text-right">{d.value}</dd>
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
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">How It Works</h2>
          </FadeUpSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {STEPS.map((step, i) => (
              <FadeUpSection key={step.num} delay={i * 0.1} className="bg-background">
                <div className="p-6 sm:p-7 lg:p-8 h-full flex flex-col">
                  <span className="text-accent text-xs tracking-[0.25em] uppercase font-sans font-semibold mb-4">Step {step.num}</span>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3 tracking-tight leading-tight">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-auto font-sans">{step.body}</p>
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
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Eligibility</h2>
          </FadeUpSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ELIGIBILITY.map((card, i) => (
              <FadeUpSection key={card.title} delay={i * 0.1} className="border border-border bg-secondary p-7 sm:p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center border border-accent/30 mb-5">
                  <card.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-3 tracking-tight">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">{card.body}</p>
              </FadeUpSection>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════
          3-STEP APPLICATION FORM
          ═══════════════════════════════════════════════════ */}
      <section ref={formRef} className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6 lg:px-8" id="apply">
        <div className="max-w-2xl mx-auto">
          <FadeUpSection className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Apply Now</h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto font-sans">
              Text-only application. No video uploads. No red tape. Takes less than 5 minutes.
            </p>
            <p className="mt-2 text-sm text-accent font-sans font-medium">
              $15.00 non-refundable application fee · Processed securely by Square
            </p>
          </FadeUpSection>

          <FadeUpSection delay={0.1}>
            <StepProgress current={step} total={totalSteps} />

            <form onSubmit={handleSubmit}>
              {/* ══════════════════════ STEP 1: PLAYER PROFILE ══════════════════════ */}
              {step === 0 && (
                <div className="space-y-5">
                  <h3 className="font-sans text-lg font-bold text-foreground">Section 1 — Player Profile</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">First Name *</label>
                      <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Your first name" required disabled={submitting} className={inputBaseClass} />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">Last Name</label>
                      <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Your last name" disabled={submitting} className={inputBaseClass} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">Email *</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required disabled={submitting} className={inputBaseClass} />
                  </div>

                  <div>
                    <label htmlFor="ageGroup" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">Age Group *</label>
                    <select id="ageGroup" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} required disabled={submitting} className={inputBaseClass}>
                      <option value="" disabled>Select your age group</option>
                      {AGE_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="stateRegion" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">State/Region *</label>
                    <input id="stateRegion" type="text" value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} placeholder="e.g., California" required disabled={submitting} className={inputBaseClass} />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">City *</label>
                    <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Los Angeles" required disabled={submitting} className={inputBaseClass} />
                  </div>

                  <div>
                    <label htmlFor="currentHandicap" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">Current Handicap *</label>
                    <input id="currentHandicap" type="text" value={currentHandicap} onChange={(e) => setCurrentHandicap(e.target.value)} placeholder="e.g., 12.4 or N/A" required disabled={submitting} className={inputBaseClass} />
                  </div>

                  <div>
                    <label htmlFor="targetHandicap" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">Target Handicap Milestones</label>
                    <input id="targetHandicap" type="text" value={targetHandicap} onChange={(e) => setTargetHandicap(e.target.value)} placeholder="e.g., Break 80 by Q2, single-digit by year end" disabled={submitting} className={inputBaseClass} />
                  </div>

                  {error && <div className="border border-destructive/30 bg-destructive/5 px-4 py-3"><p className="text-sm text-destructive font-sans">{error}</p></div>}

                  <div className="pt-2">
                    <button type="button" onClick={handleNext} className="btn-gold inline-flex items-center gap-2 px-10 py-4 text-sm font-semibold tracking-wider uppercase transition-all duration-200 active:scale-[0.98]">Next <ArrowRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}

              {/* ══════════════════════ STEP 2: ESSAYS ══════════════════════ */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="font-sans text-lg font-bold text-foreground">Section 2 — Essays</h3>

                  <div>
                    <label htmlFor="roadmap" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">Grant Essay Roadmap *</label>
                    <p className="text-[11px] text-muted-foreground/70 mb-2 font-sans italic leading-relaxed">
                      To help us understand your plan, please address the following:<br />
                      What does your practice and tournament schedule look like over the next 12 months? What are the specific milestones or target handicaps you want to reach? What concrete metrics (like stats, trackman data, or short-game goals) will you use to track your improvement?
                    </p>
                    <textarea id="roadmap" value={roadmap} onChange={(e) => setRoadmap(e.target.value)} placeholder="Your response..." rows={6} required disabled={submitting} className={`${inputBaseClass} resize-y min-h-[140px]`} />
                    <p className="text-right text-[10px] text-muted-foreground/50 mt-1 font-sans">{roadmap.length}/400 words max</p>
                  </div>

                  <div>
                    <label htmlFor="discipline" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">Grant Essay Discipline *</label>
                    <p className="text-[11px] text-muted-foreground/70 mb-2 font-sans italic leading-relaxed">
                      To help us understand your work ethic, please address the following:<br />
                      How do you structure a typical practice session? What training tools or drills do you use? How do you hold yourself accountable and stay consistent when you aren't playing your best? Share an example of a setback or developmental plateau you faced, and exactly how you practiced your way through it.
                    </p>
                    <textarea id="discipline" value={discipline} onChange={(e) => setDiscipline(e.target.value)} placeholder="Your response..." rows={6} required disabled={submitting} className={`${inputBaseClass} resize-y min-h-[140px]`} />
                    <p className="text-right text-[10px] text-muted-foreground/50 mt-1 font-sans">{discipline.length}/400 words max</p>
                  </div>

                  <div>
                    <label htmlFor="vision" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">Grant Essay Vision *</label>
                    <p className="text-[11px] text-muted-foreground/70 mb-2 font-sans italic leading-relaxed">
                      To help us understand your long-term goals, please address the following:<br />
                      Where do you want your game to be in 3 to 5 years (e.g., high school team, college recruitment, Pro/Amateur tournaments)? How will securing this grant change your current trajectory?
                    </p>
                    <textarea id="vision" value={vision} onChange={(e) => setVision(e.target.value)} placeholder="Your response..." rows={5} required disabled={submitting} className={`${inputBaseClass} resize-y min-h-[120px]`} />
                    <p className="text-right text-[10px] text-muted-foreground/50 mt-1 font-sans">{vision.length}/300 words max</p>
                  </div>

                  <div>
                    <label htmlFor="connection" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">Grant Essay Connection *</label>
                    <p className="text-[11px] text-muted-foreground/70 mb-2 font-sans italic leading-relaxed">
                      To help us understand the core of your game, please address the following:<br />
                      Describe a specific, pivotal moment or round on a golf course or driving range that defines why you continue to pursue your development goals. Your response must include the exact facility name, its city/state location, and the specific situational variables (e.g., club selection, weather, or a precise score/metric) from that moment.
                    </p>
                    <textarea id="connection" value={connection} onChange={(e) => setConnection(e.target.value)} placeholder="Your response..." rows={5} required disabled={submitting} className={`${inputBaseClass} resize-y min-h-[120px]`} />
                    <p className="text-right text-[10px] text-muted-foreground/50 mt-1 font-sans">{connection.length}/400 words max</p>
                  </div>

                  {error && <div className="border border-destructive/30 bg-destructive/5 px-4 py-3"><p className="text-sm text-destructive font-sans">{error}</p></div>}

                  <div className="flex items-center gap-3 pt-2">
                    <button type="button" onClick={handlePrev} className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold tracking-wider uppercase border border-border text-foreground hover:bg-secondary transition-colors"><ArrowLeft className="w-4 h-4" /> Previous</button>
                    <button type="button" onClick={handleNext} className="btn-gold inline-flex items-center gap-2 px-10 py-4 text-sm font-semibold tracking-wider uppercase transition-all duration-200 active:scale-[0.98]">Next <ArrowRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}

              {/* ══════════════════════ STEP 3: JUNIOR PROVISION + SUBMIT ══════════════════════ */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="font-sans text-lg font-bold text-foreground">Section 3 — Junior Provision</h3>

                  <div className="border border-border bg-secondary p-5">
                    <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                      Junior Golfer Provision — If applying on behalf of a golfer under 18, complete the two fields below. If you are 18 or older leave these blank.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="guardianName" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">Guardian Name</label>
                    <input id="guardianName" type="text" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} placeholder="Guardian's full name" disabled={submitting} className={inputBaseClass} />
                  </div>

                  <div>
                    <label htmlFor="guardianEmail" className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2">Guardian Email</label>
                    <input id="guardianEmail" type="text" value={guardianEmail} onChange={(e) => setGuardianEmail(e.target.value)} placeholder="guardian@example.com" disabled={submitting} className={inputBaseClass} />
                  </div>

                  {error && <div className="border border-destructive/30 bg-destructive/5 px-4 py-3"><p className="text-sm text-destructive font-sans">{error}</p></div>}

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button type="button" onClick={handlePrev} className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold tracking-wider uppercase border border-border text-foreground hover:bg-secondary transition-colors"><ArrowLeft className="w-4 h-4" /> Previous</button>
                    <button type="submit" disabled={submitting} className="btn-gold inline-flex items-center gap-2.5 px-10 py-4 text-sm font-semibold tracking-wider uppercase transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                      {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <>Submit Application <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-sans pt-2">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Secure payment via Square · $15.00 application fee
                  </div>
                </div>
              )}
            </form>
          </FadeUpSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          GOLD QUOTE SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6 lg:px-8 bg-accent">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUpSection>
            <blockquote>
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl italic text-accent-foreground leading-[1.25]">
                &ldquo;Excellence Recognized. Development Funded.&rdquo;
              </p>
            </blockquote>
            <p className="mt-6 text-sm text-accent-foreground/70 tracking-wide uppercase font-sans font-medium">
              — Jay Moore, Founder &amp; CEO, Dominus Golf
            </p>
          </FadeUpSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER CTA
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUpSection>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Your Game. Your Grant.</h2>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto font-sans">
              Text-only application. Takes 5 minutes. Closes August 15, 2026. One golfer will be selected. One award will be made.
            </p>
            <div className="mt-9"><GrantCTA onClick={scrollToForm} /></div>
          </FadeUpSection>
          <FadeUpSection delay={0.2} className="mt-14">
            <p className="text-[11px] sm:text-xs text-muted-foreground/60 leading-relaxed max-w-2xl mx-auto font-sans">
              Void where prohibited. Open to all U.S. residents and territories regardless of age or skill level.
              Junior golfers may apply via a parent or legal guardian. Grant funds ($5,000) are paid out directly to
              the recipient. Application fee is strictly non-refundable. Free copy of{' '}
              <span className="italic">The Ultimate Guide to Master the Game</span> ($14.99 retail value)
              delivered digitally upon payment confirmation while promotional supplies last. Dominus Golf reserves
              the right to make the final determination of all award recipients.
            </p>
          </FadeUpSection>
        </div>
      </section>

      <Footer />
      <CartDrawer />
    </div>
  );
}
