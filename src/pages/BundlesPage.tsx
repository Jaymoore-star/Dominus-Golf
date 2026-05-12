import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { Check, Info, ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';
import { useCart } from '../store/cartStore';
import { toast } from 'sonner';
import type { Product } from '../data/products';

type BundleTier = {
  id: string;
  name: string;
  price: number;
  description: string;
  badge?: string;
  features: string[];
  image: string;
  stripeUrl?: string;
};

const bundlesData = {
  men: [
    {
      id: 'tour-pure-alone-men',
      name: 'Tour Pure Alone',
      price: 59.99,
      category: 'training-system',
      description: 'The industry-leading weighted swing trainer.',
      features: ['Tour Pure Men', '90-Day Training Manual (PDF)'],
      image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FPhotoroom-20251125_1425462241__e480e1c6.png?alt=media&token=7c96a611-0b70-415f-a7f7-8bebe5a974a2',
      inStock: true,
    },
    {
      id: 'starter-bundle-men',
      name: 'Starter Bundle',
      price: 67.98,
      category: 'training-system',
      badge: 'POPULAR CHOICE',
      description: 'The essential connection for a repeatable swing.',
      features: ['Tour Pure Men', 'Feel Right Band', '90-Day Training Manual (PDF)'],
      image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBand__cc34ac6f.png?alt=media&token=9a5b1874-aaa1-4e7c-ac39-2f865b12225b',
      inStock: true,
    },
    {
      id: 'pro-bundle-men',
      name: 'Pro Bundle',
      price: 87.00,
      category: 'training-system',
      description: 'The complete professional training kit.',
      features: ['Tour Pure Men', 'Feel Right Band', 'Dominus Golf Towel', '90-Day Training Manual (PDF)'],
      image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FGolfTowel2__dfa91d93.png?alt=media&token=f24c8a91-7d2c-4962-854f-5c6ce02557d2',
      inStock: true,
    },
  ],
  women: [
    {
      id: 'tour-pure-alone-women',
      name: 'Tour Pure Alone',
      price: 59.99,
      category: 'training-system',
      description: 'The industry-leading weighted swing trainer.',
      features: ['Tour Pure Women', '90-Day Training Manual (PDF)'],
      image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FTourPureTrainerW2__165b6582.png?alt=media&token=9e37467f-20f0-4ad2-bde8-1af3d34acfd2',
      inStock: true,
    },
    {
      id: 'starter-bundle-women',
      name: 'Starter Bundle',
      price: 67.98,
      category: 'training-system',
      badge: 'POPULAR CHOICE',
      description: 'The essential connection for a repeatable swing.',
      features: ['Tour Pure Women', 'Feel Right Band', '90-Day Training Manual (PDF)'],
      image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBand__cc34ac6f.png?alt=media&token=9a5b1874-aaa1-4e7c-ac39-2f865b12225b',
      inStock: true,
    },
    {
      id: 'pro-bundle-women',
      name: 'Pro Bundle',
      price: 87.00,
      category: 'training-system',
      description: 'The complete professional training kit.',
      features: ['Tour Pure Women', 'Feel Right Band', 'Dominus Golf Towel', '90-Day Training Manual (PDF)'],
      image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FGolfTowel2__dfa91d93.png?alt=media&token=f24c8a91-7d2c-4962-854f-5c6ce02557d2',
      inStock: true,
    },
  ],
};

const comparisonFeatures = [
  { name: 'Tour Pure Weighted Trainer', starter: true, alone: true, pro: true },
  { name: '90-Day Training Manual (PDF)', starter: true, alone: true, pro: true },
  { name: 'Feel Right Connection Band', starter: true, alone: false, pro: true },
  { name: 'Premium Dominus Golf Towel', starter: false, alone: false, pro: true },
  { name: 'Priority Support', starter: true, alone: false, pro: true },
];

export function BundlesPage() {
  const [gender, setGender] = useState<'men' | 'women'>('men');
  const { addItem, openCart } = useCart();

  const handleAddToCart = (bundle: any) => {
    addItem({
      ...bundle,
      name: bundle.name + (gender === 'men' ? " (Men's)" : " (Women's)"),
    } as Product);
    toast.success('Added bundle to cart');
    openCart();
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/40 via-transparent to-transparent"></div>
          </div>
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-4">Bundles (Save Now)</p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">Build Your Game</h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Unlock tour-level consistency with our precision-engineered training bundles. 
              Designed for serious golfers committed to permanent improvement.
            </p>

            {/* Gender Toggle */}
            <div className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit mx-auto backdrop-blur-md border border-white/20">
              <button
                onClick={() => setGender('men')}
                className={`px-8 py-2.5 rounded-full text-sm font-semibold tracking-widest uppercase transition-all duration-300 ${
                  gender === 'men' 
                    ? 'bg-accent text-white shadow-lg scale-105' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Men's
              </button>
              <button
                onClick={() => setGender('women')}
                className={`px-8 py-2.5 rounded-full text-sm font-semibold tracking-widest uppercase transition-all duration-300 ${
                  gender === 'women' 
                    ? 'bg-accent text-white shadow-lg scale-105' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Women's
              </button>
            </div>
          </div>
        </section>

        {/* Bundles Grid */}
        <section className="py-24 px-4 bg-secondary">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {bundlesData[gender].map((bundle) => (
                <div 
                  key={bundle.id}
                  className={`relative flex flex-col bg-background border transition-all duration-500 hover:shadow-2xl group ${
                    bundle.badge 
                      ? 'border-accent shadow-xl scale-105 z-10' 
                      : 'border-border hover:border-accent/40'
                  }`}
                >
                  {bundle.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-6 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full shadow-lg">
                      {bundle.badge}
                    </div>
                  )}

                  <div className="p-8 pb-4">
                    <h3 className="font-serif text-3xl font-bold mb-2">{bundle.name}</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-primary">${bundle.price}</span>
                      <span className="text-muted-foreground text-sm uppercase tracking-widest">USD</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">{bundle.description}</p>
                  </div>

                  <div className="px-8 aspect-square overflow-hidden bg-white flex items-center justify-center p-4">
                    <img 
                      src={bundle.image} 
                      alt={bundle.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  <div className="p-8 pt-6 flex-1 flex flex-col">
                    <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-4">What's Included:</p>
                    <ul className="space-y-3 mb-8 flex-1">
                      {bundle.features.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <Check size={16} className="text-accent shrink-0 mt-0.5" />
                          <span className="text-primary/80">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleAddToCart(bundle)}
                      className={`w-full py-4 font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-3 transition-all duration-300 ${
                        bundle.badge
                          ? 'bg-accent text-white hover:bg-accent/90 shadow-md'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      Add to Cart
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 bg-white/50 border border-dashed border-border rounded-xl p-6 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Info size={20} className="text-accent" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                <span className="text-primary font-bold">Important:</span> All bundles include the <span className="text-primary font-bold">90-Day Training Manual</span> in PDF format, which will be emailed to your registered address immediately after purchase.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-24 px-4 bg-background overflow-x-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold mb-4">Compare Bundles</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">See exactly what you'll get with each training tier to make the best choice for your game.</p>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="py-6 px-4 text-left border-b border-border bg-secondary/30 w-1/3">
                    <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Feature</span>
                  </th>
                  <th className="py-6 px-4 text-center border-b border-border bg-secondary/30">
                    <span className="text-xs font-bold tracking-widest uppercase text-primary">Alone</span>
                  </th>
                  <th className="py-6 px-4 text-center border-b-2 border-accent bg-accent/5">
                    <span className="text-xs font-bold tracking-widest uppercase text-accent">Starter</span>
                  </th>
                  <th className="py-6 px-4 text-center border-b border-border bg-secondary/30">
                    <span className="text-xs font-bold tracking-widest uppercase text-primary">Pro</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-5 px-4 border-b border-border text-sm font-medium">{feature.name}</td>
                    <td className="py-5 px-4 border-b border-border text-center">
                      {feature.alone ? <Check size={20} className="text-accent mx-auto" /> : <span className="text-muted-foreground/30">—</span>}
                    </td>
                    <td className="py-5 px-4 border-b border-border text-center bg-accent/5">
                      {feature.starter ? <Check size={20} className="text-accent mx-auto" /> : <span className="text-muted-foreground/30">—</span>}
                    </td>
                    <td className="py-5 px-4 border-b border-border text-center">
                      {feature.pro ? <Check size={20} className="text-accent mx-auto" /> : <span className="text-muted-foreground/30">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="py-8 px-4 border-t border-border"></td>
                  <td className="py-8 px-4 text-center border-t border-border">
                    <span className="block text-xl font-bold mb-2">$59.99</span>
                  </td>
                  <td className="py-8 px-4 text-center border-t-2 border-accent bg-accent/5">
                    <span className="block text-xl font-bold mb-2 text-accent">$67.98</span>
                  </td>
                  <td className="py-8 px-4 text-center border-t border-border">
                    <span className="block text-xl font-bold mb-2">$87.00</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-24 px-4 bg-secondary">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <Truck size={32} className="text-accent" />
              </div>
              <h4 className="font-serif text-2xl font-bold mb-3">Priority Shipping</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Bundle orders receive priority handling and typically ship within 24 hours of order placement.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <Zap size={32} className="text-accent" />
              </div>
              <h4 className="font-serif text-2xl font-bold mb-3">Instant Training</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get your 90-day training curriculum immediately via email and start training while your tools are in transit.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
