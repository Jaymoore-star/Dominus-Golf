import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';

export const WhySection = () => {
  return (
    <section className="py-20 sm:py-24 bg-gray-50 text-black border-y border-black/5 relative overflow-hidden">
      {/* Background technical macro close-up image */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <img 
          src="/images/2021-03-09__196c2c33.webp" 
          alt="Technical close-up" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-12 font-serif uppercase text-accent"
          >
            WHY MOST GOLFERS NEVER IMPROVE
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 font-sans leading-relaxed mb-10 pt-8 border-t border-black/5"
          >
            Most golfers don't have a talent problem. They have a training problem. They take lessons, watch videos, and hit hundreds of balls hoping something clicks. But without immediate feedback, bad habits become permanent habits. <span className="text-black font-bold italic">The Tour Pure System was designed to change that.</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/about" 
              className="inline-block px-10 py-4 bg-black text-white font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors text-xs shadow-lg"
            >
              DISCOVER THE DIFFERENCE
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
