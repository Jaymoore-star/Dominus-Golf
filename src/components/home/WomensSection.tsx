import { Link } from '@tanstack/react-router';

const WOMENS_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FTourPureTrainerW2__165b6582.png?alt=media&token=9e37467f-20f0-4ad2-bde8-1af3d34acfd2';

export function WomensSection() {
  return (
    <section className="w-full bg-[#0e0e0e] border-b border-white/10 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image - left on desktop */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="w-full max-w-[84vw] sm:max-w-[400px] lg:max-w-[480px] relative">
              {/* Overlay badge */}
              <div className="absolute top-4 left-4 z-10 bg-white/90 border border-border px-4 py-2 backdrop-blur-sm">
                <p className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-accent">
                  First Release Coming Soon
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 border border-white/10 shadow-2xl">
                <img
                  src={WOMENS_IMAGE}
                  alt="Tour Pure Women - weighted swing trainer"
                  className="w-full h-auto object-contain"
                  style={{
                    maxHeight: '520px',
                    filter: 'contrast(1.05) brightness(1.05)',
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Text - right on desktop */}
          <div className="order-1 lg:order-2">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-5">
              Tour Pure Women
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
              Built for Control.<br />Designed for Consistency.
            </h2>
            <p className="font-sans text-base text-white/55 leading-relaxed mb-8 max-w-[480px]">
              The women's Tour Pure training system is designed to help golfers develop more consistent swing mechanics with proper feel and control.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                'Purpose-built weight and balance for women',
                'Develops swing tempo and proper sequencing',
                'Trains without hitting a ball',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <span className="font-sans text-sm text-white/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/product/$id"
              params={{ id: 'tour-pure-women' }}
              className="inline-block font-sans font-semibold text-xs tracking-widest uppercase px-8 py-4 bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
            >
              Reserve Your Tour Pure
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
