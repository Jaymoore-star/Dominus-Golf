import { Link } from '@tanstack/react-router';
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
    <section className="py-20 sm:py-24 bg-white text-black border-y border-black/5 relative overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-10 font-serif uppercase text-center leading-tight text-accent"
          >
            THE RESULTS GOLFERS ARE CHASING
          </motion.h2>

          <div className="space-y-3 mb-14 max-w-4xl mx-auto">
            {RESULTS.map((result, index) => (
              <motion.div 
                key={result}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-5 pb-4 border-b border-black/10 last:border-0 group"
              >
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 shadow-lg">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <p className="text-lg sm:text-xl font-sans font-medium text-gray-600 group-hover:text-black transition-colors leading-snug">{result}</p>
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
              <Link
                to="/shop/$category" params={{ category: 'training-system' }} 
                className="inline-block px-10 py-4 bg-black text-white font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-lg text-xs"
              >
                START TRAINING TODAY
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
