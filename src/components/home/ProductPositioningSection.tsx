import { Link } from '@tanstack/react-router';

const bullets = [
  'Train without hitting a ball',
  'Build consistent movement patterns',
  'Improve tempo and control',
];

export function ProductPositioningSection() {
  return (
    <section className="w-full bg-primary border-b border-border py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text */}
          <div>
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-5">
              The System
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground leading-tight mb-6">
              A Complete Golf Training System
            </h2>
            <p className="font-sans text-base text-primary-foreground/70 leading-relaxed mb-8 max-w-[480px]">
              Tour Pure is a structured training system designed to improve swing mechanics, not just a standalone tool.
            </p>
            <ul className="space-y-4 mb-10">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-4">
                  <span className="mt-2 w-1.5 h-1.5 bg-accent shrink-0" />
                  <span className="font-sans text-sm text-primary-foreground/80 leading-relaxed">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to="/shop/training-system"
              className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-8 py-4 border border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors duration-200"
            >
              Explore the System
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-px bg-primary-foreground/10">
            {[
              { value: '3.8 lbs', label: 'Training Weight' },
              { value: '16 in', label: 'Shaft Length' },
              { value: '90-Day', label: 'Training Curriculum' },
              { value: 'No Ball', label: 'Required' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-primary px-8 py-10 flex flex-col gap-2"
              >
                <span className="font-serif text-3xl font-bold text-primary-foreground">
                  {stat.value}
                </span>
                <span className="font-sans text-xs font-semibold tracking-widest uppercase text-accent">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
