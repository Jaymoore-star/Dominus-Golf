// Section 2 - Visual Proof: dark overlay with centered brand statement

const PROOF_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F455006441_8098523000236121_7855058451068780943_n__309e2346.jpg?alt=media&token=7db6fb7b-c73a-4676-a591-fa386fa1ca51';

const bullets = [
  'Built on proven movement patterns used by competitive golfers',
  'Added weight forces proper sequencing, tempo, and control',
  'Trains movements that transfer to real swings-not just practice',
  'Designed for repetition that builds consistency under pressure',
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
        {/* Dark gradient overlay - heavier at bottom for text legibility */}
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
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-2xl">
              The trainer builds the body. The system makes it repeatable.
            </h2>
          </div>
        </div>
      </div>

      {/* Body copy + bullets */}
      <section className="w-full bg-[#111111] border-b border-white/10 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-sans text-base text-white/65 leading-relaxed mb-5">
              Tour Pure was developed through real performance improvement and built on the same
              movement patterns used by competitive golfers to train swing path, tempo, and sequencing.
            </p>
            <p className="font-sans text-base text-white/65 leading-relaxed mb-10">
              Most swing trainers create awareness but fail to transfer to real performance. Tour Pure
              uses added weight to train sequencing, control, and movement that holds up on the course.
            </p>
            <ul className="space-y-4 mb-10">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="mt-2 w-1.5 h-1.5 bg-accent shrink-0" />
                  <span className="font-sans text-sm text-white/75 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-serif text-lg font-semibold text-white/90 leading-snug">
              Built for the range, the green, and everywhere your game is made.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
