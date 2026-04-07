import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

const badges = [
  {
    icon: <Truck size={24} />,
    title: 'Free Shipping',
    description: 'On all orders over $150',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Secure Payment',
    description: 'SSL encrypted checkout',
  },
  {
    icon: <RefreshCw size={24} />,
    title: 'Easy Returns',
    description: '30-day satisfaction guarantee',
  },
  {
    icon: <Headphones size={24} />,
    title: 'Expert Support',
    description: 'Live support for all players',
  },
];

export function TrustBadges() {
  return (
    <section className="bg-secondary/50 border-y border-border">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {badges.map((badge, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-accent mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm">
                {badge.icon}
              </div>
              <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-foreground mb-1">
                {badge.title}
              </h3>
              <p className="font-sans text-[11px] text-muted-foreground tracking-wide">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
