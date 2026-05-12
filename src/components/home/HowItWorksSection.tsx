const steps = [
  {
    number: '01',
    step: 'Step 1',
    overlayTitle: 'Train the Path',
    title: 'Train Swing Path',
    body: 'Use Tour Pure to build body awareness of how the club and body move together through the swing.',
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F301503221_456856363151119_1248543110073884434_n__b21743d9.jpg?alt=media&token=032f01c9-e5a4-477e-a7a4-81a76ddb5a29',
    alt: 'Golfer mid-swing training with Tour Pure system on the course',
    objectPosition: 'center 20%',
  },
  {
    number: '02',
    step: 'Step 2',
    overlayTitle: 'Build the Motion',
    title: 'Build Repeatable Motion',
    body: 'Structured repetition with Tour Pure reinforces tempo, sequencing, and control through deliberate practice.',
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F455006441_8098523000236121_7855058451068780943_n__309e2346.jpg?alt=media&token=7db6fb7b-c73a-4676-a591-fa386fa1ca51',
    alt: 'Golfer holding Tour Pure trainer in setup position showing proper grip and posture',
    objectPosition: 'center top',
  },
  {
    number: '03',
    step: 'Step 3',
    overlayTitle: 'Master Your Break',
    title: 'Precision Putting Alignment',
    body: 'Use Tour Pure as a putting alignment tool to align and help understand your putting break.',
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F455082619_8098523016902786_920092106083080418_n__592fb000.jpg?alt=media&token=5bd2467b-27fc-4f71-8f3d-e9a4c8354f49',
    alt: 'Golfer using Tour Pure on the putting green as an alignment tool to read the break',
    objectPosition: 'center 40%',
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full bg-[#0e0e0e] border-b border-white/10 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14 max-w-xl">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            The Process
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
            The Training System
          </h2>
        </div>

        {/* 3 steps */}
        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-10">
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col gap-5">

              {/* Step label + title */}
              <div>
                <p className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-accent mb-3">
                  {s.step}
                </p>
                <h3 className="font-serif text-2xl font-bold text-white leading-snug mb-3">
                  {s.title}
                </h3>
                <p className="font-sans text-sm text-white/45 leading-relaxed">
                  {s.body}
                </p>
              </div>

              {/* Divider */}
              <div className="w-10 h-px bg-accent" />

              {/* Image with overlay headline */}
              <div className="w-full flex justify-center">
                <div className="w-full max-w-[420px]">
                  <div
                    className="relative w-full overflow-hidden rounded-xl"
                    style={{ aspectRatio: '4 / 5' }}
                  >
                    <img
                      src={s.image}
                      alt={s.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        objectPosition: s.objectPosition,
                        filter: 'contrast(1.08) brightness(0.80)',
                      }}
                      loading="lazy"
                    />
                    {/* Bottom gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)',
                      }}
                    />
                    {/* Overlay headline */}
                    <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                      <p className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-accent mb-1">
                        {s.step}
                      </p>
                      <p className="font-serif text-xl font-bold text-white leading-tight">
                        {s.overlayTitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
