import { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from '@tanstack/react-router';
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

/**
 * Categories with nothing in them are dropped from the sidebar, so a shopper is
 * never sent to a dead end. They come back on their own as soon as a product is
 * assigned — no second list to keep in sync. The category being viewed is always
 * kept, otherwise a direct link to an empty one renders a sidebar with no active
 * item. Counted off the raw catalogue, not the filtered list, so moving the price
 * slider doesn't make categories disappear mid-browse.
 */
const stockedCategories = new Set(products.map((p) => p.category));

type FilterValues = { category: string; maxPrice: number; inStockOnly: boolean };

export function ShopPage() {
  const { category } = useParams({ from: '/shop/$category' });
  const [sort, setSort] = useState<SortKey>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(200);
  const [displayPrice, setDisplayPrice] = useState(200);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const navigate = useNavigate();

  // What the mobile drawer is editing. Seeded from the live values when it opens
  // and only committed on Apply Filters, so the results behind it hold still.
  const [draft, setDraft] = useState<FilterValues>({
    category,
    maxPrice: 200,
    inStockOnly: false,
  });

  const openMobileFilters = () => {
    setDraft({ category, maxPrice, inStockOnly });
    setMobileFiltersOpen(true);
  };

  const applyMobileFilters = () => {
    setMaxPrice(draft.maxPrice);
    setInStockOnly(draft.inStockOnly);
    setMobileFiltersOpen(false);
    if (draft.category !== category) {
      navigate({ to: '/shop/$category', params: { category: draft.category } });
    }
  };

  const categoryLabel = categoryLabels[category] ?? category;

  const categoryIsEmpty = !stockedCategories.has(category as Category);

  const visibleCategories = useMemo(
    () =>
      Object.entries(categoryLabels).filter(
        ([key]) => stockedCategories.has(key as Category) || key === category,
      ),
    [category],
  );

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

  /**
   * Rendered twice with different wiring.
   *
   * Desktop sidebar: `values` are the live ones and every change applies at once,
   * which is what you want when the results are visible beside the controls.
   *
   * Mobile drawer: `values` are a draft. Nothing reaches the results until Apply
   * Filters. Category was the worst of it — it was a Link, so tapping one
   * navigated immediately, changing the page behind a drawer that stayed open and
   * had to be dismissed by hand.
   */
  const renderFilters = (
    values: FilterValues,
    onChange: (patch: Partial<FilterValues>) => void,
    categoryAsLink: boolean,
  ) => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h4 className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-4 pb-2 border-b border-border">
          Category
        </h4>
        <ul className="space-y-2">
          {visibleCategories.map(([key, label]) => {
            const active = key === values.category;
            const cls = `font-sans text-sm transition-colors text-left ${
              active ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
            }`;
            return (
              <li key={key}>
                {categoryAsLink ? (
                  <Link to="/shop/$category" params={{ category: key }} className={cls}>
                    {label}
                  </Link>
                ) : (
                  <button type="button" onClick={() => onChange({ category: key })} className={cls}>
                    {label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-4 pb-2 border-b border-border">
          Max Price
        </h4>
        <p className="font-sans text-sm font-semibold text-foreground mb-3">
          Up to ${values.maxPrice.toLocaleString()}
        </p>
        <div className="py-3">
          <Slider
            min={10}
            max={200}
            step={5}
            value={values.maxPrice}
            onValueChange={(val) => onChange({ maxPrice: val })}
            onValueCommitted={(val) => onChange({ maxPrice: val })}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {priceRanges.map((p) => (
            <button
              key={p}
              onClick={() => onChange({ maxPrice: p })}
              className={`font-sans text-[10px] tracking-wide px-2.5 py-1 border transition-colors ${
                values.maxPrice === p
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
            onClick={() => onChange({ inStockOnly: !values.inStockOnly })}
            className={`w-8 h-4 relative rounded-full transition-colors cursor-pointer ${
              values.inStockOnly ? 'bg-primary' : 'bg-border'
            }`}
          >
            <div
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-background shadow-sm transition-transform ${
                values.inStockOnly ? 'translate-x-[18px]' : 'translate-x-0.5'
              }`}
            />
          </div>
          <span className="font-sans text-sm text-foreground">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  const liveValues: FilterValues = { category, maxPrice, inStockOnly };

  const applyLive = (patch: Partial<FilterValues>) => {
    if (patch.maxPrice !== undefined) setMaxPrice(patch.maxPrice);
    if (patch.inStockOnly !== undefined) setInStockOnly(patch.inStockOnly);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Category header. Deliberately typographic rather than a photo band: a
          short full-width crop turns centred product shots into a blown-up
          detail, and every category would need a wide image shot for it. */}
      <header className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 border-b border-border">
        <nav className="flex items-center gap-2 font-sans text-[11px] tracking-widest uppercase text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{categoryLabel}</span>
        </nav>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
          {categoryLabel}
        </h1>
        <p className="font-sans text-muted-foreground text-sm mt-2">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </p>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Mobile Filter / Sort bar */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <button
            onClick={openMobileFilters}
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
              <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg z-20 w-52">
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
            {renderFilters(liveValues, applyLive, true)}
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
                  <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg z-20 w-52">
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
              /* A category with nothing in it isn't a filtering problem, so it
                 doesn't get filtering advice — that reads as broken when the
                 shopper hasn't touched a control. Only reachable by direct link
                 now that empty categories are hidden from the sidebar. */
              categoryIsEmpty ? (
                <div className="text-center py-20">
                  <p className="font-serif text-2xl text-muted-foreground mb-4">
                    Coming soon
                  </p>
                  <p className="font-sans text-sm text-muted-foreground mb-6">
                    There is nothing in this category yet.
                  </p>
                  <Link
                    to="/shop/$category"
                    params={{ category: 'training-system' }}
                    className="inline-block font-sans text-xs font-semibold tracking-widest uppercase border border-border px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Browse Training Systems
                  </Link>
                </div>
              ) : (
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
              )
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
            {renderFilters(draft, (patch) => setDraft((d) => ({ ...d, ...patch })), false)}
            <button
              onClick={applyMobileFilters}
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
