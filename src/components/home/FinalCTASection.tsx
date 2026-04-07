import { Link } from '@tanstack/react-router';

export function FinalCTASection() {
  return (
    <section className="w-full bg-primary py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-5">
          Dominus Golf
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight mb-6">
          Train Smarter.<br />Swing Better.
        </h2>
        <p className="font-sans text-base text-primary-foreground/70 leading-relaxed mb-10 max-w-md mx-auto">
          Build a more repeatable swing with Tour Pure.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/product/tour-pure-men"
            className="inline-block font-sans font-semibold text-sm tracking-widest uppercase px-10 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-200"
          >
            Order Tour Pure Now
          </Link>
          <Link
            to="/shop/training-system"
            className="inline-block font-sans font-semibold text-sm tracking-widest uppercase px-10 py-4 border border-primary-foreground/40 text-primary-foreground hover:border-primary-foreground transition-colors duration-200"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
