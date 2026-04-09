const TROPHY_IMAGE =
  'https://images.unsplash.com/photo-1637635753380-20bf6f46ede0?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=2400';

export function InHandSection() {
  return (
    <section className="w-full bg-[#111111] border-b border-white/10 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text — left */}
          <div className="order-1">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-5">
              In Your Hands
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
              Real Size.<br />Real Training.<br />Real Results.
            </h2>
            <p className="font-sans text-base text-white/55 leading-relaxed mb-8 max-w-[460px]">
              Tour Pure is built to give golfers a true feel for training swing path, tempo, and movement patterns without hitting a ball.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                'Weighted grip trains proper tempo and sequencing',
                'Full shaft length — 18 in, 3.8 lbs — built for feedback',
                'One tool. Consistent results. Anywhere.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <span className="font-sans text-sm text-white/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            {/* Trusted by block */}
            <div className="border-t border-white/10 pt-8">
              <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-2">
                Proven Results
              </p>
              <p className="font-serif text-2xl font-bold text-white leading-tight">
                Trusted by 9+ Club Champions
              </p>
            </div>
          </div>

          {/* Image — right */}
          <div className="order-2 flex flex-col items-center lg:items-end">
            <div className="w-full max-w-[84vw] sm:max-w-[420px] lg:max-w-[480px]">
              <div className="relative overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)]" style={{ aspectRatio: '4/5' }}>
                <img
                  src={TROPHY_IMAGE}
                  alt="Golf championship trophy on course, representing competitive achievement"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: 'center 20%',
                    filter: 'contrast(1.05) brightness(0.92)',
                  }}
                  loading="lazy"
                />
                {/* subtle bottom gradient */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(17,17,17,0.45) 0%, transparent 50%)' }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
