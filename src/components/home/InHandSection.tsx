const IN_HAND_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FGemini_Generated_Image_ofjfkaofjfkaofjf__1e06169b.png?alt=media&token=8b7d6778-29b1-44d2-a5b5-436472032131';

export function InHandSection() {
  return (
    <section className="w-full bg-background border-b border-border py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text — left */}
          <div className="order-1">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-5">
              In Your Hands
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">
              Real Size.<br />Real Training.<br />Real Results.
            </h2>
            <p className="font-sans text-base text-muted-foreground leading-relaxed mb-8 max-w-[460px]">
              Tour Pure is built to give golfers a true feel for training swing path, tempo, and movement patterns without hitting a ball.
            </p>
            <ul className="space-y-3">
              {[
                'Weighted grip trains proper tempo and sequencing',
                'Full shaft length — 16 in, 3.8 lbs — built for feedback',
                'One tool. Consistent results. Anywhere.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <span className="font-sans text-sm text-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image — right */}
          <div className="order-2 flex flex-col items-center lg:items-end">
            <div className="w-full max-w-[84vw] sm:max-w-[420px] lg:max-w-[480px]">
              <img
                src={IN_HAND_IMAGE}
                alt="Tour Pure swing trainer held in hand showing real-world size"
                className="w-full h-auto object-contain rounded-2xl border border-neutral-200 shadow-sm"
                style={{ maxHeight: '540px' }}
                loading="lazy"
              />
              <p className="mt-3 text-center font-sans text-[11px] text-muted-foreground tracking-wide">
                Shown in hand for scale
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
