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
    <section className="py-24 bg-black text-white border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-20 font-serif uppercase text-center"
          >
            THE RESULTS GOLFERS ARE CHASING
          </motion.h2>

          <div className="space-y-10 mb-20">
            {RESULTS.map((result, index) => (
              <motion.div 
                key={result}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-8 pb-8 border-b border-white/10 last:border-0 group"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <Check className="w-6 h-6 text-black" strokeWidth={3} />
                </div>
                <p className="text-xl md:text-3xl font-sans font-medium text-gray-200 group-hover:text-white transition-colors tracking-tight">{result}</p>
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
                href="/shop/training-systems" 
                className="inline-block px-12 py-6 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors shadow-2xl text-sm"
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
