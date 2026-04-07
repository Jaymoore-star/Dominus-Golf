const steps = [
  {
    number: '01',
    step: 'Step 1',
    title: 'Train Swing Path',
    body: 'Use Tour Pure to build body awareness of how the club and body move together through the swing.',
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F301503221_456856363151119_1248543110073884434_n__b21743d9.jpg?alt=media&token=032f01c9-e5a4-477e-a7a4-81a76ddb5a29',
    alt: 'Golfer mid-swing training with Tour Pure system on the course',
    // object-position crops toward the golfer, away from excess sky/ground
    objectPosition: 'center 20%',
  },
  {
    number: '02',
    step: 'Step 2',
    title: 'Build Repeatable Motion',
    body: 'Structured repetition with Tour Pure reinforces tempo, sequencing, and control through deliberate practice.',
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F455006441_8098523000236121_7855058451068780943_n__309e2346.jpg?alt=media&token=7db6fb7b-c73a-4676-a591-fa386fa1ca51',
    alt: 'Golfer holding Tour Pure trainer in setup position showing proper grip and posture',
    objectPosition: 'center top',
  },
  {
    number: '03',
    step: 'Step 3',
    title: 'Transfer to the Course',
    body: 'The patterns trained with Tour Pure carry directly onto the course — a more stable, repeatable swing every round.',
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F455040396_8098531156901972_191203825751922657_n__0cf04f01.jpg?alt=media&token=6f5ef5d7-f349-4589-8f5b-37aaba47dc2a',
    alt: 'Golfer using Tour Pure on the putting green to train path and stroke',
    objectPosition: 'center 30%',
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full bg-background border-b border-border py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-14 lg:mb-18 max-w-xl">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            The Process
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            How Tour Pure Works
          </h2>
        </div>

        {/* 3 steps — vertical stack of horizontal cards on desktop, fully stacked on mobile */}
        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-10">
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col gap-5">

              {/* Step label + title */}
              <div>
                <p className="font-sans text-[10px] font-semibold tracking-[0.35em] uppercase text-accent mb-3">
                  {s.step}
                </p>
                <h3 className="font-serif text-2xl font-bold text-foreground leading-snug mb-3">
                  {s.title}
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                  {s.body}
                </p>
              </div>

              {/* Divider */}
              <div className="w-10 h-px bg-accent" />

              {/* Image — constrained, centered, tight crop */}
              <div className="w-full flex justify-center">
                <div className="w-full max-w-[420px]">
                  {/* 
                    Aspect ratio container: 4:5 portrait crop focuses tightly 
                    on golfer + trainer, removes excess grass/sky
                  */}
                  <div
                    className="relative w-full overflow-hidden rounded-xl border border-border shadow-sm"
                    style={{ aspectRatio: '4 / 5' }}
                  >
                    <img
                      src={s.image}
                      alt={s.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: s.objectPosition }}
                      loading="lazy"
                    />
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
