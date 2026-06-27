import { Link } from '@tanstack/react-router';

const bullets = [
  'Train at home, at the range, or on the green',
  'Build consistent movement patterns',
  'Improve tempo and control',
];

export function ProductPositioningSection() {
  return (
    <section className="w-full bg-gray-50 border-b border-black/10 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Overhead label */}
        <div className="mb-10">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-2">
            The System
          </p>
          <p className="font-serif text-base text-gray-500 tracking-wide">
            The Tool Behind the System
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text */}
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black leading-tight mb-6">
              A Complete Golf Training System
            </h2>
            <p className="font-sans text-base text-gray-600 leading-relaxed mb-8 max-w-[480px]">
              Tour Pure is a structured training system designed to improve swing mechanics, not just a standalone tool.
            </p>
            <ul className="space-y-4 mb-10">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-4">
                  <span className="mt-2 w-1.5 h-1.5 bg-accent shrink-0" />
                  <span className="font-sans text-sm text-gray-600 leading-relaxed">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to="/shop/$category"
              params={{ category: 'training-system' }}
              className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-8 py-4 border border-black/30 text-black/80 hover:border-black hover:text-black transition-colors duration-200"
            >
              Explore the System
            </Link>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-px bg-black/8">
            {[
              { value: '3.8 lbs', label: 'Training Weight' },
              { value: '18 in', label: 'Shaft Length' },
              { value: '90-Day', label: 'Training Curriculum' },
              { value: 'Range Ready', label: 'Course Ready' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white px-8 py-10 flex flex-col gap-2"
              >
                <span className="font-serif text-3xl font-bold text-black">
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
