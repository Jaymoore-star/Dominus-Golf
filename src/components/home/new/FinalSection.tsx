import React from 'react';
import { motion } from 'framer-motion';

export const FinalSection = () => {
  return (
    <section className="py-32 bg-white text-black relative overflow-hidden border-t border-black/5">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-5xl font-bold tracking-tight mb-12 font-serif uppercase leading-[0.95] text-accent"
          >
            YOUR NEXT ROUND IS ALREADY ON THE CALENDAR.
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-3xl text-gray-600 font-sans leading-relaxed mb-20 max-w-4xl mx-auto italic"
          >
            "Every practice session either reinforces bad habits or builds the swing you've been trying to create. Which one will today be?"
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a 
              href="/shop/training-system" 
              className="inline-block px-16 py-8 bg-black text-white font-bold tracking-[0.25em] uppercase hover:bg-gray-800 transition-all shadow-lg text-sm md:text-lg"
            >
              SHOP THE TOUR PURE SYSTEM
            </a>
          </motion.div>
        </div>
      </div>

      {/* Atmospheric depth elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-[0.08]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-black blur-[180px] rounded-full" />
      </div>
    </section>
  );
};
