import React from 'react';
import { motion } from 'framer-motion';

export const FinalSection = () => {
  return (
    <section className="py-32 bg-black text-white relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-8xl font-bold tracking-tight mb-10 font-serif uppercase leading-[1.05]"
          >
            YOUR NEXT ROUND IS ALREADY ON THE CALENDAR.
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-3xl text-gray-400 font-sans leading-relaxed mb-16 max-w-3xl mx-auto italic"
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
              href="/shop/training-systems" 
              className="inline-block px-14 py-7 bg-white text-black font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] text-sm md:text-base"
            >
              SHOP THE TOUR PURE SYSTEM
            </a>
          </motion.div>
        </div>
      </div>

      {/* Atmospheric depth elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-[0.05]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white blur-[150px] rounded-full" />
      </div>
    </section>
  );
};
