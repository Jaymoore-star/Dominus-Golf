import { useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const faqs = [
  {
    id: 1,
    question: 'What is Tour Pure?',
    answer:
      'Tour Pure helps golfers train movement patterns, tempo, and swing path - at home, at the range, or on the green.',
  },
  {
    id: 2,
    question: 'Can I improve my handicap without a full-time Pro?',
    answer:
      'Absolutely. Our Pros provide a 90-day blueprint during your on-range session, giving you a self-improvement method that actually works.',
  },
  {
    id: 3,
    question: 'How do Pro sessions differ from standard range lessons?',
    answer:
      'Standard lessons often focus on quick fixes; Pro range sessions focus on long-term performance. We focus on technical proficiency, practice structure, and tour-level ball striking.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
        aria-expanded={open}
      >
        <span className="font-serif text-lg font-semibold text-white group-hover:text-accent transition-colors duration-200">
          {question}
        </span>
        <span
          className="shrink-0 w-6 h-6 flex items-center justify-center border border-white/20 text-white/60 group-hover:border-accent group-hover:text-accent transition-all duration-200"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease, color 0.2s, border-color 0.2s' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? '300px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <p className="font-sans text-sm text-white/60 leading-relaxed pb-6">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const ref = useScrollAnimation();

  return (
    <section className="w-full bg-[#0e0e0e] border-b border-white/10 py-16 sm:py-20 lg:py-24" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 scroll-animate">
        <div className="text-center mb-12">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Got Questions?
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="bg-[#141414] border border-white/10 px-8">
          {faqs.map((faq) => (
            <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}