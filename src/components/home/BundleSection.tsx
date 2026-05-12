import { Link } from '@tanstack/react-router';

// Included item images (the Tour Pure trainer is the main card image — not repeated here)
const IMG_FEEL_RIGHT_BAND =
  'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBand__cc34ac6f.png?alt=media&token=9a5b1874-aaa1-4e7c-ac39-2f865b12225b';

const IMG_BOOK =
  'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FScreenshot_20260324_042207_SamsungInternet__2f2a1710.jpg?alt=media&token=4e6db837-c08e-4745-b0c4-9d9e5d607413';

const IMG_TOWEL =
  'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FChatGPTImageMar24202607_40_17PM__db70f8cf.png?alt=media&token=6b657a6c-36d1-4a74-b3d2-d28b5a2de9c9';

interface BundleItem {
  label: string;
  image: string;
}

interface Bundle {
  id: string;
  tier: string;
  name: string;
  price: string;
  compareAt: string;
  description: string;
  items: BundleItem[];
  href: string;
  featured?: boolean;
}

const bundles: Bundle[] = [
  {
    id: 'starter',
    tier: 'Starter',
    name: "Men's Starter System",
    price: '$67.98',
    compareAt: '$72.98',
    description:
      'Tour Pure + Feel Right Band — built to clean up mechanics and create consistency from day one.',
    items: [
      { label: 'Feel Right Band', image: IMG_FEEL_RIGHT_BAND },
    ],
    href: '/product/starter-system-men',
  },
  {
    id: 'core',
    tier: 'Core',
    name: "Men's Core System",
    price: '$87.97',
    compareAt: '$92.97',
    description:
      'Tour Pure + Feel Right Band + 90-Day Training Manual — full swing development in one system.',
    items: [
      { label: 'Feel Right Band', image: IMG_FEEL_RIGHT_BAND },
      { label: '90-Day Manual', image: IMG_BOOK },
    ],
    href: '/product/core-training-system-men',
    featured: true,
  },
  {
    id: 'pro',
    tier: 'Pro',
    name: 'Pro Performance System',
    price: '$109.99',
    compareAt: '$124.98',
    description:
      'The complete system: Tour Pure + Feel Right Band + 90-Day Manual + Dominus Golf Towel.',
    items: [
      { label: 'Feel Right Band', image: IMG_FEEL_RIGHT_BAND },
      { label: '90-Day Manual', image: IMG_BOOK },
      { label: 'Towel', image: IMG_TOWEL },
    ],
    href: '/product/pro-performance-system',
  },
];

function BundleCard({ bundle }: { bundle: Bundle }) {
  return (
    <div
      className={`flex flex-col border ${
        bundle.featured ? 'border-accent' : 'border-white/10'
      } bg-[#111111] relative`}
    >
      {/* Featured badge */}
      {bundle.featured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <span className="font-sans text-[10px] font-semibold tracking-[0.25em] uppercase bg-accent text-white px-4 py-1">
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className={`px-6 pt-8 pb-6 border-b ${bundle.featured ? 'border-accent/30' : 'border-white/8'}`}>
        <p className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-accent mb-2">
          {bundle.tier}
        </p>
        <h3 className="font-serif text-xl font-bold text-white mb-3 leading-snug">
          {bundle.name}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-serif text-3xl font-bold text-white">{bundle.price}</span>
          <span className="font-sans text-sm text-white/40 line-through">{bundle.compareAt}</span>
        </div>
        <p className="font-sans text-sm text-white/55 leading-relaxed">{bundle.description}</p>
      </div>

      {/* Included items */}
      <div className="px-6 py-6 flex-1">
        <p className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-white/40 mb-4">
          What's Included
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {bundle.items.map((item, i) => (
            <div key={item.label} className="flex items-center gap-3">
              {/* Item image */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-16 h-16 bg-white border border-white/8 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-contain p-1.5"
                    loading="lazy"
                  />
                </div>
                <span className="font-sans text-[9px] font-medium tracking-wide text-white/45 text-center max-w-[64px] leading-tight">
                  {item.label}
                </span>
              </div>
              {/* Plus separator — not after last */}
              {i < bundle.items.length - 1 && (
                <span className="text-white/25 text-sm font-light mb-4">+</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <Link
          to={bundle.href}
          className={`block w-full text-center font-sans font-semibold text-xs tracking-widest uppercase py-4 transition-colors duration-200 ${
            bundle.featured
              ? 'bg-accent text-white hover:bg-accent/90'
              : 'border border-white/25 text-white/80 hover:border-white hover:text-white'
          }`}
        >
          Build This System
        </Link>
      </div>
    </div>
  );
}

export function BundleSection() {
  return (
    <section className="w-full bg-[#0a0a0a] border-b border-white/10 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 lg:mb-16 max-w-2xl">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Training Bundles
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
            Build Your Complete System
          </h2>
          <p className="font-sans text-base text-white/50 leading-relaxed mt-4">
            Everything you need in one bundle. Save when you train with the full system.
          </p>
        </div>

        {/* Bundle cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 mt-12">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>

      </div>
    </section>
  );
}
