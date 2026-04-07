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
    <section className="w-full bg-secondary border-b border-border py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Why Tour Pure
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            Built From Real Results
          </h2>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
          {blocks.map((block) => (
            <div key={block.number} className="flex flex-col gap-4">
              <span className="font-sans text-[11px] font-semibold tracking-[0.3em] text-accent">
                {block.number}
              </span>
              <div className="w-8 h-px bg-accent" />
              <h3 className="font-serif text-xl font-semibold text-foreground leading-snug">
                {block.title}
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {block.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
