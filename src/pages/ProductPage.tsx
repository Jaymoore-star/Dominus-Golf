import { useEffect, useState } from 'react';

import { useParams, Link } from '@tanstack/react-router';
import { ChevronRight, Loader2 } from 'lucide-react';

import { BACKEND_URL } from '../lib/backend';

async function createCheckoutSession(
  items: { name: string; price: number; quantity: number; image?: string }[]
): Promise<string> {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.dominusgolf.com';
  const res = await fetch(`${BACKEND_URL}/api/square/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items,
      successUrl: `${origin}/?checkout=success`,
      cancelUrl: `${origin}/?checkout=cancelled`,
    }),
  });
  const data = await res.json() as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || 'Failed to create checkout session');
  return data.url;
}
import { products } from '../data/products';
import { useCart } from '../store/cartStore';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { clearPendingAction, peekPendingAction } from '../lib/pendingAction';
import { trackViewItem, trackAddToCart, trackBeginCheckout } from '../lib/analytics';
import { ProductCard } from '../components/ui/ProductCard';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { ProductGallery } from '../features/product/components/ProductGallery';
import { ProductInfo } from '../features/product/components/ProductInfo';
import { ProductAccordion } from '../features/product/components/ProductAccordion';
import { ProductReviews } from '../features/product/components/ProductReviews';
import { TourPureOverview } from '../features/product/components/TourPureOverview';
import { FeelRightBandOverview } from '../features/product/components/FeelRightBandOverview';

export function ProductPage() {
  const { id } = useParams({ from: '/product/$id' });
  const product = products.find((p) => p.id === id);
  const { addItem, openCart } = useCart();
  const { ensureAuth } = useRequireAuth();

  // If the login gate interrupted a Buy Now on this product, bring the user's
  // quantity and variant back rather than silently resetting their choices.
  const [resumedBuyNow] = useState(() => {
    const pending = peekPendingAction();
    return pending?.type === 'buyNow' && pending.productId === id ? pending : null;
  });

  useEffect(() => {
    if (resumedBuyNow) clearPendingAction();
  }, [resumedBuyNow]);

  // Declared before the not-found early return below so the hook order stays
  // stable; the guard handles an unknown product id.
  useEffect(() => {
    if (product) trackViewItem(product);
  }, [product]);

  const [quantity, setQuantity] = useState(resumedBuyNow?.quantity ?? 1);
  const [selectedVariant, setSelectedVariant] = useState(
    resumedBuyNow?.variant ?? product?.variants?.[0]?.options?.[0] ?? '',
  );
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [addedEffect, setAddedEffect] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const scrollToReviews = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('reviews-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const galleryImages = product?.gallery?.length
    ? product.gallery
    : [product?.image, product?.hoverImage ?? product?.image].filter(Boolean) as string[];

  // Prefer same-category products; if fewer than 4, top up with others so
  // the "You May Also Like" row always feels complete.
  const sameCategory = products.filter(
    (p) => product && p.category === product.category && p.id !== product.id,
  );
  const otherProducts = products.filter(
    (p) => product && p.id !== product.id && p.category !== product.category,
  );
  const related = [...sameCategory, ...otherProducts].slice(0, 4);

  const [isBuyingNow, setIsBuyingNow] = useState(false);

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

  const handleBuyNow = async () => {
    if (!ensureAuth({ type: 'buyNow', productId: id, quantity, variant: selectedVariant })) return;
    // Always generate a Square payment link dynamically from the backend
    // (access token + location ID) so no per-product links are needed.
    setIsBuyingNow(true);
    trackBeginCheckout([{ product, quantity }]);
    try {
      const url = await createCheckoutSession([{
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      }]);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, { track: false });
    }
    trackAddToCart(product, quantity);
    openCart();
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1500);
  };

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
            to="/shop/$category"
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
          <ProductGallery
            productName={product.name}
            galleryImages={galleryImages}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
          />

          <div className="lg:pt-2">
            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              isBuyingNow={isBuyingNow}
              addedEffect={addedEffect}
              scrollToReviews={scrollToReviews}
            />

            <ProductAccordion
              product={product}
              openAccordion={openAccordion}
              setOpenAccordion={setOpenAccordion}
            />
          </div>
        </div>

        {/* Tour Pure Overview (Conditional) */}
        {product.id.startsWith('tour-pure') && <TourPureOverview />}
        {product.id === 'feel-right-band' && <FeelRightBandOverview />}

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

        {/* Reviews Section */}
        <ProductReviews product={product} />
      </div>

      <Footer />
      <CartDrawer />

      {/* Sticky Mobile Add to Cart */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-20 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-4">
          {/* min-w-0 is load-bearing: a flex item keeps min-width:auto, so it will
              not shrink below its content, and `truncate` sets white-space:nowrap
              which makes that min-content the WHOLE product name. Without it the
              long names (Mastering the Game, Training Manual PDF) widened this row
              and pushed the button off screen - 170px past the edge at 320px. */}
          <div className="flex-1 min-w-0">
            <p className="font-serif text-sm font-bold text-foreground truncate">
              {product.name}
            </p>
            <p className="font-sans text-xs font-semibold text-accent">
              ${product.price.toFixed(2)}
            </p>
          </div>
          {product.inStock ? (
            <button
              onClick={handleBuyNow}
              disabled={isBuyingNow}
              className="shrink-0 px-6 py-3 font-sans font-semibold text-xs tracking-widest uppercase btn-gold transition-colors duration-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isBuyingNow ? (
                <><Loader2 size={12} className="animate-spin" /> Preparing…</>
              ) : 'Buy Now'}
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`shrink-0 px-6 py-3 font-sans font-semibold text-xs tracking-widest uppercase transition-colors duration-200 ${
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
