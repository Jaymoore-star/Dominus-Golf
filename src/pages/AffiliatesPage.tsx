import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

/**
 * The affiliate programme runs on GoAffPro, which hosts its own signup, login and
 * dashboard. This page is the part we own: it explains the programme in our voice
 * and hands off to GoAffPro for the account itself.
 *
 * Deliberately states no commission rate, cookie window or payout schedule. Those
 * are commercial terms that change, and GoAffPro shows the current ones at signup
 * — repeating them here would eventually contradict the platform. If you do want
 * them on the page, add them to the "How it works" step 3 copy below.
 */
const GOAFFPRO_URL = 'https://site_360866236577793245.goaffpro.com/';

const AUDIENCE = [
  {
    title: 'Coaches & Instructors',
    body: 'You already tell players what to buy. Get credited when they do.',
  },
  {
    title: 'Content Creators',
    body: 'Golf channels, newsletters and social accounts with an audience that trains.',
  },
  {
    title: 'Clubs & Academies',
    body: 'Pro shops and training facilities equipping members and students.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Apply',
    body: 'Create your affiliate account. Tell us who you are and where your audience is.',
  },
  {
    n: '02',
    title: 'Share your link',
    body: 'You get a personal link and access to product assets. Use it anywhere you already talk about golf.',
  },
  {
    n: '03',
    title: 'Get paid',
    body: 'Every sale through your link is tracked automatically. Track earnings and request payouts from your dashboard.',
  },
];

export function AffiliatesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Affiliate Program
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            Represent Dominus.
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="space-y-6 font-sans text-base leading-relaxed text-foreground/80 mb-16">
          <p>
            Dominus Golf equipment is built for players who are serious about getting better. If
            that is who you coach, teach or speak to, our affiliate programme pays you for pointing
            them to it.
          </p>
        </div>

        {/* Who it's for */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {AUDIENCE.map((item) => (
            <div key={item.title} className="border-t-2 border-accent pt-4">
              <p className="font-serif font-semibold text-foreground">{item.title}</p>
              <p className="font-sans text-sm text-muted-foreground mt-2 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="border border-border p-8 mb-10">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">How It Works</h2>
          <div className="space-y-6">
            {STEPS.map((step) => (
              <div key={step.n} className="flex items-start gap-5">
                <span className="font-serif text-2xl font-bold text-accent shrink-0 leading-none pt-0.5">
                  {step.n}
                </span>
                <div>
                  <p className="font-sans font-semibold text-sm text-foreground">{step.title}</p>
                  <p className="font-sans text-sm text-muted-foreground mt-1 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join */}
        <div className="bg-muted p-8">
          <h2 className="font-serif text-xl font-bold text-foreground mb-3">Become an Affiliate</h2>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">
            Applications are handled on our affiliate portal, where you can also see the current
            commission terms before you sign up.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={GOAFFPRO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground sm:px-10 py-3.5 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors duration-200"
            >
              Join the Program
            </a>
            <a
              href={GOAFFPRO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-border sm:px-10 py-3.5 font-sans text-xs font-semibold tracking-widest uppercase text-foreground hover:bg-background transition-colors duration-200"
            >
              Affiliate Login
            </a>
          </div>

          <p className="font-sans text-xs text-muted-foreground mt-6 leading-relaxed">
            Questions about the programme?{' '}
            <a
              href="mailto:Customersupport@dominusgolf.com"
              className="text-accent hover:underline"
            >
              Customersupport@dominusgolf.com
            </a>
          </p>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}
