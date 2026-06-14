import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const RESULTS = [
  "A connected swing.",
  "More consistent contact.",
  "Confidence under pressure.",
  "Practice sessions that actually transfer to the golf course.",
  "The ability to trust your swing when it matters most."
];

export const ResultsSection = () => {
  return (
    <section className="py-24 bg-black text-white border-y border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-8xl font-bold tracking-tight mb-24 font-serif uppercase text-center leading-[0.95]"
          >
            THE RESULTS GOLFERS ARE CHASING
          </motion.h2>

          <div className="space-y-12 mb-24 max-w-4xl mx-auto">
            {RESULTS.map((result, index) => (
              <motion.div 
                key={result}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-10 pb-10 border-b border-white/10 last:border-0 group"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  <Check className="w-7 h-7 text-black" strokeWidth={3} />
                </div>
                <p className="text-2xl md:text-4xl font-sans font-medium text-gray-300 group-hover:text-white transition-colors tracking-tighter leading-none">{result}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <a 
                href="/shop/training-system" 
                className="inline-block px-14 py-7 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors shadow-2xl text-sm md:text-base"
              >
                START TRAINING TODAY
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
