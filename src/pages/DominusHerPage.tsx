import { useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { ProductCard } from '../components/ui/ProductCard';
import { ApparelProductCard } from '../components/ui/ApparelProductCard';
import { womensProducts } from '../data/products';
import { BACKEND_URL } from '../lib/backend';

/**
 * DOMINUS HER - the national women's golf and leadership initiative.
 *
 * The page is the programme's front door and the home of the women's range.
 * Every female product in the catalogue is listed here, from `womensProducts`
 * in data/products.ts, which reads the `audience` field - so a new women's item
 * appears on this page the moment it is added to the catalogue, with no edit
 * here.
 *
 * Every call to action on this page ends at the enquiry form in the closing
 * section, which posts to /api/contact - the same endpoint the contact page
 * uses, already live on the backend Worker. It used to be a `mailto:` link,
 * which does nothing at all in a browser with no mail client registered: the
 * buttons looked broken because for most visitors they were.
 *
 * Still missing, and worth building when there is somewhere to put the data:
 * a real Founding 500 application stored in Supabase the way grant_applications
 * is, and an actual partnership deck to serve. Until then the deck is requested
 * through the same form, via the checkbox.
 *
 * public/images holds no photograph of a woman golfer, so the hero is
 * typographic rather than carrying stock imagery that is not ours. Set
 * HERO_IMAGE when the shoot lands and it becomes a photographic hero.
 */

/** Set to a path under /images once real programme photography exists. */
const HERO_IMAGE: string | null = null;

const STAGES = [
  {
    n: '01',
    name: 'Discover',
    tagline: 'Her First Swing',
    label: 'The Entry',
    body: 'Low-barrier, zero-intimidation introductory clinics focused on fundamentals, safety, and joy.',
  },
  {
    n: '02',
    name: 'Belong',
    tagline: 'Her Community',
    label: 'The Sisterhood',
    body: 'Monthly chapter play days, peer cohorts, and social rounds that make her want to return.',
  },
  {
    n: '03',
    name: 'Develop',
    tagline: 'Her Performance',
    label: 'The Skill',
    body: 'Structured 90-day training using the proprietary Tour Pure weighted trainer and the Dominus Method.',
  },
  {
    n: '04',
    name: 'Compete',
    tagline: 'Her Game',
    label: 'The Ambition',
    body: 'Local chapter matchplay, skills challenges, regional leagues, and the DOMINUS HER Ranking.',
  },
  {
    n: '05',
    name: 'Advance',
    tagline: 'Her Opportunities',
    label: 'The Bridge',
    body: 'Executive networking, career mentorship, college pathways, and "Golf for the Boardroom" workshops.',
  },
  {
    n: '06',
    name: 'Lead',
    tagline: 'Her Legacy',
    label: 'The Multiplier',
    body: 'Graduating into certified instructors, chapter directors, corporate mentors, and industry entrepreneurs.',
  },
];

const CITIES = ['Phoenix', 'Los Angeles', 'San Antonio', 'Atlanta', 'Dallas / Houston'];

const PILOT_STATS = [
  { value: '500', label: 'Founding Members' },
  { value: '90', label: 'Day Structured Tracking' },
  { value: '70%+', label: 'Target Retention Rate' },
  { value: '1', label: 'National Signature Championship' },
];

const MILESTONES = [
  {
    day: 'Day 1',
    title: 'Baseline Setup',
    body: 'Initial swing assessment, launch data, and app onboarding.',
  },
  {
    day: 'Day 30',
    title: 'Habit & Sequencing',
    body: 'Practice log audit, Tour Pure drills, and first guided 9-hole walk.',
  },
  {
    day: 'Day 60',
    title: 'Skill Checkpoint',
    body: 'Mid-evaluation, clubhead speed metrics, and 9-hole team cohort play.',
  },
  {
    day: 'Day 90',
    title: 'Competition Ready',
    body: 'Official handicap index established, matchplay readiness, and tournament qualification.',
  },
];

const TIERS = [
  {
    name: 'Community Partner',
    price: '$25,000',
    featured: false,
    benefits: [
      'Local chapter title presence',
      'On-site event branding',
      'Quarterly impact metrics',
    ],
  },
  {
    name: 'National Partner',
    price: '$50,000',
    featured: true,
    benefits: [
      'Multi-market footprint',
      'Digital platform integration on My Coach / My Caddie',
      'VIP executive roundtables',
    ],
  },
  {
    name: 'Founding Partner',
    price: '$100,000',
    featured: false,
    benefits: [
      'Exclusive national title category rights',
      'Co-branded national content series',
      'Executive summit hosting',
    ],
  },
];

const INTERESTS = [
  { id: 'founding', label: 'Founding Member' },
  { id: 'volunteer', label: 'Volunteer' },
  { id: 'sponsor', label: 'Corporate Sponsor' },
] as const;

type Interest = (typeof INTERESTS)[number]['id'];

/** Shared by every text control here, and by the contact page it mirrors. */
const FIELD_CLASS =
  // text-base on phones, not text-sm. Below 16px iOS Safari magnifies the whole
  // page on focus and never undoes it, and in an SPA there is no reload to
  // reset it. See the note in src/index.css.
  'w-full border border-border bg-background px-4 py-3 font-sans text-base sm:text-sm ' +
  'text-foreground placeholder:text-muted-foreground/60 focus:outline-none ' +
  'focus:border-accent transition-colors';

export function DominusHerPage() {
  const [interest, setInterest] = useState<Interest>('founding');
  const [tier, setTier] = useState<string>(
    TIERS.find((t) => t.featured)?.name ?? TIERS[0].name,
  );
  const [wantsDeck, setWantsDeck] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  /** Scrolls to the enquiry form. `scroll-padding-top` in index.css keeps the
      target clear of the sticky header. */
  const goToForm = () => {
    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const startEnquiry = (next: Interest, deck = false) => {
    setInterest(next);
    if (deck) setWantsDeck(true);
    setSent(false);
    setError('');
    goToForm();
  };

  const selectTier = (name: string) => {
    setTier(name);
    setInterest('sponsor');
  };

  /** Back up to the tier cards, which are the only place a tier is chosen. */
  const goToTiers = () => {
    document.getElementById('partnership')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const selectedTierPrice = TIERS.find((t) => t.name === tier)?.price ?? '';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address so we can reply.');
      return;
    }

    // The intent lines are part of the message rather than a separate field:
    // /api/contact takes { firstName, lastName, email, message } and nothing
    // else, and adding a field there would mean redeploying the backend Worker
    // for no gain - the support inbox reads this as one email either way.
    const interestLabel = INTERESTS.find((i) => i.id === interest)?.label ?? interest;
    const composed = [
      `DOMINUS HER enquiry: ${interestLabel}`,
      interest === 'sponsor' ? `Partner tier: ${tier}` : null,
      wantsDeck ? 'Requested: Executive Partnership Deck' : null,
      '',
      message.trim() || '(no message)',
    ]
      .filter((line) => line !== null)
      .join('\n');

    setSending(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, message: composed }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Could not send your enquiry.');
      setSent(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setMessage('');
      setWantsDeck(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not send your enquiry. Please email Customersupport@dominusgolf.com.',
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── 1 · Hero ─────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-primary text-primary-foreground overflow-hidden">
        {HERO_IMAGE && (
          <>
            <img
              loading="lazy"
              decoding="async"
              src={HERO_IMAGE}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/30" />
          </>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-block border border-accent/50 px-4 py-2 font-sans text-[10px] font-semibold tracking-[0.28em] uppercase text-accent mb-8">
              The National Women&apos;s Golf &amp; Leadership Initiative
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-5">
              She Belongs Here.
            </h1>

            <p className="font-serif text-xl sm:text-2xl text-accent mb-8">
              Her Game. Her Future.
            </p>

            <p className="font-sans text-base text-white/60 leading-relaxed max-w-xl mb-10">
              DOMINUS HER is a national initiative dedicated to introducing, developing, and
              advancing women in golf. We are dismantling cost and access barriers to build a
              complete pipeline - from her very first swing to competitive play, business
              leadership, and careers across the golf industry.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => startEnquiry('founding')}
                className="inline-flex items-center justify-center font-sans font-semibold text-xs tracking-widest uppercase px-10 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-200"
              >
                Join the Founding 500
              </button>
              <a
                href="#partnership"
                className="inline-flex items-center justify-center font-sans font-semibold text-xs tracking-widest uppercase px-10 py-4 border border-white/25 text-white hover:bg-white/10 transition-colors duration-200"
              >
                Partner With Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2 · The mission and the problem ──────────────────────────────── */}
      <section className="w-full bg-background border-b border-border py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
                Beyond the Invitation
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                An Invitation Is Not a Pathway.
              </h2>
            </div>

            <div>
              <p className="font-sans text-base text-muted-foreground leading-relaxed mb-8">
                Traditional golf initiatives invite women to the driving range for an afternoon,
                take photos, and walk away. Without equipment, structured coaching, or community,
                over 70% of beginners leave the sport before they ever truly begin.
              </p>

              <blockquote className="border-l-2 border-accent pl-6">
                <p className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-accent mb-3">
                  The DOMINUS HER Thesis
                </p>
                <p className="font-serif text-lg sm:text-xl italic text-foreground leading-relaxed">
                  Dominus is building a connected golf-development ecosystem that combines
                  methodology, digital coaching, physical training, performance tracking, and
                  community - giving a golfer a pathway that continues long after her first
                  lesson or first swing.
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 · The six-stage pipeline ───────────────────────────────────── */}
      <section
        id="pathway"
        className="w-full bg-muted border-b border-border py-16 sm:py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              The Dominus Pathway
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              From Her First Swing to the Boardroom
            </h2>
          </div>

          {/* The stage flow wraps rather than scrolling sideways, and the arrow
              is its own flex item so a line break lands between two stages and
              never inside one. Safe from 320px up. */}
          <ol className="flex flex-wrap items-center justify-center gap-3 mb-14">
            {STAGES.map((stage, i) => (
              <li key={stage.n} className="flex items-center gap-3">
                <span className="bg-background border border-border px-4 py-2 font-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground whitespace-nowrap">
                  <span className="text-accent">{stage.n}</span>
                  <span className="text-muted-foreground mx-1.5" aria-hidden="true">
                    &middot;
                  </span>
                  {stage.name}
                </span>
                {i < STAGES.length - 1 && (
                  <span className="text-accent text-sm" aria-hidden="true">
                    &rarr;
                  </span>
                )}
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STAGES.map((stage) => (
              <div
                key={stage.n}
                className="bg-background border border-border p-7 hover:border-accent/40 transition-colors duration-200"
              >
                <p className="font-serif text-3xl font-bold text-accent leading-none mb-5">
                  {stage.n}
                </p>
                <h3 className="font-serif text-xl font-bold text-foreground mb-1">{stage.name}</h3>
                <p className="font-sans text-sm text-muted-foreground mb-5">{stage.tagline}</p>
                <p className="font-sans text-[10px] font-semibold tracking-[0.25em] uppercase text-accent mb-2">
                  {stage.label}
                </p>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {stage.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 · The five-city pilot ──────────────────────────────────────── */}
      <section
        id="chapters"
        className="w-full bg-primary text-primary-foreground py-16 sm:py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              Phase One Pilot
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
              500 Founding Members. 4-5 Powerhouse Chapters. One National Movement.
            </h2>
            <p className="font-sans text-base text-white/55 leading-relaxed">
              We are proving the model first. DOMINUS HER is launching with a controlled cohort of
              500 women across key metropolitan hubs to validate training milestones, community
              retention, and corporate partner ROI.
            </p>
          </div>

          {/* Bordered cells with a real gap, not a `gap-px` hairline grid over a
              light background. Five cities into two or three columns leaves one
              cell of the last row empty, and with the hairline trick that empty
              track shows the container's light background as a stray pale block.
              A per-cell border leaves it simply empty. */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-14">
            {CITIES.map((city) => (
              <div
                key={city}
                className="border border-white/15 px-4 py-8 text-center min-w-0"
              >
                <p className="font-serif text-lg sm:text-xl font-bold text-white">{city}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-white/10">
            {PILOT_STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-4xl sm:text-5xl font-bold text-accent leading-none mb-3">
                  {stat.value}
                </p>
                <p className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-white/50 leading-relaxed">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5 · The performance engine ───────────────────────────────────── */}
      <section className="w-full bg-background border-b border-border py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              Proprietary Performance
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Tour-Level Mechanics. Digital Coaching at Scale.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-border p-8 sm:p-10">
              <p className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-accent mb-4">
                The Hardware
              </p>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Tour Pure</h3>
              <p className="font-sans text-sm font-semibold text-foreground/70 mb-5">
                Kinetic Sequencing &amp; Muscle Memory
              </p>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-8">
                Engineered to build lag, proper body positioning, and clubhead speed. Participants
                don&apos;t need a $2,000 custom club set to build tour-grade mechanics from Day 1.
              </p>
              <Link
                to="/product/$id"
                params={{ id: 'tour-pure-women' }}
                className="inline-flex items-center gap-2 font-sans text-[11px] font-semibold tracking-widest uppercase text-foreground hover:text-accent transition-colors duration-200"
              >
                View Tour Pure Women
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="border border-border p-8 sm:p-10">
              <p className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-accent mb-4">
                The Platform
              </p>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                My Coach / My Caddie
              </h3>
              <p className="font-sans text-sm font-semibold text-foreground/70 mb-5">
                24/7 Digital Progression Hub
              </p>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-8">
                Personalized baseline assessments, structured daily practice drills, real-time
                progress tracking, and on-course decision support that keep her accountable
                between chapter meetups.
              </p>
              <Link
                to="/tour-pure-guide"
                className="inline-flex items-center gap-2 font-sans text-[11px] font-semibold tracking-widest uppercase text-foreground hover:text-accent transition-colors duration-200"
              >
                The Dominus Method
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6 · The women's range ────────────────────────────────────────── */}
      <section id="shop" className="w-full bg-muted border-b border-border py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              Her Equipment
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-5">
              Shop DOMINUS HER
            </h2>
            <p className="font-sans text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The full women&apos;s range - the training system every member trains on, and the
              kit she wears to do it.
            </p>
          </div>

          {/* Two columns on phones, matching the shop grid. The apparel card is
              used for apparel and the standard card for everything else, exactly
              as ShopPage does, so a product looks the same in both places. */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
            {womensProducts.map((product) =>
              product.category === 'apparel' ? (
                <ApparelProductCard key={product.id} product={product} />
              ) : (
                <ProductCard key={product.id} product={product} />
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── 7 · The 90-day transformation ────────────────────────────────── */}
      <section className="w-full bg-background border-b border-border py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              Measurable Impact
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              We Track What Matters: Real Progression.
            </h2>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MILESTONES.map((milestone) => (
              <li key={milestone.day} className="border-t-2 border-accent pt-5">
                <p className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-accent mb-3">
                  {milestone.day}
                </p>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                  {milestone.title}
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {milestone.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 8 · Corporate partnership ────────────────────────────────────── */}
      <section
        id="partnership"
        className="w-full bg-muted border-b border-border py-16 sm:py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              Sponsorship Opportunities
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">
              Invest in the Next Generation of Women on the Fairway and in the Boardroom.
            </h2>
            <p className="font-sans text-base text-muted-foreground leading-relaxed">
              DOMINUS HER connects your organization directly with 500 ambitious, high-achieving
              women across premier US markets through authentic engagement, category exclusivity,
              and defensible impact data.
            </p>
          </div>

          {/* A radio group, not three static panels: picking a tier is the whole
              point of the section, and it carries through to the enquiry form
              below so support knows which one the sender wants. */}
          <div
            role="radiogroup"
            aria-label="Partnership tier"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            {TIERS.map((t) => {
              const selected = tier === t.name;
              return (
                <button
                  key={t.name}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => selectTier(t.name)}
                  className={`group p-8 flex flex-col text-left bg-background transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                    selected
                      ? 'border-2 border-accent'
                      : 'border border-border hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span
                      className={`font-sans text-[10px] font-semibold tracking-widest uppercase ${
                        t.featured ? 'text-accent' : 'text-muted-foreground'
                      }`}
                    >
                      {t.featured ? 'Most Popular' : 'Partnership Tier'}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                        selected ? 'border-accent' : 'border-border'
                      }`}
                    >
                      {selected && <span className="w-2 h-2 rounded-full bg-accent" />}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">{t.name}</h3>
                  <p className="font-serif text-3xl font-bold text-accent mb-6">{t.price}</p>

                  <ul className="space-y-3">
                    {t.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <span className="mt-[7px] w-1.5 h-1.5 bg-accent shrink-0" />
                        <span className="font-sans text-sm text-muted-foreground leading-relaxed">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <span
                    className={`mt-6 pt-5 border-t font-sans text-[11px] font-semibold tracking-widest uppercase ${
                      selected ? 'border-accent/30 text-accent' : 'border-border text-muted-foreground'
                    }`}
                  >
                    {selected ? 'Selected' : 'Select this tier'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => startEnquiry('sponsor')}
              className="inline-flex items-center justify-center font-sans font-semibold text-xs tracking-widest uppercase px-10 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
            >
              Enquire About {tier}
            </button>
            {/* There is no deck file to serve yet, so this ticks the request box
                on the form below rather than linking a download that would 404. */}
            <button
              type="button"
              onClick={() => startEnquiry('sponsor', true)}
              className="inline-flex items-center justify-center font-sans font-semibold text-xs tracking-widest uppercase px-10 py-4 border border-border text-foreground hover:bg-background transition-colors duration-200"
            >
              Request the Executive Partnership Deck
            </button>
          </div>
        </div>
      </section>

      {/* ── 9 · Closing call to action and enquiry form ──────────────────── */}
      <section id="join" className="w-full bg-background py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              Join the Movement
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
              Ready to Change the Game?
            </h2>
            <p className="font-sans text-base text-muted-foreground leading-relaxed">
              Join the movement as a Founding Member, Volunteer, or Corporate Sponsor.
            </p>
          </div>

          <div className="border border-border p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <span className="block font-sans text-[11px] font-semibold tracking-widest uppercase text-foreground mb-3">
                  I am interested as a
                </span>
                <div
                  role="radiogroup"
                  aria-label="I am interested as a"
                  className="flex flex-wrap gap-2"
                >
                  {INTERESTS.map((option) => {
                    const selected = interest === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setInterest(option.id)}
                        className={`px-4 py-2.5 font-sans text-xs font-semibold tracking-wide uppercase transition-colors duration-200 ${
                          selected
                            ? 'bg-accent text-accent-foreground border border-accent'
                            : 'border border-border text-foreground hover:border-accent/40'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* The tier is shown here, not asked for again. This was a native
                  <select> listing the same three options as the cards a few
                  hundred pixels above, which is both a second control for one
                  decision and the one element on the page a browser refuses to
                  style. The cards are where a tier is chosen; this confirms the
                  choice and sends you back up to change it. */}
              {interest === 'sponsor' && (
                <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-muted px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-sans text-[10px] font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-1">
                      Partnership Tier
                    </p>
                    <p className="font-serif text-base font-bold text-foreground">
                      {tier} <span className="text-accent">{selectedTierPrice}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={goToTiers}
                    className="shrink-0 font-sans text-[11px] font-semibold tracking-widest uppercase text-accent hover:underline"
                  >
                    Change Tier
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="her-first"
                    className="block font-sans text-[11px] font-semibold tracking-widest uppercase text-foreground mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="her-first"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label
                    htmlFor="her-last"
                    className="block font-sans text-[11px] font-semibold tracking-widest uppercase text-foreground mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="her-last"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={FIELD_CLASS}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="her-email"
                  className="block font-sans text-[11px] font-semibold tracking-widest uppercase text-foreground mb-2"
                >
                  Email
                </label>
                <input
                  id="her-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={FIELD_CLASS}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="her-message"
                  className="block font-sans text-[11px] font-semibold tracking-widest uppercase text-foreground mb-2"
                >
                  Message
                </label>
                <textarea
                  id="her-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${FIELD_CLASS} resize-none`}
                  placeholder="Your city, your golf experience, or what you want to know."
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wantsDeck}
                  onChange={(e) => setWantsDeck(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-accent shrink-0"
                />
                <span className="font-sans text-sm text-muted-foreground leading-relaxed">
                  Send me the Executive Partnership Deck
                </span>
              </label>

              {error && (
                <p role="alert" className="font-sans text-sm text-destructive">
                  {error}
                </p>
              )}

              {sent && (
                <div
                  role="status"
                  className="flex items-start gap-2.5 border border-accent/40 bg-accent/5 px-4 py-3"
                >
                  <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                  <p className="font-sans text-sm text-foreground">
                    <span className="font-semibold">Enquiry sent.</span> Thanks for your interest
                    - our team replies within one business day.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center justify-center gap-2 w-full font-sans font-semibold text-xs tracking-widest uppercase px-10 py-4 bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-60 transition-colors duration-200"
              >
                {sending && <Loader2 size={14} className="animate-spin" />}
                {sending ? 'Sending' : 'Send My Enquiry'}
              </button>
            </form>
          </div>

          <p className="font-sans text-xs text-muted-foreground leading-relaxed text-center mt-6">
            Prefer email?{' '}
            <a
              href="mailto:Customersupport@dominusgolf.com"
              className="text-accent hover:underline"
            >
              Customersupport@dominusgolf.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
      <CartDrawer />
    </div>
  );
}
