import { Link } from '@tanstack/react-router';

export function MidCTASection() {
  return (
    <section className="w-full bg-[#141414] border-b border-white/10 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-5">
          Get Started
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight mb-6 max-w-2xl mx-auto">
          Start Building a More Consistent Swing Today
        </h2>
        <p className="font-sans text-base text-white/50 leading-relaxed mb-10 max-w-xl mx-auto">
          Tour Pure helps golfers train movement patterns, tempo, and swing path without hitting a ball.
        </p>
        <Link
          to="/product/$id"
          params={{ id: 'tour-pure-men' }}
          className="inline-block font-sans font-semibold text-sm tracking-widest uppercase px-10 py-4 bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
        >
          Get Tour Pure — $59.99
        </Link>
      </div>
    </section>
  );
}
