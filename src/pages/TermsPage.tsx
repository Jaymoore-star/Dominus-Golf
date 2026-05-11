import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using the Dominus Golf website (dominusgolf.com) or purchasing any Dominus Golf product, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, do not use this website or purchase our products.`,
  },
  {
    title: '2. Products and Descriptions',
    body: `Dominus Golf makes every effort to display accurate product descriptions, specifications, and pricing. However, we reserve the right to correct any errors and are not responsible for typographical mistakes. Product images are for illustrative purposes and may vary slightly from the actual product.`,
  },
  {
    title: '3. Pricing and Payment',
    body: `All prices are listed in U.S. Dollars (USD) and are subject to change without notice. Sales tax will be applied where required by law. We accept all major credit cards and debit cards through our secure payment processor. Payment is required in full at the time of purchase.`,
  },
  {
    title: '4. Order Acceptance',
    body: `Your placement of an order constitutes an offer to purchase. Dominus Golf reserves the right to cancel any order for any reason, including but not limited to product unavailability, pricing errors, or suspected fraud. In the event of cancellation, you will be refunded in full.`,
  },
  {
    title: '5. Intellectual Property',
    body: `All content on this website — including but not limited to text, images, graphics, logos, and product designs — is the exclusive property of Dominus Golf LLC and is protected by applicable intellectual property laws. You may not reproduce, distribute, or use any content without express written permission.`,
  },
  {
    title: '6. Assumption of Risk',
    body: `All weighted training equipment carries inherent risk of injury if used improperly. By purchasing and using Tour Pure or any other Dominus Golf training product, you acknowledge that you have read and understood the Safety Disclaimer and voluntarily assume all risk associated with use. Dominus Golf LLC is not liable for injuries resulting from improper use.`,
  },
  {
    title: '7. Limitation of Liability',
    body: `To the fullest extent permitted by law, Dominus Golf LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our products or website. Our total liability to you shall not exceed the amount you paid for the specific product giving rise to the claim.`,
  },
  {
    title: '8. Returns and Refunds',
    body: `Our return and refund policy is outlined in our Shipping Policy page. Dominus Golf reserves the right to deny returns or exchanges that do not comply with our stated policy. All decisions regarding returns are final.`,
  },
  {
    title: '9. Privacy',
    body: `We respect your privacy. Information collected through this website is used solely to fulfill your order and improve your experience. We do not sell or share your personal information with third parties except as required to fulfill your order (e.g., shipping carriers).`,
  },
  {
    title: '10. Governing Law',
    body: `These Terms and Conditions are governed by the laws of the State of Arizona, United States, without regard to conflict of law principles. Any disputes arising from these terms shall be resolved in the courts of Pinal County, Arizona.`,
  },
  {
    title: '11. Changes to Terms',
    body: `Dominus Golf reserves the right to update or modify these Terms and Conditions at any time without prior notice. Continued use of the website or purchase of products following any changes constitutes your acceptance of the revised terms. The date of the most recent revision will be noted below.`,
  },
];

export function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Legal
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="font-sans text-sm text-white/55 mt-5 max-w-xl mx-auto leading-relaxed">
            Last updated: May 2026. Please read these terms carefully before using our website or products.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="space-y-12">
          {sections.map((s, i) => (
            <div key={s.title}>
              <h2 className="font-serif text-xl font-bold text-foreground mb-4">{s.title}</h2>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              {i < sections.length - 1 && <div className="mt-12 border-b border-border" />}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-muted p-8 border-l-4 border-accent">
          <p className="font-serif text-base font-semibold text-foreground mb-2">
            Questions about our Terms?
          </p>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Contact us at{' '}
            <a href="mailto:support@dominusgolf.com" className="text-accent hover:underline">
              support@dominusgolf.com
            </a>
          </p>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}
