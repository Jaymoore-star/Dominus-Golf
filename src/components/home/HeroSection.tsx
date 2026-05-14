import { Link } from '@tanstack/react-router';

export function HeroSection() {
  return (
    <section className="w-full bg-[#0e0e0e] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">

        {/* Single full-width text column */}
        <div className="max-w-3xl">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-6">
            Tour Pure Training System
          </p>
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
