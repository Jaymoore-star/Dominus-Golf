import { useState, useEffect, useRef } from 'react';
import { X, MapPin, ExternalLink, User } from 'lucide-react';
import { Pro } from '../types';
import { useScrollLock } from '../../../hooks/useScrollLock';

interface ProModalProps {
  pro: Pro;
  onClose: () => void;
}

export function ProModal({ pro, onClose }: ProModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [activeSessionFilter, setActiveSessionFilter] = useState('Full Swing');

  // Mounted only while open, so lock for the component's whole lifetime.
  useScrollLock(true);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
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
      <div className="relative w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[88vh] overflow-y-auto bg-background border border-border flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 sm:px-8 py-5 bg-background border-b border-border">
          <div>
            <p className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-accent mb-1">
              {pro.affiliation}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">{pro.name}</h2>
            {(pro.city || pro.state) && (
              <p className="font-sans text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin size={11} />
                {[pro.city, pro.state].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-8 py-7 space-y-8">
          {/* Photo + bio */}
          <div className="flex gap-5 items-start">
            <div className="w-16 h-16 shrink-0 bg-muted border border-border flex items-center justify-center">
              {pro.photo ? (
                <img src={pro.photo} alt={pro.name} className="w-full h-full object-cover" />
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              )}
            </div>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">{pro.fullBio}</p>
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
                  <span className="font-sans text-sm text-muted-foreground leading-relaxed">{c}</span>
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
                      ? 'border-accent bg-accent text-accent-foreground'
                      : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
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
                  <div key={s.title} className="bg-muted border border-border p-5">
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h4 className="font-sans text-sm font-semibold text-foreground">{s.title}</h4>
                      <span className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground shrink-0">
                        {s.duration}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="sticky bottom-0 px-6 sm:px-8 py-5 bg-muted border-t border-border flex flex-col sm:flex-row gap-3">
          {pro.acuityUrl ? (
            <a
              href={pro.acuityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 font-sans font-semibold text-xs tracking-widest uppercase px-6 py-3.5 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-200"
            >
              Schedule Appointment
              <ExternalLink size={12} />
            </a>
          ) : (
            <a
              href={`mailto:${pro.contactEmail}`}
              className="flex-1 inline-flex items-center justify-center gap-2 font-sans font-semibold text-xs tracking-widest uppercase px-6 py-3.5 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-200"
            >
              Contact {pro.name.split(' ')[0]}
            </a>
          )}
          <a
            href={`/${pro.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 font-sans font-semibold text-xs tracking-widest uppercase px-6 py-3.5 border border-border text-foreground hover:border-accent hover:text-accent transition-colors duration-200"
          >
            Full Profile
            <User size={12} />
          </a>
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none font-sans font-semibold text-xs tracking-widest uppercase px-6 py-3.5 border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
