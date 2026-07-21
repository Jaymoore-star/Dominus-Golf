import { useState, useMemo } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { products, type Category } from '../data/products';
import { ProductCard } from '../components/ui/ProductCard';
import { ApparelProductCard } from '../components/ui/ApparelProductCard';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { Slider } from '../components/ui/slider';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const categoryLabels: Record<string, string> = {
  'training-system': 'Training Systems',
  'apparel': 'Dominus Golf Apparel',
  'accessories': 'Accessories',
  'mens-gear': "Men's Gear",
  'womens-gear': "Women's Gear",
};

const categoryHeroes: Record<string, string> = {
  'training-system': '/images/Photoroom-20251125_1425462241__e480e1c6.png',
  'apparel': '/images/unnamed-11__fc5a40f7.jpg',
  'accessories': '/images/Screenshot_20260324_042207_SamsungInternet__2f2a1710.jpg',
  'mens-gear': 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1400&q=80',
  'womens-gear': 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=1400&q=80',
};

export function ShopPage() {
  const { category } = useParams({ from: '/shop/$category' });
  const [sort, setSort] = useState<SortKey>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200);
  const [displayPrice, setDisplayPrice] = useState(200);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const categoryLabel = categoryLabels[category] ?? category;
  const heroImage = categoryHeroes[category] ?? categoryHeroes['training-system'];

  const filtered = useMemo(() => {
    // For apparel: only show primary products (those with colorVariants or no duplicate)
    // Exclude secondary color variants that are already covered by the primary card
    const APPAREL_SECONDARY_IDS = new Set([
      'dominus-tee-performance-white',
    ]);

    let list = products.filter(
      (p) => !category || category === 'all' || p.category === (category as Category),
    );

    if (category === 'apparel') {
      list = list.filter((p) => !APPAREL_SECONDARY_IDS.has(p.id));
    }

    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    list = list.filter((p) => p.price <= maxPrice);

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list = [...list]
          .filter((p) => p.badge === 'New')
          .concat([...list].filter((p) => p.badge !== 'New'));
        break;
      default:
        break;
    }

    return list;
  }, [category, sort, inStockOnly, maxPrice]);

  const sortLabels: Record<SortKey, string> = {
    featured: 'Featured',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    newest: 'New Arrivals',
  };

  const priceRanges = [25, 50, 75, 100, 150, 200];

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h4 className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-4 pb-2 border-b border-border">
          Category
        </h4>
        <ul className="space-y-2">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <li key={key}>
              <Link
                to="/shop/$category"
                params={{ category: key }}
                className={`font-sans text-sm transition-colors ${
                  key === category
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-4 pb-2 border-b border-border">
          Max Price
        </h4>
        <p className="font-sans text-sm font-semibold text-foreground mb-3">
          Up to ${maxPrice.toLocaleString()}
        </p>
        <div className="py-3">
          <Slider
            min={10}
            max={200}
            step={5}
            value={maxPrice}
            onValueChange={(val) => setMaxPrice(val)}
            onValueCommitted={(val) => setMaxPrice(val)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {priceRanges.map((p) => (
            <button
              key={p}
              onClick={() => setMaxPrice(p)}
              className={`font-sans text-[10px] tracking-wide px-2.5 py-1 border transition-colors ${
                maxPrice === p
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
              }`}
            >
              ${p}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-4 pb-2 border-b border-border">
          Availability
        </h4>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`w-8 h-4 relative transition-colors cursor-pointer ${
              inStockOnly ? 'bg-primary' : 'bg-border'
            }`}
          >
            <div
              className={`absolute top-0.5 w-3 h-3 bg-foreground transition-transform ${
                inStockOnly ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </div>
          <span className="font-sans text-sm text-foreground">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Category Hero */}
      <div className="relative h-52 sm:h-64 overflow-hidden bg-primary">
        <img
          src={heroImage}
          alt={categoryLabel}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <nav className="flex items-center gap-2 font-sans text-[11px] tracking-widest uppercase text-white/60 mb-4">
            <Link to="/" className="hover:text-white/90 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">{categoryLabel}</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            {categoryLabel}
          </h1>
          <p className="font-sans text-white/70 text-sm mt-2">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Mobile Filter / Sort bar */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 font-sans text-sm font-medium text-foreground border border-border px-4 py-2.5 hover:bg-muted transition-colors"
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>

          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 font-sans text-sm font-medium text-foreground border border-border px-4 py-2.5 hover:bg-muted transition-colors"
            >
              {sortLabels[sort]}
              <ChevronDown size={14} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-background border border-border shadow-lg z-10 w-52">
                {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setSort(key); setSortOpen(false); }}
                    className={`block w-full text-left px-4 py-3 font-sans text-sm hover:bg-muted transition-colors ${
                      sort === key ? 'font-semibold text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {sortLabels[key]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-10">
          {/* Sidebar - desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <FilterContent />
          </aside>

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            {/* Desktop sort bar */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="font-sans text-sm text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              </p>
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 font-sans text-sm font-medium text-foreground border border-border px-4 py-2 hover:bg-muted transition-colors"
                >
                  Sort: {sortLabels[sort]}
                  <ChevronDown size={13} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-background border border-border shadow-lg z-10 w-52">
                    {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => { setSort(key); setSortOpen(false); }}
                        className={`block w-full text-left px-4 py-3 font-sans text-sm hover:bg-muted transition-colors ${
                          sort === key ? 'font-semibold text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {sortLabels[key]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-muted-foreground mb-4">
                  No products found
                </p>
                <p className="font-sans text-sm text-muted-foreground mb-6">
                  Try adjusting your filters.
                </p>
                <button
                  onClick={() => { setMaxPrice(200); setInStockOnly(false); }}
                  className="font-sans text-xs font-semibold tracking-widest uppercase border border-border px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-8">
                {filtered.map((product) =>
                  category === 'apparel' ? (
                    <ApparelProductCard key={product.id} product={product} />
                  ) : (
                    <ProductCard key={product.id} product={product} />
                  )
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-72 bg-background z-50 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-sans font-semibold text-sm tracking-widest uppercase text-foreground">
                Filters
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <FilterContent />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-8 w-full py-3 bg-primary text-primary-foreground font-sans font-semibold text-xs tracking-widest uppercase"
            >
              Apply Filters
            </button>
          </div>
        </>
      )}

      <Footer />
      <CartDrawer />
    </div>
  );
}
