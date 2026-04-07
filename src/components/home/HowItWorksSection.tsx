const steps = [
  {
    step: 'Step 1',
    title: 'Train Swing Path',
    body: 'Use Tour Pure to build awareness of how the club and body move together.',
  },
  {
    step: 'Step 2',
    title: 'Build Repeatable Motion',
    body: 'Structured repetition reinforces tempo and control.',
  },
  {
    step: 'Step 3',
    title: 'Transfer to the Course',
    body: 'Develop a more stable and repeatable swing.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full bg-background border-b border-border py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 lg:mb-16 max-w-xl">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            The Process
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            How Tour Pure Works
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-px bg-border">
          {steps.map((s) => (
            <div key={s.step} className="bg-background px-8 py-10 flex flex-col gap-5">
              <p className="font-sans text-[11px] font-semibold tracking-[0.3em] uppercase text-accent">
                {s.step}
              </p>
              <h3 className="font-serif text-2xl font-bold text-foreground leading-snug">
                {s.title}
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
