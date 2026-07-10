import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { Mail, MapPin, Clock } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Reach Out
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            Get in Touch.
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <p className="font-sans text-base leading-relaxed text-muted-foreground mb-14 max-w-2xl">
          Have questions about your order or need tips on integrating the Tour Pure system into your practice routine? Our team is on standby to help you level up.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Mail size={20} />,
              label: 'Email',
              value: 'Customersupport@dominusgolf.com',
              sub: 'We respond within 1 business day',
            },
            {
              icon: <MapPin size={20} />,
              label: 'Location',
              value: 'Florence, Arizona',
              sub: 'Veteran-owned & operated',
            },
            {
              icon: <Clock size={20} />,
              label: 'Support Hours',
              value: 'Mon – Fri, 9 AM – 5 PM',
              sub: 'Mountain Standard Time (MST)',
            },
          ].map((item) => (
            <div key={item.label} className="border border-border p-6">
              <div className="w-10 h-10 flex items-center justify-center bg-accent/10 text-accent mb-4">
                {item.icon}
              </div>
              <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">
                {item.label}
              </p>
              <p className="font-serif font-semibold text-foreground text-lg">{item.value}</p>
              <p className="font-sans text-xs text-muted-foreground mt-1">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="border-t border-border pt-14">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Send a Message</h2>
          <form className="space-y-5 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-sans text-[11px] font-semibold tracking-widest uppercase text-foreground mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full border border-border px-4 py-3 font-sans text-sm bg-background focus:outline-none focus:border-foreground transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block font-sans text-[11px] font-semibold tracking-widest uppercase text-foreground mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full border border-border px-4 py-3 font-sans text-sm bg-background focus:outline-none focus:border-foreground transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block font-sans text-[11px] font-semibold tracking-widest uppercase text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-border px-4 py-3 font-sans text-sm bg-background focus:outline-none focus:border-foreground transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block font-sans text-[11px] font-semibold tracking-widest uppercase text-foreground mb-2">
                Message
              </label>
              <textarea
                rows={5}
                className="w-full border border-border px-4 py-3 font-sans text-sm bg-background focus:outline-none focus:border-foreground transition-colors resize-none"
                placeholder="Tell us how we can help..."
              />
            </div>
            <button
              type="submit"
              className="btn-primary-black px-8 py-4 font-sans font-semibold text-sm tracking-widest uppercase"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}
