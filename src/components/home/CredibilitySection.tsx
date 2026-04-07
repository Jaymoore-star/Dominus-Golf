// Section 2 — Visual Proof: dark overlay with centered brand statement

const PROOF_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F455006441_8098523000236121_7855058451068780943_n__309e2346.jpg?alt=media&token=7db6fb7b-c73a-4676-a591-fa386fa1ca51';

const blocks = [
  {
    number: '01',
    title: 'Developed Through Real Use',
    body: 'Tour Pure was created to give golfers a better way to train swing mechanics without hitting a ball.',
  },
  {
    number: '02',
    title: 'Built for Repeatable Training',
    body: 'Designed to reinforce movement patterns, tempo, and control through structured repetition.',
  },
  {
    number: '03',
    title: 'Trusted by Competitive Golfers',
    body: 'Used by golfers focused on improving consistency and swing control.',
  },
];

export function CredibilitySection() {
  return (
    <>
      {/* Full-width proof image with overlay text */}
      <div
        className="relative w-full overflow-hidden border-b border-white/10"
        style={{ minHeight: '420px' }}
      >
        <img
          src={PROOF_IMAGE}
          alt="Golfer training with Tour Pure showing control and form"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 25%', filter: 'contrast(1.08) brightness(0.75)' }}
          loading="lazy"
        />
        {/* Dark gradient overlay — heavier at bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.50) 45%, rgba(0,0,0,0.15) 100%)',
          }}
        />
        {/* Overlay text */}
        <div className="relative z-10 flex items-end h-full px-6 sm:px-12 lg:px-20 pb-10 sm:pb-14" style={{ minHeight: '420px' }}>
          <div>
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-3">
              Built From Real Results
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-xl">
              Built for Golfers<br />Who Want Control
            </h2>
          </div>
        </div>
      </div>

      {/* 3-col stats below */}
      <section className="w-full bg-[#111111] border-b border-white/10 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            {blocks.map((block) => (
              <div key={block.number} className="flex flex-col gap-4">
                <span className="font-sans text-[11px] font-semibold tracking-[0.3em] text-accent">
                  {block.number}
                </span>
                <div className="w-8 h-px bg-accent" />
                <h3 className="font-serif text-xl font-semibold text-white leading-snug">
                  {block.title}
                </h3>
                <p className="font-sans text-sm text-white/50 leading-relaxed">
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
