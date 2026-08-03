import { useEffect, useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Loader2 } from 'lucide-react';
import { useCart, lineKeyOf } from '../../store/cartStore';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useScrollLock } from '../../hooks/useScrollLock';
import { clearPendingAction, peekPendingAction } from '../../lib/pendingAction';
import { trackBeginCheckout } from '../../lib/analytics';
import { Link } from '@tanstack/react-router';
import { createCheckoutSession } from '../../lib/checkout';
import { variantLabel, variantDescriptor } from '../../lib/productVariants';
import { displayProductName } from '../../lib/productName';


export function CartDrawer() {
  const { state, closeCart, openCart, removeItem, updateQuantity, total, itemCount } = useCart();
  const { ensureAuth } = useRequireAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useScrollLock(state.isOpen);

  /**
   * Make the browser Back button close the bag instead of leaving the page.
   *
   * Opening the bag changed nothing in history, so Back did what it always does
   * and navigated away — losing the page behind an overlay the customer thought
   * they were dismissing. Opening now pushes one history entry; Back pops it and
   * we close instead. Closing through the X or Continue Shopping goes back
   * ourselves so the entry never lingers.
   */
  useEffect(() => {
    if (!state.isOpen) return;

    window.history.pushState({ dominusCart: true }, '');
    const onPop = () => closeCart();
    window.addEventListener('popstate', onPop);

    return () => {
      window.removeEventListener('popstate', onPop);
      // Only unwind the entry we added. If this cleanup ran because the user
      // pressed Back, it is already gone and going back again would skip a page.
      if (window.history.state?.dominusCart) window.history.back();
    };
  }, [state.isOpen, closeCart]);

  // Coming back from the login gate, reopen the cart so checkout is one click
  // away rather than buried behind the cart icon again. Only claim the action
  // if it is ours — this component mounts on pages that stash other actions.
  useEffect(() => {
    if (peekPendingAction()?.type === 'openCart') {
      clearPendingAction();
      openCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckout = async () => {
    if (state.items.length === 0) return;
    if (!ensureAuth({ type: 'openCart' })) { closeCart(); return; }
    setIsCheckingOut(true);
    setCheckoutError(null);
    trackBeginCheckout(state.items);

    try {
      // Square receives only these fields, so the size has to be folded into
      // the name — otherwise the order arrives with no way to fulfil it.
      const lineItems = state.items.map((item) => ({
        name: item.product.name,
        variant: variantDescriptor(item.product, item.variant),
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      const url = await createCheckoutSession(lineItems);
      window.open(url, '_blank', 'noopener,noreferrer');
      closeCart();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setCheckoutError(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {state.isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
          onClick={closeCart}
        />
      )}

      {/*
        Viewport-sized clipping wrapper.

        Closed, the panel below is translated a full width to the right, so it sits
        outside the viewport — an on-device probe at 440px showed it and its whole
        subtree (header, item list, subtotal) extending to right=880. That was
        contained only by `html { overflow-x: clip }`, which Safari 15 and older
        ignore, so on those the closed bag could still make the page scroll
        sideways. Clipping it here makes it correct rather than merely masked.

        pointer-events-none so the wrapper never swallows taps meant for the page;
        the panel re-enables them for itself.
      */}
      <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 right-0 h-full w-full sm:w-[420px] bg-background flex flex-col pointer-events-auto transition-transform duration-300 ease-in-out ${
            state.isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ boxShadow: 'var(--shadow-2xl)' }}
        >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <h2 className="font-sans font-semibold tracking-widest uppercase text-sm text-foreground">
              Your Bag
            </h2>
            {itemCount > 0 && (
              <span className="font-sans text-xs text-muted-foreground">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {/* Shipping Progress */}
          {state.items.length > 0 && (
            <div className="px-6 py-4 border-b border-border bg-accent/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-[10px] font-semibold tracking-widest uppercase">
                  {total >= 150 ? (
                    <span className="text-accent">Congrats! You've got Free Shipping</span>
                  ) : (
                    <>You're <span className="text-accent">${(150 - total).toFixed(2)}</span> away from Free Shipping</>
                  )}
                </span>
                <span className="font-sans text-[10px] font-medium opacity-60">
                  {Math.min(100, (total / 150) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1 w-full bg-border overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, (total / 150) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {state.items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <ShoppingBag size={48} className="text-border mb-4" strokeWidth={1} />
              <h3 className="font-serif text-xl text-foreground mb-2">
                Your bag is empty
              </h3>
              <p className="font-sans text-sm text-muted-foreground mb-6 leading-relaxed">
                Add some Dominus Golf equipment to get started.
              </p>
              <button
                onClick={closeCart}
                className="font-sans text-xs font-semibold tracking-widest uppercase border border-border px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {state.items.map((item) => (
                <li key={lineKeyOf(item)} className="flex gap-4 px-6 py-5">
                  {/* Image */}
                  <Link
                    to="/product/$id"
                    params={{ id: item.product.id }}
                    onClick={closeCart}
                    className="shrink-0 w-20 h-20 bg-white border border-border overflow-hidden"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-sans text-[10px] tracking-widest uppercase text-muted-foreground mb-0.5">
                          {item.product.subcategory}
                        </p>
                        <h4 className="font-serif text-sm font-semibold text-foreground leading-tight">
                          {displayProductName(item.product.name)}
                        </h4>
                        {item.variant && (
                          <p className="font-sans text-[11px] text-muted-foreground mt-1">
                            {variantLabel(item.product)}:{' '}
                            <span className="text-foreground font-medium">{item.variant}</span>
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(lineKeyOf(item))}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(lineKeyOf(item), item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center font-sans text-sm font-medium text-foreground border-x border-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(lineKeyOf(item), item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-sans font-semibold text-sm text-foreground">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-border px-6 py-6 space-y-4 bg-background">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground">
                Subtotal
              </span>
              <span className="font-sans font-semibold text-lg text-foreground">
                ${total.toFixed(2)}
              </span>
            </div>

            <p className="font-sans text-[11px] text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>

            {/* Error */}
            {checkoutError && (
              <p className="font-sans text-[11px] text-red-500">{checkoutError}</p>
            )}

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="btn-gold w-full py-4 font-sans font-semibold tracking-widest uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Preparing Checkout…
                </>
              ) : (
                'Checkout'
              )}
            </button>

            {/* View cart link */}
            <button
              onClick={closeCart}
              className="w-full text-center font-sans text-xs font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors py-1 underline underline-offset-4"
            >
              Continue Shopping
            </button>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
