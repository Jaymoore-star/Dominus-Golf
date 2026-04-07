import { Link } from '@tanstack/react-router';
import { categoryCards } from '../../data/products';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export function CategoryGrid() {
  const ref = useScrollAnimation();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background" ref={ref}>
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 scroll-animate">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-3">
            Collections
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Shop By Category
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {categoryCards.map((cat, i) => (
            <Link
              key={cat.id}
              to={cat.href}
              className={`category-card group block scroll-animate scroll-animate-delay-${Math.min(i + 1, 4)}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted img-hover-scale">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-300" />

                {/* Category name */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-3">
                  <h3 className="category-gold-line font-serif text-white font-semibold text-sm sm:text-base text-center leading-tight pb-2">
                    {cat.label}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
