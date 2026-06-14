import React from 'react';
import { motion } from 'framer-motion';

export const FinalSection = () => {
  return (
    <section className="py-32 bg-black text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-8 font-serif uppercase leading-[1.1]"
          >
            YOUR NEXT ROUND IS ALREADY ON THE CALENDAR.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 font-sans leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            Every practice session either reinforces bad habits or builds the swing you've been trying to create. Which one will today be?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a 
              href="/shop/training-systems" 
              className="inline-block px-12 py-6 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors shadow-2xl text-lg"
            >
              SHOP THE TOUR PURE SYSTEM
            </a>
          </motion.div>
        </div>
      </div>

      {/* Atmospheric background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-[0.03] blur-[100px] rounded-full" />
      </div>
    </section>
  );
};
