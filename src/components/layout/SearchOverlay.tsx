import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { products } from '../../data/products';
import { cn } from '../../lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const results = query.trim() 
    ? products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.subcategory?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-background animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20 gap-4">
            <Search size={20} className="text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search training systems, apparel, gear..."
              className="flex-1 bg-transparent border-none outline-none font-serif text-xl sm:text-2xl placeholder:text-muted-foreground/40 text-foreground"
            />
            <button 
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close search"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {query.trim() === '' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-6">
                  Popular Categories
                </p>
                <div className="space-y-4">
                  {[
                    { label: 'Training Systems', href: '/shop/training-system' },
                    { label: 'Performance Apparel', href: '/shop/apparel' },
                    { label: 'Training Aids', href: '/shop/accessories' },
                    { label: 'Practice with a Pro', href: '/practice-with-pros' },
                  ].map((cat) => (
                    <Link
                      key={cat.label}
                      to={cat.href as any}
                      onClick={onClose}
                      className="group flex items-center justify-between py-2 border-b border-border hover:border-accent transition-colors"
                    >
                      <span className="font-serif text-2xl group-hover:text-accent transition-colors">
                        {cat.label}
                      </span>
                      <ArrowRight size={18} className="text-muted-foreground group-hover:text-accent transition-colors translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-6">
                  Suggested Products
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {products.slice(0, 4).map((p) => (
                    <Link
                      key={p.id}
                      to="/product/$id"
                      params={{ id: p.id }}
                      onClick={onClose}
                      className="group block"
                    >
                      <div className="aspect-square bg-muted overflow-hidden border border-border mb-3">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-foreground truncate">{p.name}</h4>
                      <p className="font-sans text-xs text-muted-foreground mt-1">${p.price.toFixed(2)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-8">
                {results.length} {results.length === 1 ? 'Result' : 'Results'} for "{query}"
              </p>
              
              {results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      to="/product/$id"
                      params={{ id: p.id }}
                      onClick={onClose}
                      className="group block"
                    >
                      <div className="aspect-square bg-white border border-border overflow-hidden mb-4 relative">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        {p.badge && (
                          <span className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-0.5 text-[8px] font-bold tracking-tighter uppercase">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-[9px] tracking-widest uppercase text-muted-foreground mb-1">
                        {p.subcategory || p.category.replace(/-/g, ' ')}
                      </p>
                      <h4 className="font-serif text-base font-bold text-foreground leading-tight">{p.name}</h4>
                      <p className="font-sans text-sm font-medium text-foreground mt-2">${p.price.toFixed(2)}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="font-serif text-2xl text-muted-foreground mb-4">No results found</p>
                  <p className="font-sans text-sm text-muted-foreground max-w-sm mx-auto">
                    We couldn't find any products matching your search. Try checking for typos or using broader keywords.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
