import { Link } from '@tanstack/react-router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

/*
 * Every statement here describes what the site actually does, traced to the
 * code: Supabase accounts, Square checkout, the email list, the review-request
 * email, GA4, browser storage for the bag and wishlist, the affiliate code.
 * When a feature changes what is collected or who receives it, this page has to
 * change with it - an inaccurate privacy policy is worse than a short one.
 *
 * The Meta Pixel is described as something we may use: the code is wired but
 * no Pixel ID is set yet. Once it is, that sentence is already true.
 */

type Section = { title: string; paragraphs: string[]; list?: string[] };

const sections: Section[] = [
  {
    title: '1. Who We Are',
    paragraphs: [
      `This Privacy Policy explains how Dominus Golf LLC ("Dominus Golf", "we", "us") collects, uses and shares personal information when you visit dominusgolf.com, create an account, join our email list or buy from us.`,
    ],
  },
  {
    title: '2. Information You Give Us',
    paragraphs: ['We collect the information you choose to give us:'],
    list: [
      'Account details: your name, email address and password when you create an account, or your name and email from Google if you sign in with Google. Your password is handled by our login provider and is never visible to us.',
      'Saved account information: a shipping address you save, your wishlist, your bag, and your email preferences.',
      'Orders: the items you buy, the amount paid, your email address and your order status. Payment is taken by Square on its own secure checkout page. We never see or store your full card number.',
      'Email list: your email address when you join our list, and the one-time discount code we send you.',
      'Reviews: the rating, headline and review you write, shown publicly with your display name.',
      'Messages: your name, email address and message when you use our contact form.',
    ],
  },
  {
    title: '3. Information Collected Automatically',
    paragraphs: [
      'When you use the site, some information is collected automatically:',
    ],
    list: [
      'Analytics: we use Google Analytics to understand how visitors use the site, such as the pages viewed, products added to the bag and purchases made. Google Analytics uses cookies and collects information such as your device, browser and approximate location.',
      'Advertising: we may use advertising tools from Google and Meta (Facebook and Instagram), such as the Meta Pixel, to measure our ads and to show our ads to people who have visited the site.',
      'Browser storage: your browser keeps your bag, wishlist, any discount code you have applied, and whether you have seen our email signup, so they are there when you come back.',
      'Affiliate referrals: if you arrive through an affiliate link, the referral code is kept in your browser for up to 30 days and attached to your order, so the affiliate can be credited.',
    ],
  },
  {
    title: '4. How We Use Your Information',
    paragraphs: ['We use personal information to:'],
    list: [
      'Process, ship and support your orders, and send order confirmations and download links.',
      'Run your account and keep your bag, wishlist and saved address in step across devices.',
      'Send one email after an order asking you to review what you bought.',
      'Send email list messages, such as offers and product news, if you have joined the list.',
      'Understand how the site is used, improve it, and measure our advertising.',
      'Prevent fraud, and meet our legal, tax and accounting obligations.',
    ],
  },
  {
    title: '5. Who We Share It With',
    paragraphs: [
      'We do not sell your personal information. We share it only with the service providers that run parts of our business for us, and only what each one needs:',
    ],
    list: [
      'Square, which processes payments and holds order and shipping details.',
      'Supabase, which hosts our accounts and database.',
      'Resend, which delivers our emails.',
      'Cloudflare, which hosts the website.',
      'Google, for analytics and for showing our products in Google Shopping.',
      'Meta, if we run advertising on Facebook or Instagram.',
      'GoAffPro, which runs our affiliate program, when an order came through an affiliate link.',
      'Shipping carriers, to deliver your order.',
    ],
  },
  {
    title: '6. Your Choices',
    paragraphs: [
      'Email list: every list email has an unsubscribe link, and you can change your email preferences in your account. Order and account emails are still sent, because they are part of your purchase.',
      'Cookies and analytics: you can block or delete cookies in your browser settings. You can also opt out of Google Analytics with the Google Analytics opt-out browser add-on, and manage ad preferences in your Google and Meta account settings.',
      'Your information: you can ask us for a copy of the personal information we hold about you, ask us to correct it, or ask us to delete it and your account. Email us at the address below. Depending on where you live, you may have additional rights under your state law, and we will honor them.',
    ],
  },
  {
    title: '7. How Long We Keep It',
    paragraphs: [
      'We keep account information while your account is open. We keep order records for as long as we need them for tax, accounting and legal purposes, even after an account is deleted. You can leave the email list at any time.',
    ],
  },
  {
    title: '8. Security',
    paragraphs: [
      'The site is served over an encrypted connection, payments are handled by Square, and access to our database is restricted. No system is perfectly secure, but we take reasonable steps to protect your information.',
    ],
  },
  {
    title: '9. Children',
    paragraphs: [
      'This website is not directed to children under 13, and we do not knowingly collect personal information from them. If you believe a child has given us personal information, contact us and we will delete it.',
    ],
  },
  {
    title: '10. Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. The date at the top of this page shows when it was last changed. Continued use of the site after a change means you accept the updated policy.',
    ],
  },
];

export function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="font-sans text-sm text-white/55 mt-5 max-w-xl mx-auto leading-relaxed">
            Last updated: September 2026. How Dominus Golf collects, uses and protects your personal information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="space-y-12">
          {sections.map((s, i) => (
            <div key={s.title}>
              <h2 className="font-serif text-xl font-bold text-foreground mb-4">{s.title}</h2>
              <div className="space-y-4">
                {s.paragraphs.map((p) => (
                  <p key={p} className="font-sans text-sm text-muted-foreground leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              {s.list && (
                <ul className="mt-4 space-y-2.5 list-disc pl-5 marker:text-accent">
                  {s.list.map((item) => (
                    <li key={item} className="font-sans text-sm text-muted-foreground leading-relaxed">
                      {item}
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
            Questions about your privacy?
          </p>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Contact Dominus Golf LLC at{' '}
            <a href="mailto:Customersupport@dominusgolf.com" className="text-accent hover:underline">
              Customersupport@dominusgolf.com
            </a>
            , or through our{' '}
            <Link to="/about/contact" className="text-accent hover:underline">
              contact page
            </Link>
            .
          </p>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}
