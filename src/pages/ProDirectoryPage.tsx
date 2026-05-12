import { useState, useEffect, useRef } from 'react';
import { X, Search, MapPin, ExternalLink, User } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

// ─── Pro Data ────────────────────────────────────────────────────────────────

export type Pro = {
  id: string;
  name: string;
  affiliation: string;
  region: string;
  city: string;
  state: string;
  bio: string;
  fullBio: string;
  photo: string | null;
  credentials: string[];
  sessions: { title: string; duration: string; description: string }[];
  acuityUrl: string | null;
  contactEmail: string;
};

const pros: Pro[] = [
  {
    id: 'gabe-salvanera',
    name: 'Gabe Salvanera',
    affiliation: 'PGA Tour Americas · Grass League',
    region: 'Southwest',
    city: 'Phoenix',
    state: 'AZ',
    bio: 'Specialist in Swing Mechanics and Performance Optimization.',
    fullBio:
      'Gabe Salvanera is a PGA Tour Americas and Grass League professional who has built his reputation on elite swing mechanics and performance optimization. His sessions focus on building tour-level habits on the range that translate directly to better ball striking and lower scores.',
    photo: null,
    credentials: [
      'PGA Tour Americas competitor',
      'Grass League professional',
      'Certified performance Pro',
      'Specialist in swing optimization and practice structure',
    ],
    sessions: [
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
    ],
    acuityUrl:
      'https://app.acuityscheduling.com/schedule.php?owner=39236931&calendarID=14047266&ref=booking_button',
    contactEmail: 'gabe@dominusgolf.com',
  },
  {
    id: 'leroy-bates',
    name: 'Leroy Bates',
    affiliation: 'Golf Junkyz Foundation · First Tee',
    region: 'West',
    city: 'Los Angeles',
    state: 'CA',
    bio: 'Expert in Consistency and Technical Proficiency.',
    fullBio:
      'Leroy Bates is a Golf Junkyz Foundation professional and First Tee instructor whose entire Pro career is built around one goal: consistency. He gives everyday golfers a structured, repeatable path to lower scores through elite technical range sessions.',
    photo: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F1000010452__3764dc88.jpg?alt=media&token=22783388-9f93-4757-9fa9-a5e992497359',
    credentials: [
      'Golf Junkyz Foundation certified professional',
      'First Tee instructor and youth development Pro',
      'Specialist in swing consistency and repeatable mechanics',
      'Dedicated to technical improvement on the range',
    ],
    sessions: [
      {
        title: 'Full Swing',
        duration: '1 hour',
        description:
          'Pro will be hitting balls on the range. Golfers will have to pay for their golf balls on the range. Leroy identifies pattern breakdowns and helps you build the repeatable habits that translate to lower scores.',
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
    ],
    acuityUrl:
      'https://app.acuityscheduling.com/schedule.php?owner=39236931&calendarID=14032949&ref=booking_button',
    contactEmail: 'leroy@dominusgolf.com',
  },
];

const REGIONS = ['All Regions', 'Southwest', 'Southeast', 'Northeast', 'Midwest', 'West'];

// ─── Modal ────────────────────────────────────────────────────────────────────

function ProModal({ pro, onClose }: { pro: Pro; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeSessionFilter, setActiveSessionFilter] = useState('Full Swing');

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[88vh] overflow-y-auto bg-[#111] border border-white/10 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 sm:px-8 py-5 bg-[#111] border-b border-white/10">
          <div>
            <p className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-accent mb-1">
              {pro.affiliation}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">{pro.name}</h2>
            {(pro.city || pro.state) && (
              <p className="font-sans text-xs text-white/40 flex items-center gap-1 mt-1">
                <MapPin size={11} />
                {[pro.city, pro.state].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 text-white/40 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-8 py-7 space-y-8">
          {/* Photo + bio */}
          <div className="flex gap-5 items-start">
            <div className="w-16 h-16 shrink-0 bg-[#1e1e1e] border border-white/10 flex items-center justify-center">
              {pro.photo ? (
                <img src={pro.photo} alt={pro.name} className="w-full h-full object-cover" />
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              )}
            </div>
            <p className="font-sans text-sm text-white/65 leading-relaxed">{pro.fullBio}</p>
          </div>

          {/* Credentials */}
          <div>
            <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-accent mb-4">
              Credentials
            </p>
            <ul className="space-y-2">
              {pro.credentials.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 bg-accent shrink-0" />
                  <span className="font-sans text-sm text-white/65 leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sessions */}
          <div>
            <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-accent mb-4">
              Session Types
            </p>

            {/* Session Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Full Swing', 'Putting', 'Pitch & Chip'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveSessionFilter(f)}
                  className={`font-sans text-[9px] font-semibold tracking-widest uppercase px-3 py-1.5 border transition-colors duration-150 ${
                    activeSessionFilter === f
                      ? 'border-accent bg-accent text-white'
                      : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {pro.sessions
                .filter((s) => s.title === activeSessionFilter)
                .map((s) => (
                  <div key={s.title} className="bg-[#1a1a1a] border border-white/10 p-5">
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h4 className="font-sans text-sm font-semibold text-white">{s.title}</h4>
                      <span className="font-sans text-[10px] font-semibold tracking-widest uppercase text-white/30 shrink-0">
                        {s.duration}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-white/50 leading-relaxed">{s.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="sticky bottom-0 px-6 sm:px-8 py-5 bg-[#0e0e0e] border-t border-white/10 flex flex-col sm:flex-row gap-3">
          {pro.acuityUrl ? (
            <a
              href={pro.acuityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 font-sans font-semibold text-xs tracking-widest uppercase px-6 py-3.5 bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
            >
              Schedule Appointment
              <ExternalLink size={12} />
            </a>
          ) : (
            <a
              href={`mailto:${pro.contactEmail}`}
              className="flex-1 inline-flex items-center justify-center gap-2 font-sans font-semibold text-xs tracking-widest uppercase px-6 py-3.5 bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
            >
              Contact {pro.name.split(' ')[0]}
            </a>
          )}
          <Link
            to={`/${pro.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 font-sans font-semibold text-xs tracking-widest uppercase px-6 py-3.5 border border-white/20 text-white hover:border-accent hover:text-accent transition-colors duration-200"
          >
            Full Profile
            <User size={12} />
          </Link>
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none font-sans font-semibold text-xs tracking-widest uppercase px-6 py-3.5 border border-white/20 text-white/60 hover:border-white hover:text-white transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pro Card ─────────────────────────────────────────────────────────────────

function ProCard({ pro, onClick }: { pro: Pro; onClick: () => void }) {
  const profileTo = `/${pro.id}`;

  return (
    <div className="w-full bg-[#141414] border border-white/10 flex flex-col overflow-hidden group hover:border-accent/50 transition-colors duration-300">
      {/* Photo */}
      <Link
        to={profileTo}
        className="relative h-[220px] bg-[#1e1e1e] overflow-hidden flex items-center justify-center cursor-pointer"
      >
        {pro.photo ? (
          <img
            src={pro.photo}
            alt={pro.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-white/20">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
        )}
        {/* Region pill */}
        <span className="absolute top-3 left-3 font-sans text-[9px] font-semibold tracking-widest uppercase bg-black/60 text-white/60 px-2.5 py-1 border border-white/10">
          {pro.region}
        </span>
        {/* Hover bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-xl font-bold text-white mb-1">{pro.name}</h3>
        <p className="font-sans text-[10px] font-semibold tracking-[0.25em] uppercase text-accent mb-1">
          {pro.affiliation}
        </p>
        {(pro.city || pro.state) && (
          <p className="font-sans text-[11px] text-white/35 flex items-center gap-1 mb-3">
            <MapPin size={10} />
            {[pro.city, pro.state].filter(Boolean).join(', ')}
          </p>
        )}
        <p className="font-sans text-sm text-white/55 leading-relaxed flex-1 mb-5">{pro.bio}</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onClick}
            className="font-sans font-semibold text-[10px] tracking-widest uppercase py-2.5 border border-white/20 text-white/60 hover:border-white hover:text-white transition-colors duration-200"
          >
            Quick View
          </button>
          <Link
            to={profileTo}
            className="font-sans font-semibold text-[10px] tracking-widest uppercase py-2.5 bg-accent text-white group-hover:bg-accent/90 transition-colors duration-200 text-center"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ProDirectoryPage() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All Regions');
  const [selected, setSelected] = useState<Pro | null>(null);

  const filtered = pros.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      q === '' ||
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.affiliation.toLowerCase().includes(q);
    const matchRegion = region === 'All Regions' || p.region === region;
    return matchSearch && matchRegion;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="w-full bg-[#0a0a0a] border-b border-white/10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Professional Coaching
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            Practice with a Pro
          </h1>
          <p className="font-sans text-base text-white/55 max-w-xl mx-auto leading-relaxed">
            Professional-grade mentorship from Dominus Golf's national network of pros. Find your Pro, view their sessions, and book direct.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="w-full bg-[#0e0e0e] border-b border-white/10 py-6 px-4 sticky top-[90px] z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, affiliation…"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/15 text-white placeholder:text-white/30 font-sans text-sm focus:outline-none focus:border-accent transition-colors duration-200"
            />
          </div>

          {/* Region filter */}
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`font-sans text-[11px] font-semibold tracking-widest uppercase px-4 py-2.5 border transition-colors duration-150 ${
                  region === r
                    ? 'border-accent bg-accent text-white'
                    : 'border-white/15 text-white/50 hover:border-white/40 hover:text-white/80'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="w-full bg-[#0e0e0e] py-12 sm:py-16 px-4 min-h-[400px]">
        <div className="max-w-7xl mx-auto">
          {filtered.length > 0 ? (
            <>
              <p className="font-sans text-[11px] text-white/30 tracking-widest uppercase mb-8">
                {filtered.length} pro{filtered.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((pro) => (
                  <ProCard key={pro.id} pro={pro} onClick={() => setSelected(pro)} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-serif text-xl text-white/30 mb-3">No pros found</p>
              <p className="font-sans text-sm text-white/25">
                Try a different search term or region.
              </p>
              <button
                onClick={() => { setSearch(''); setRegion('All Regions'); }}
                className="mt-6 font-sans text-xs tracking-widest uppercase text-accent hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <CartDrawer />

      {/* Modal */}
      {selected && (
        <ProModal pro={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}