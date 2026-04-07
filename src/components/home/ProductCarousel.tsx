import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../../data/products';
import { ProductCard } from '../ui/ProductCard';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const newArrivals = ['tour-pure-women', 'pro-performance-system', 'core-training-system-women', 'starter-system-women', 'feel-right-band', 'tour-pure-jr', 'dominus-towel', 'core-training-system-men'];

export function ProductCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ref = useScrollAnimation();

  const carouselProducts = newArrivals
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  const scrollBy = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: dir === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-20 bg-muted" ref={ref}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 scroll-animate">
          <div>
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-2">
              Just Arrived
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              New Arrivals
            </h2>
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollBy('left')}
              className="w-10 h-10 flex items-center justify-center border border-border hover:border-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200 text-foreground"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollBy('right')}
              className="w-10 h-10 flex items-center justify-center border border-border hover:border-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200 text-foreground"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-animate"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {carouselProducts.map((product) => (
            <div key={product.id} className="shrink-0 w-56 sm:w-64">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
