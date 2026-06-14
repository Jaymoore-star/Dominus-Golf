import React from 'react';
import { motion } from 'framer-motion';

export const WhySection = () => {
  return (
    <section className="py-24 bg-zinc-950 text-white border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-serif uppercase"
          >
            WHY MOST GOLFERS NEVER IMPROVE
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 font-sans leading-relaxed mb-12"
          >
            Most golfers don't have a talent problem. They have a training problem. They take lessons, watch videos, and hit hundreds of balls hoping something clicks. But without immediate feedback, bad habits become permanent habits. The Tour Pure System was designed to change that.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a 
              href="/about" 
              className="inline-block px-10 py-5 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors"
            >
              DISCOVER THE DIFFERENCE
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
