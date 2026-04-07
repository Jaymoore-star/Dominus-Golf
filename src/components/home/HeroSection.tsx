import { Link } from '@tanstack/react-router';

const HERO_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FPhotoroom-20251125_1425462241__e480e1c6.png?alt=media&token=7c96a611-0b70-415f-a7f7-8bebe5a974a2';

export function HeroSection() {
  return (
    <section className="w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text */}
          <div className="order-1">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-5">
              Tour Pure Training System
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-foreground leading-[1.08] mb-6">
              Fix Your Swing<br />Without Hitting<br />a Ball
            </h1>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed mb-3 max-w-[500px]">
              Train swing path, tempo, and movement patterns with the Tour Pure training system.
            </p>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-10 max-w-[480px]">
              Built for golfers who want repeatable mechanics, better control, and a more consistent swing.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/product/tour-pure-men"
                className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
              >
                Start Training Today
              </Link>
              <Link
                to="/shop/training-system"
                className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-8 py-4 border border-foreground text-foreground hover:bg-muted transition-colors duration-200"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="order-2 flex justify-center lg:justify-end">
            <div className="w-full max-w-[84vw] sm:max-w-[400px] lg:max-w-[540px]">
              <img
                src={HERO_IMAGE}
                alt="Tour Pure weighted swing trainer"
                className="w-full h-auto object-contain"
                style={{ maxHeight: '580px' }}
                loading="eager"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
