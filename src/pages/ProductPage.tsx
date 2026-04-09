import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Star, Minus, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../store/cartStore';
import { ProductCard } from '../components/ui/ProductCard';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

export function ProductPage() {
  const { id } = useParams({ from: '/product/$id' });
  const product = products.find((p) => p.id === id);
  const { addItem, openCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0]?.options?.[0] ?? '',
  );
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [addedEffect, setAddedEffect] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const galleryImages = product?.gallery?.length
    ? product.gallery
    : [product?.image, product?.hoverImage ?? product?.image].filter(Boolean) as string[];

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="font-sans text-muted-foreground mb-8">
            The product you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="font-sans text-xs font-semibold tracking-widest uppercase border border-border px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Return Home
          </Link>
        </div>
        <Footer />
        <CartDrawer />
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    openCart();
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1500);
  };

  const accordionItems = [
    { id: 'description', label: 'Description', content: product.description },
    { id: 'features', label: 'Features', content: null },
    { id: 'specifications', label: 'Specifications', content: null },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-sans text-[11px] tracking-widest uppercase text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link
            to={`/shop/$category`}
            params={{ category: product.category }}
            className="hover:text-foreground transition-colors capitalize"
          >
            {product.category.replace(/-/g, ' ')}
          </Link>
          <ChevronRight size={10} />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image — constrained, centered, premium presentation */}
            <div className="w-full flex justify-center items-center bg-muted py-8 px-4">
              <div className="w-full max-w-[85vw] md:max-w-[520px] lg:max-w-[560px]">
                <img
                  src={galleryImages[activeImage]}
                  alt={product.name}
                  className="w-full h-auto object-contain transition-opacity duration-300"
                  style={{ maxHeight: '520px' }}
                />
              </div>
            </div>
            {galleryImages.length > 1 && (
              <div className="flex gap-2 px-1">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 bg-muted overflow-hidden border-2 transition-colors flex items-center justify-center ${
                      activeImage === i ? 'border-foreground' : 'border-transparent hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:pt-2">
            {product.badge && (
              <div className="inline-block mb-3 px-3 py-1 bg-accent text-accent-foreground font-sans font-semibold text-[10px] tracking-widest uppercase">
                {product.badge}
              </div>
            )}

            {product.subcategory && (
              <p className="font-sans text-[11px] font-medium tracking-widest uppercase text-muted-foreground mb-2">
                {product.subcategory}
              </p>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating — only shown if present */}
            {product.rating !== undefined && product.reviewCount !== undefined && (
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(product.rating!)
                          ? 'fill-accent text-accent'
                          : 'text-border fill-border'
                      }
                    />
                  ))}
                </div>
                <span className="font-sans text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-border">
              <span className="font-sans text-2xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="font-sans text-sm text-muted-foreground line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
              {product.compareAtPrice && (
                <span className="font-sans text-xs font-semibold text-destructive">
                  Save ${(product.compareAtPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Variants — new shape: { label, options[] } */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                {product.variants.map((variant) => (
                  <div key={variant.label} className="mb-4">
                    <p className="font-sans text-xs font-semibold tracking-widest uppercase text-foreground mb-3">
                      {variant.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedVariant(opt)}
                          className={`px-4 py-2 font-sans text-sm border transition-colors ${
                            selectedVariant === opt
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border text-foreground hover:border-foreground'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="font-sans text-xs font-semibold tracking-widest uppercase text-foreground mb-3">
                Quantity
              </p>
              <div className="flex items-center border border-border w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 h-11 flex items-center justify-center font-sans font-semibold text-sm border-x border-border">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-4 font-sans font-semibold text-sm tracking-widest uppercase transition-colors duration-200 ${
                  addedEffect
                    ? 'bg-accent text-accent-foreground'
                    : product.inStock
                    ? 'btn-primary-black'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {!product.inStock
                  ? 'Out of Stock'
                  : addedEffect
                  ? 'Added to Bag'
                  : 'Add to Bag'}
              </button>

              {(product.id === 'dominus-towel' || product.id === 'tour-pure-men') && product.inStock && (
                <a
                  href={
                    product.id === 'dominus-towel'
                      ? 'https://buy.stripe.com/5kQ6oBffi3WQbu396Affy0a'
                      : 'https://buy.stripe.com/9B65kx9UY2SMdCb3Mgffy06'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 font-sans font-semibold text-sm tracking-widest uppercase text-center btn-gold transition-colors duration-200"
                >
                  Buy Now
                </a>
              )}

              {/* Shopify-style Trust Info */}
              <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Star size={14} className="fill-accent" />
                  </div>
                  <span className="font-sans text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                    Premium Quality
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Plus size={14} />
                  </div>
                  <span className="font-sans text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                    Tour Proven
                  </span>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="mb-8 p-5 bg-muted">
              <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                Key Features
              </p>
              <ul className="space-y-2">
                {product.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5">
                    <span className="w-1 h-1 bg-accent shrink-0" />
                    <span className="font-sans text-sm text-foreground">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What's Included — bundle products only */}
            {product.includedImages && product.includedImages.length > 0 && (() => {
              const dedupedItems = product.includedImages!.filter(
                (item, idx, arr) =>
                  item.image !== product.image &&
                  arr.findIndex((x) => x.image === item.image) === idx
              );
              if (dedupedItems.length === 0) return null;
              return (
                <div className="mb-8 p-5 border border-border">
                  <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-4">
                    What's Included
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    {dedupedItems.map((item, i) => (
                      <div key={item.label} className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                            <img
                              src={item.image}
                              alt={item.label}
                              className="w-full h-full object-contain p-1.5"
                              loading="lazy"
                            />
                          </div>
                          <span className="font-sans text-[9px] font-medium tracking-wide text-muted-foreground text-center max-w-[64px] leading-tight">
                            {item.label}
                          </span>
                        </div>
                        {i < dedupedItems.length - 1 && (
                          <span className="text-muted-foreground/50 text-sm mb-4">+</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Accordion */}
            <div className="divide-y divide-border border-t border-border">
              {accordionItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === item.id ? null : item.id)
                    }
                    className="flex items-center justify-between w-full py-4 font-sans text-sm font-semibold text-foreground tracking-wide"
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        openAccordion === item.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === item.id && (
                    <div className="pb-5">
                      {item.id === 'features' ? (
                        <ul className="space-y-2">
                          {product.features.map((feat) => (
                            <li
                              key={feat}
                              className="flex items-start gap-2.5 font-sans text-sm text-muted-foreground"
                            >
                              <span className="w-1 h-1 bg-muted-foreground mt-2 shrink-0" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      ) : item.id === 'specifications' ? (
                        product.specs && product.specs.length > 0 ? (
                          <ul className="space-y-2">
                            {product.specs.map((spec) => (
                              <li key={spec} className="flex items-start gap-2.5 font-sans text-sm text-muted-foreground">
                                <span className="w-1 h-1 bg-muted-foreground mt-2 shrink-0" />
                                {spec}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="font-sans text-sm text-muted-foreground">Specifications coming soon.</p>
                        )
                      ) : (
                        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                          {item.content}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-border">
            <div className="mb-8">
              <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-2">
                You May Also Like
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
      <CartDrawer />

      {/* Sticky Mobile Add to Cart */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-20 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="font-serif text-sm font-bold text-foreground truncate">
              {product.name}
            </p>
            <p className="font-sans text-xs font-semibold text-accent">
              ${product.price.toFixed(2)}
            </p>
          </div>
          {(product.id === 'dominus-towel' || product.id === 'tour-pure-men') && product.inStock ? (
            <a
              href={
                product.id === 'dominus-towel'
                  ? 'https://buy.stripe.com/5kQ6oBffi3WQbu396Affy0a'
                  : 'https://buy.stripe.com/9B65kx9UY2SMdCb3Mgffy06'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 font-sans font-semibold text-xs tracking-widest uppercase btn-gold transition-colors duration-200"
            >
              Buy Now
            </a>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`px-6 py-3 font-sans font-semibold text-xs tracking-widest uppercase transition-colors duration-200 ${
                addedEffect
                  ? 'bg-accent text-accent-foreground'
                  : product.inStock
                  ? 'btn-primary-black'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {addedEffect ? 'Added' : 'Add to Bag'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
