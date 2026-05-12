import { useState } from 'react';
import { products } from '../../data/products';
import { ProductCard } from '../ui/ProductCard';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const tabs = ['For You', 'Trending', 'New Arrivals'] as const;
type Tab = (typeof tabs)[number];

const tabProducts: Record<Tab, string[]> = {
  'For You': ['tour-pure-men', 'cya-tour-pure', 'tour-pure-women', 'feel-right-band', 'tour-pure-jr', 'dominus-towel'],
  Trending: ['tour-pure-men', 'cya-tour-pure', 'feel-right-band', 'tour-pure-women', 'dominus-towel'],
  'New Arrivals': ['cya-tour-pure', 'tour-pure-women', 'feel-right-band', 'tour-pure-jr', 'dominus-towel'],
};

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<Tab>('For You');
  const ref = useScrollAnimation();

  const displayProducts = tabProducts[activeTab]
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background" ref={ref}>
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 scroll-animate">
          <div>
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-3">
              Training
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Upgrade Your Game
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-sans text-xs font-medium tracking-widest uppercase transition-colors duration-150 border-b-2 ${
                  activeTab === tab
                    ? 'text-foreground border-foreground'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
          {displayProducts.slice(0, 8).map((product, i) => (
            <div
              key={`${activeTab}-${product.id}`}
              className="scroll-animate"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12 scroll-animate">
          <a
            href="/shop/training-system"
            className="inline-block font-sans text-xs font-semibold tracking-widest uppercase border border-foreground px-8 py-4 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}
