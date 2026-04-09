// Section 1 — Trusted by Club Champions + Section 2 — Why Tour Pure Works

const PROOF_IMAGE =
  'https://images.unsplash.com/photo-1758933067994-6b121e5c5131?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1800';

const WHY_IMAGE =
  'https://images.unsplash.com/photo-1597369195725-3a7805f2b121?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=1200';

const bullets = [
  'Built for real tempo and sequencing',
  'Added weight trains control and resistance',
  'Designed to transfer to real play',
  'More than a warm-up tool',
];

export function CredibilitySection() {
  return (
    <>
      {/* ── SECTION 1 — Trusted by Club Champions ── */}
      <div
        className="relative w-full overflow-hidden border-b border-white/10"
        style={{ minHeight: '460px' }}
      >
        <img
          src={PROOF_IMAGE}
          alt="Multiple-exposure shot of a competitive golfer demonstrating swing technique and path"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 30%', filter: 'contrast(1.1) brightness(0.7)' }}
          loading="lazy"
        />
        {/* Dark gradient — heavy at bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.52) 45%, rgba(0,0,0,0.18) 100%)',
          }}
        />
        {/* Overlay text */}
        <div
          className="relative z-10 flex items-end h-full px-6 sm:px-12 lg:px-20 pb-12 sm:pb-16"
          style={{ minHeight: '460px' }}
        >
          <div className="max-w-2xl">
            <p className="font-sans text-[11px] font-semibold tracking-[0.38em] uppercase text-accent mb-4">
              Proven Performance
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
              Trusted by 9+ Club Champions
            </h2>
            <p className="font-sans text-base text-white/70 leading-relaxed max-w-xl">
              Tour Pure was built on the same movement patterns used by competitive golfers to train
              swing path, tempo, and sequencing. Developed through real performance improvement, it
              has been used by players focused on consistency under pressure.
            </p>
          </div>
        </div>
      </div>

      {/* ── SECTION 2 — Why Tour Pure Works ── */}
      <section className="w-full bg-[#111111] border-b border-white/10 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', maxHeight: '560px' }}>
                <img
                  src={WHY_IMAGE}
                  alt="Golfer mid-swing on course demonstrating full power and control"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 15%', filter: 'brightness(0.88) contrast(1.05)' }}
                  loading="lazy"
                />
                {/* Subtle side gradient to blend into dark bg */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(17,17,17,0.15) 0%, transparent 40%, transparent 60%, rgba(17,17,17,0.25) 100%)',
                  }}
                />
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <p className="font-sans text-[11px] font-semibold tracking-[0.38em] uppercase text-accent mb-4">
                The Difference
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white leading-tight mb-6">
                Why Tour Pure Works
              </h2>
              <p className="font-sans text-base text-white/60 leading-relaxed mb-8 max-w-[480px]">
                Most swing trainers are too light and do not build real sequencing or control.
                Tour Pure uses added weight to train tempo, movement, and resistance that transfer
                to real swings on the course.
              </p>

              {/* Bullets */}
              <ul className="space-y-4 mb-10">
                {bullets.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="mt-2 w-1.5 h-1.5 bg-accent shrink-0" />
                    <span className="font-sans text-sm text-white/80 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/product/tour-pure-men"
                className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-7 py-3.5 bg-accent text-[#111111] hover:bg-accent/90 transition-colors duration-200"
              >
                Shop Tour Pure
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
