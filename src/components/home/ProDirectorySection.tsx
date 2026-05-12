import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const pros = [
  {
    id: 'gabe-salvanera',
    name: 'Gabe Salvanera',
    affiliation: 'PGA TOUR AMERICAS | GRASS LEAGUE',
    bio: 'Specialist in Swing Mechanics and Technical Performance Optimization.',
    href: '/pros',
     city: 'Phoenix',
    state: 'AZ',
    photo: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FGabeSand__d54af4a2.jpg?alt=media&token=d72b1d09-ca90-4b79-a2ee-0017eac6c957',
  },
  {
    id: 'leroy-bates',
    name: 'Leroy Bates',
    affiliation: 'GOLF JUNKYZ FOUNDATION | FIRST TEE',
    bio: 'Expert in Consistency and Technical Proficiency.',
    href: '/pros',
    city: 'Los Angeles',
    state: 'CA',
    photo: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F1000010452__3764dc88.jpg?alt=media&token=22783388-9f93-4757-9fa9-a5e992497359',
  },
];

function ProCard({ pro }: { pro: typeof pros[0] }) {
  const profileTo = `/${pro.id}`;

  return (
    <div className="bg-[#141414] border border-white/10 flex flex-col overflow-hidden group hover:border-accent/50 transition-colors duration-300">
      {/* Photo */}
      <Link 
        to={profileTo}
        className="relative h-[260px] bg-[#1e1e1e] overflow-hidden flex items-center justify-center cursor-pointer"
      >
        {pro.photo ? (
          <img
            src={pro.photo}
            alt={pro.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-white/20">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <span className="font-sans text-xs tracking-widest uppercase">{pro.name} Photo</span>
          </div>
        )}
        {/* Accent bar on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-xl font-bold text-white mb-1">{pro.name}</h3>
        <p className="font-sans text-[10px] font-semibold tracking-[0.25em] uppercase text-accent mb-3">
          {pro.affiliation}
        </p>
        <p className="font-sans text-sm text-white/55 leading-relaxed flex-1 mb-6">{pro.bio}</p>
        <Link
          to={profileTo}
          className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-6 py-3 bg-accent text-white hover:bg-accent/90 transition-colors duration-200 text-center"
        >
          View Profile &amp; Book
        </Link>
      </div>
    </div>
  );
}

export function ProDirectorySection() {
  const [search, setSearch] = useState('');
  const ref = useScrollAnimation();

  const filtered = pros.filter((p) => {
    const q = search.toLowerCase();
    return (
      q === '' ||
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.affiliation.toLowerCase().includes(q)
    );
  });

  return (
    <section className="w-full bg-[#0e0e0e] border-b border-white/10 py-16 sm:py-20 lg:py-24" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Practice with a Pro
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Elite Range Mentorship
          </h2>
          <p className="font-sans text-base text-white/50 max-w-xl mx-auto leading-relaxed">
            Professional-grade technical instruction from the best in the game. Find your Pro, view their technical sessions, and book direct.
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-10">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, or state…"
            className="w-full max-w-sm px-5 py-3 bg-white/5 border border-white/15 text-white placeholder:text-white/35 font-sans text-sm focus:outline-none focus:border-accent transition-colors duration-200"
          />
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pro) => (
              <ProCard key={pro.id} pro={pro} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-sans text-white/40 text-sm">No pros found matching "{search}".</p>
          </div>
        )}
      </div>
    </section>
  );
}