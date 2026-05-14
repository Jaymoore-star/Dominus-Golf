import { MapPin } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Pro } from '../types';

interface ProCardProps {
  pro: Pro;
  onClick: () => void;
}

export function ProCard({ pro, onClick }: ProCardProps) {
  const profileTo = pro.id === 'gabe-salvanera' ? '/gabe-salvanera' : '/leroy-bates';

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
