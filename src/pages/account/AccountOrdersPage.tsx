import { Link } from '@tanstack/react-router';
import { Package } from 'lucide-react';
import { AccountLayout } from './AccountLayout';

/**
 * Orders has no data source yet: checkout hands off to a Square-hosted payment
 * link, and nothing records the resulting order against the Supabase user. So
 * this deliberately does not claim "no orders" — a customer who has ordered
 * would be reading a lie. It says what is actually true and points them at the
 * receipt that is their real record.
 *
 * To make this page real: store orders on payment confirmation, keyed by the
 * Supabase user id, and read them back here.
 */
export function AccountOrdersPage() {
  return (
    <AccountLayout
      active="orders"
      title="Orders"
      description="Your purchase history with Dominus Golf."
    >
      <div className="border border-border p-10 sm:p-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
          <Package size={26} className="text-muted-foreground" />
        </div>

        <h2 className="font-serif text-2xl font-bold text-foreground tracking-tight">
          Order history is on its way
        </h2>

        <p className="mt-3 font-sans text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          We're still linking completed purchases to your account, so orders won't
          appear here just yet. Your emailed receipt is your record in the meantime —
          and if you need anything at all, our team can look it up for you.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/shop/$category"
            params={{ category: 'all' }}
            className="w-full sm:w-auto sm:px-10 bg-primary text-primary-foreground py-3.5 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
          <Link
            to="/about/contact"
            className="w-full sm:w-auto sm:px-10 border border-border py-3.5 font-sans text-xs font-semibold tracking-widest uppercase text-foreground hover:bg-muted transition-colors duration-200"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </AccountLayout>
  );
}
