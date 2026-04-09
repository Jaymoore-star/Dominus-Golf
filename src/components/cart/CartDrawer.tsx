import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../store/cartStore';
import { Link } from '@tanstack/react-router';

const STRIPE_URLS: Record<string, string> = {
  'dominus-towel': 'https://buy.stripe.com/5kQ6oBffi3WQbu396Affy0a',
  'tour-pure-men': 'https://buy.stripe.com/9B65kx9UY2SMdCb3Mgffy06',
  'mastering-the-game-book': 'https://buy.stripe.com/6oU28l7MQ2SMfKj4Qkffy09',
  'feel-right-band': 'https://buy.stripe.com/9B63cpc36bpidCbdmQffy05',
};

export function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, total, itemCount } =
    useCart();

  return (
    <>
      {/* Backdrop */}
      {state.isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background z-50 flex flex-col transition-transform duration-300 ease-in-out ${
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
                <li key={item.product.id} className="flex gap-4 px-6 py-5">
                  {/* Image */}
                  <Link
                    to={`/product/$id`}
                    params={{ id: item.product.id }}
                    onClick={closeCart}
                    className="shrink-0 w-20 h-20 bg-muted overflow-hidden"
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
                          {item.product.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
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
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center font-sans text-sm font-medium text-foreground border-x border-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
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

            {/* Checkout button */}
            <button
              onClick={() => {
                const firstItem = state.items[0];
                const stripeUrl = firstItem ? STRIPE_URLS[firstItem.product.id] : undefined;
                if (stripeUrl) {
                  window.open(stripeUrl, '_blank', 'noopener,noreferrer');
                }
                closeCart();
              }}
              className="btn-gold w-full py-4 font-sans font-semibold tracking-widest uppercase text-sm"
            >
              Checkout
            </button>

            {/* View cart link */}
            <button
              onClick={closeCart}
              className="w-full text-center font-sans text-xs font-medium tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors py-1 underline underline-offset-4"
            >
              View Full Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
