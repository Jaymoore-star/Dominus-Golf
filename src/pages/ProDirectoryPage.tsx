import { useState } from 'react';
import { Search } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { ProCard } from '../features/pros/components/ProCard';
import { ProModal } from '../features/pros/components/ProModal';
import { MethodologySection } from '../features/pros/components/MethodologySection';
import { pros } from '../features/pros/data';
import { Pro } from '../features/pros/types';

export function ProDirectoryPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Pro | null>(null);

  const filtered = pros.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      q === '' ||
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.affiliation.toLowerCase().includes(q);
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="w-full bg-[#0a0a0a] border-b border-white/10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Professional Coaching
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            Practice with a Pro
          </h1>
          <p className="font-sans text-base text-white/55 max-w-xl mx-auto leading-relaxed">
            Professional-grade mentorship from Dominus Golf's national network of pros. Find your Pro, view their sessions, and book direct.
          </p>
        </div>
      </section>

      {/* Instruction vs. Integration Section */}
      <MethodologySection />

      {/* Grid */}
      <section className="w-full bg-[#0e0e0e] py-12 sm:py-20 px-4 min-h-[400px]">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-16">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search our professionals…"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white placeholder:text-white/20 font-sans text-sm focus:outline-none focus:border-accent transition-all duration-300"
              />
            </div>
          </div>

          <div className="mb-12">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              Professional Golfers
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Our Professional Golfers
            </h2>
          </div>
          {filtered.length > 0 ? (
            <>
              <p className="font-sans text-[11px] text-white/30 tracking-widest uppercase mb-8">
                {filtered.length} pro{filtered.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((pro) => (
                  <ProCard key={pro.id} pro={pro} onClick={() => setSelected(pro)} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-serif text-xl text-white/30 mb-3">No pros found</p>
              <p className="font-sans text-sm text-white/25">
                Try a different search term.
              </p>
              <button
                onClick={() => setSearch('')}
                className="mt-6 font-sans text-xs tracking-widest uppercase text-accent hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <CartDrawer />

      {/* Modal */}
      {selected && (
        <ProModal pro={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
