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
            className="text-4xl md:text-5xl font-bold tracking-tight mb-16 font-serif uppercase text-center"
          >
            THE RESULTS GOLFERS ARE CHASING
          </motion.h2>

          <div className="space-y-8 mb-16">
            {RESULTS.map((result, index) => (
              <motion.div 
                key={result}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-6 pb-6 border-b border-white/10 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-black" strokeWidth={3} />
                </div>
                <p className="text-xl md:text-2xl font-sans font-medium">{result}</p>
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
                className="inline-block px-12 py-5 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors shadow-2xl"
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
