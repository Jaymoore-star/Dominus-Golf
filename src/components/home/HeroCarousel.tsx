import { useState, useEffect, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 0,
    bg: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F301503221_456856363151119_1248543110073884434_n__b21743d9.jpg?alt=media&token=14f4d325-9e1e-4afe-9f14-004bf18e16e9',
    label: 'Training Systems',
    title: 'Build Your\nBest Swing',
    subtitle: 'Tour Pure — Weighted Training System for Men & Women',
    cta: 'Shop Now',
    href: '/shop/training-system',
  },
  {
    id: 1,
    bg: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F455040396_8098531156901972_191203825751922657_n__0cf04f01.jpg?alt=media&token=db93f688-5d6d-4929-821a-5305e4bdcbb8',
    label: 'Train Smarter',
    title: 'Perfect Your\nSetup',
    subtitle: 'Precision training tools built for every golfer',
    cta: 'Shop All',
    href: '/shop/training-system',
  },
  {
    id: 2,
    bg: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F455082619_8098523016902786_920092106083080418_n__592fb000.jpg?alt=media&token=eafee2aa-8be5-4781-9cad-484a87cc07fd',
    label: 'Putting',
    title: 'Sink Every\nPutt',
    subtitle: 'Train your putting stroke with proven Dominus systems',
    cta: 'Shop Now',
    href: '/shop/training-system',
  },
  {
    id: 3,
    bg: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F455087282_8098523443569410_6374726642753676189_n__d7f2dffb.jpg?alt=media&token=58f20b32-9a32-417e-ac86-9758fb01f4c8',
    label: 'Consistency',
    title: 'Repeat It\nEvery Time',
    subtitle: 'Build the muscle memory that separates good from great',
    cta: 'Shop Now',
    href: '/shop/training-system',
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent(index);
      setProgressKey((k) => k + 1);
      setTimeout(() => setAnimating(false), 600);
    },
    [animating],
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-primary">
      {/* Background images — cross-fade */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={s.bg}
            alt={s.title}
            className={`w-full h-full object-cover ${i === 0 ? 'object-[center_30%]' : 'object-center'}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 w-full">
          <div className="max-w-xl">
            {/* Label */}
            <p
              key={`label-${current}`}
              className="hero-text-enter font-sans text-[11px] font-semibold tracking-[0.3em] uppercase mb-4"
              style={{ color: 'hsl(38 53% 50%)' }}
            >
              {slide.label}
            </p>

            {/* Title */}
            <h1
              key={`title-${current}`}
              className="hero-text-enter-delay font-serif font-bold text-white leading-[1.05] mb-6"
              style={{
                fontSize: 'clamp(40px, 6vw, 76px)',
                whiteSpace: 'pre-line',
              }}
            >
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p
              key={`sub-${current}`}
              className="hero-text-enter-delay-2 font-sans text-white/80 text-base sm:text-lg font-light tracking-wide mb-8"
            >
              {slide.subtitle}
            </p>

            {/* CTA */}
            <div key={`cta-${current}`} className="hero-text-enter-delay-2">
              <Link
                to={slide.href}
                className="btn-outline-white inline-block px-8 py-4 font-sans font-semibold text-sm tracking-widest uppercase"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border border-white/40 text-white hover:bg-white/10 transition-colors duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center border border-white/40 text-white hover:bg-white/10 transition-colors duration-200"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Progress / Dot indicators + progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        {/* Slide dots */}
        <div className="flex items-center justify-center gap-3 pb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="group relative"
              aria-label={`Go to slide ${i + 1}`}
            >
              <span
                className={`block transition-all duration-300 ${
                  i === current
                    ? 'w-8 h-0.5 bg-white'
                    : 'w-2 h-0.5 bg-white/40 group-hover:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-white/20 w-full">
          <div
            key={progressKey}
            className="progress-animate h-full bg-accent"
            style={{ width: '0%' }}
          />
        </div>
      </div>
    </section>
  );
}
