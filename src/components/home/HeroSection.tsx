import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ChevronDown, BookOpen, Target, Zap, Activity } from 'lucide-react';

export function HeroSection() {
  const [guideOpen, setGuideOpen] = useState(false);
  const [systemsOpen, setSystemsOpen] = useState(false);

  const guideLinks = [
    { label: 'Swing Methodology — Step Sequence', icon: <Target size={14} />, href: '/tour-pure-guide' },
    { label: 'Training Tips — Muscle Memory', icon: <Zap size={14} />, href: '/tour-pure-guide' },
    { label: 'Fitness & Warm-up — Strength', icon: <Activity size={14} />, href: '/tour-pure-guide' },
  ];

  const systemLinks = [
    { label: 'Tour Pure Men', href: '/product/tour-pure-men' },
    { label: 'Tour Pure Women', href: '/product/tour-pure-women' },
    { label: 'Tour Pure Jr', href: '/product/tour-pure-jr' },
    { label: 'View All', href: '/shop/training-system' },
  ];

  return (
    <section className="w-full bg-[#0e0e0e] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">

        {/* Single full-width text column */}
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setSystemsOpen(!systemsOpen)}
                  onBlur={() => setTimeout(() => setSystemsOpen(false), 200)}
                  className="flex items-center gap-2 font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 border border-white/20 text-white/60 hover:border-white hover:bg-white/5 transition-all duration-200 rounded-full"
                >
                  Training Systems
                  <ChevronDown size={12} className={`transition-transform duration-300 ${systemsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {systemsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#141414] border border-white/10 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      {systemLinks.map((link, i) => (
                        <Link
                          key={i}
                          to={link.href}
                          className="flex items-center gap-3 px-4 py-2.5 font-sans text-[11px] font-semibold tracking-wider uppercase text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setGuideOpen(!guideOpen)}
                  onBlur={() => setTimeout(() => setGuideOpen(false), 200)}
                  className="flex items-center gap-2 font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 border border-accent/30 text-accent hover:bg-accent/10 transition-all duration-200 rounded-full"
                >
                  How to use Tour Pure
                  <ChevronDown size={12} className={`transition-transform duration-300 ${guideOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {guideOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#141414] border border-white/10 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      {guideLinks.map((link, i) => (
                        <Link
                          key={i}
                          to={link.href}
                          className="flex items-center gap-3 px-4 py-2.5 font-sans text-[11px] font-semibold tracking-wider uppercase text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <span className="text-accent/50">{link.icon}</span>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[4rem] font-bold text-white leading-[1.06] mb-7">
            Train Like You<br />Mean It
          </h1>
          <p className="font-sans text-xl text-white/90 leading-relaxed mb-4 font-medium tracking-wide">
            No Ball. No Guessing. Just Repetition.
          </p>
          <p className="font-sans text-base text-white/75 leading-relaxed mb-12 max-w-[560px]">
            Built for golfers who want repeatable mechanics, better control, and a more consistent swing.
            <span className="block mt-2 text-accent font-semibold underline underline-offset-4 decoration-accent/30">Includes FREE Ultimate Guide to Mastering the Game (PDF) with every purchase.</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/product/$id"
              params={{ id: 'tour-pure-men' }}
              className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-10 py-4 bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
            >
              Start Training Today
            </Link>
            <Link
              to="/pros"
              className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-10 py-4 border border-white/20 text-white hover:border-white hover:bg-white/5 transition-all duration-200"
            >
              Practice with a Pro
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
