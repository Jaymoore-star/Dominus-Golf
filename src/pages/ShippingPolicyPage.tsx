import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

const sections = [
  {
    title: 'Processing Time',
    body: `All orders are processed within 1–3 business days of payment confirmation. Orders placed on weekends or federal holidays will be processed on the next available business day. You will receive a confirmation email with your tracking number once your order ships.`,
  },
  {
    title: 'Shipping Rates & Delivery Estimates',
    body: `We offer free standard shipping on all domestic orders over $150. Standard shipping (3–7 business days) is available on all orders. Expedited shipping options are available at checkout. Delivery estimates are provided by the carrier and are not guaranteed by Dominus Golf.`,
    list: [
      'Standard Shipping (3–7 business days): Calculated at checkout',
      'Expedited Shipping (2–3 business days): Calculated at checkout',
      'Free Standard Shipping on orders over $150',
    ],
  },
  {
    title: 'Domestic Shipping',
    body: `We ship to all 50 U.S. states including Alaska, Hawaii, and U.S. territories via USPS, UPS, and FedEx. P.O. Box shipping is available for standard shipping methods only.`,
  },
  {
    title: 'International Shipping',
    body: `At this time, Dominus Golf ships exclusively within the United States. International shipping options are not currently available. We are working to expand our shipping reach — check back for updates.`,
  },
  {
    title: 'Order Tracking',
    body: `Once your order has shipped, you will receive an automated email containing your carrier and tracking number. You can track your shipment directly on the carrier's website. If you have not received a tracking email within 3 business days of your order, contact our support team.`,
  },
  {
    title: 'Damaged or Lost Shipments',
    body: `If your order arrives damaged, photograph the damage before opening the package and contact us within 48 hours of delivery at support@dominusgolf.com. Dominus Golf will work with the carrier to resolve the claim and replace your order at no additional cost. For lost shipments, contact us after the carrier's estimated delivery date has passed and we will initiate a trace.`,
  },
  {
    title: 'Returns & Exchanges',
    body: `Unopened products in original condition may be returned within 30 days of delivery for a full refund. To initiate a return, email support@dominusgolf.com with your order number and reason for return. Customers are responsible for return shipping costs unless the item was defective or incorrectly shipped. Refunds are processed within 5–7 business days of receiving the returned item.`,
  },
];

export function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Shipping & Returns
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            Shipping Policy
          </h1>
          <p className="font-sans text-sm text-white/55 mt-5 max-w-xl mx-auto leading-relaxed">
            Fast, reliable shipping from Florence, Arizona to your door.
          </p>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Processing', value: '1–3 Business Days' },
              { label: 'Free Shipping', value: 'Orders Over $150' },
              { label: 'Returns Window', value: '30 Days' },
            ].map((item) => (
              <div key={item.label} className="border border-border bg-background p-5 text-center">
                <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                  {item.label}
                </p>
                <p className="font-serif text-xl font-bold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="space-y-12">
          {sections.map((s, i) => (
            <div key={s.title}>
              <h2 className="font-serif text-xl font-bold text-foreground mb-4">{s.title}</h2>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">{s.body}</p>
              {s.list && (
                <ul className="space-y-2">
                  {s.list.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-[7px] w-1.5 h-1.5 bg-accent shrink-0" />
                      <span className="font-sans text-sm text-muted-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {i < sections.length - 1 && <div className="mt-12 border-b border-border" />}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-muted p-8 border-l-4 border-accent">
          <p className="font-serif text-base font-semibold text-foreground mb-2">
            Shipping questions?
          </p>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Contact us at{' '}
            <a href="mailto:support@dominusgolf.com" className="text-accent hover:underline">
              support@dominusgolf.com
            </a>{' '}
            — we respond within 1 business day.
          </p>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}
