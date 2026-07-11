const IN_HAND_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FGemini_Generated_Image_ofjfkaofjfkaofjf__1e06169b.png?alt=media&token=8b7d6778-29b1-44d2-a5b5-436472032131';

export function ProofSection() {
  return (
    <section className="w-full bg-background py-16 sm:py-20 lg:py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text side */}
          <div className="order-1 lg:order-1">
            {/* Eyebrow */}
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              In Your Hands
            </p>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-foreground leading-tight mb-6">
              Real Size.{' '}
              <br className="hidden sm:block" />
              Real Training.{' '}
              <br className="hidden sm:block" />
              Real Results.
            </h2>

            {/* Body copy */}
            <p className="font-sans text-base text-muted-foreground leading-relaxed mb-8 max-w-[480px]">
              Tour Pure is built to give golfers a true feel for training swing
              path, tempo, and movement patterns without hitting a ball.
            </p>

            {/* Feature bullets */}
            <ul className="space-y-3 mb-8">
              {[
                'Weighted grip trains proper tempo and sequencing',
                'Full shaft length - 16 in, 3.8 lbs - built for feedback',
                'One tool. Consistent results. Anywhere.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <span className="font-sans text-sm text-foreground leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href="/product/tour-pure-men"
              className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-7 py-3.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
            >
              Shop Tour Pure Men
            </a>
          </div>

          {/* Image side */}
          <div className="order-2 lg:order-2 flex flex-col items-center lg:items-end">
            {/* Constrained image container */}
            <div className="w-full flex justify-center lg:justify-end">
              <div className="w-full max-w-[84vw] sm:max-w-[420px] lg:max-w-[460px]">
                <img
                  src={IN_HAND_IMAGE}
                  alt="Tour Pure swing trainer held in hand, showing real-world size and grip"
                  className="w-full h-auto object-contain rounded-2xl border border-neutral-200 shadow-sm"
                  style={{ maxHeight: '560px' }}
                  loading="lazy"
                />
                {/* Caption */}
                <p className="mt-3 text-center font-sans text-[11px] text-muted-foreground tracking-wide">
                  Shown in hand for scale
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
