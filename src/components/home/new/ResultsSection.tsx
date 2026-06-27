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
    <section className="py-24 bg-white text-black border-y border-black/5 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-7xl font-bold tracking-tight mb-24 font-serif uppercase text-center leading-[0.95] text-accent"
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
                className="flex items-center gap-10 pb-10 border-b border-black/10 last:border-0 group"
              >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 shadow-lg">
                  <Check className="w-7 h-7 text-white" strokeWidth={3} />
                </div>
                <p className="text-2xl md:text-4xl font-sans font-medium text-gray-600 group-hover:text-black transition-colors tracking-tighter leading-none">{result}</p>
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
                className="inline-block px-14 py-7 bg-black text-white font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-lg text-sm md:text-base"
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
