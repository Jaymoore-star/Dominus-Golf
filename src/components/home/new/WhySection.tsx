import React from 'react';
import { motion } from 'framer-motion';

export const WhySection = () => {
  return (
    <section className="py-24 bg-zinc-950 text-white border-y border-white/5 relative overflow-hidden">
      {/* Background technical macro close-up image */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <img 
          src="https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F2021-03-09__196c2c33.jpg?alt=media&token=dbaecb63-0518-44cc-beaa-4817b99a8fb5" 
          alt="Technical close-up" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-7xl font-bold tracking-tight mb-10 font-serif uppercase"
          >
            WHY MOST GOLFERS NEVER IMPROVE
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-3xl text-gray-300 font-sans leading-relaxed mb-14"
          >
            Most golfers don't have a talent problem. They have a training problem. They take lessons, watch videos, and hit hundreds of balls hoping something clicks. But without immediate feedback, bad habits become permanent habits. <span className="text-white font-bold italic">The Tour Pure System was designed to change that.</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a 
              href="/about" 
              className="inline-block px-12 py-6 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors text-sm shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              DISCOVER THE DIFFERENCE
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
