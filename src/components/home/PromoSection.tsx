import { Link } from '@tanstack/react-router';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export function PromoSection() {
  const ref = useScrollAnimation();

  return (
    <section className="py-0 bg-background" ref={ref}>
      <div className="grid grid-cols-1 lg:grid-cols-2 scroll-animate">
        {/* Left Panel — Fitting */}
        <div
          className="relative flex flex-col justify-end px-8 sm:px-12 lg:px-16 py-20 min-h-[480px] overflow-hidden"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1591491653056-4e9ba7e4f49c?w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/65" />

          <div className="relative z-10 max-w-sm">
            <p className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              Training Systems
            </p>
            <h2
              className="font-serif font-bold text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
            >
              Tour Pure Training
            </h2>
            <p className="font-sans text-white/75 text-base leading-relaxed mb-8 font-light">
              Improve tempo, sequencing, and ball-striking with structured repetition.
            </p>
            <Link
              to="/shop/$category"
              params={{ category: 'training-system' }}
              className="btn-gold inline-block px-8 py-4 font-sans font-semibold text-sm tracking-widest uppercase"
            >
              Shop Systems
            </Link>
          </div>
        </div>

        {/* Right Panel — Team Dominus Golf */}
        <div className="flex flex-col justify-end px-8 sm:px-12 lg:px-16 py-20 min-h-[480px] bg-secondary">
          <div className="max-w-sm">
            <p className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              Community
            </p>
            <h2
              className="font-serif font-bold text-foreground leading-tight mb-4"
              style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
            >
              Team Dominus Golf
            </h2>
            <p className="font-sans text-muted-foreground text-base leading-relaxed mb-8 font-light">
              Join the Dominus Golf community. Get training tips, exclusive offers, and early product access.
            </p>
            <Link
              to="/shop/$category"
              params={{ category: 'balls' }}
              className="btn-primary-black inline-block px-8 py-4 font-sans font-semibold text-sm tracking-widest uppercase"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
