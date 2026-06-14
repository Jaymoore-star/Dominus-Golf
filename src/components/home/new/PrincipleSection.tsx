import React from 'react';
import { motion } from 'framer-motion';

export const PrincipleSection = () => {
  return (
    <section className="py-24 bg-white text-black overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-black text-white p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center text-center md:text-left"
        >
          <div className="relative z-10 flex-1">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold tracking-tight mb-8 font-serif uppercase leading-tight"
            >
              BUILT ON A SINGLE PRINCIPLE
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-3xl text-gray-400 font-sans leading-relaxed italic"
            >
              "Golfers improve faster when every swing provides feedback. This eliminates guesswork and accelerates the development of repeatable mechanics."
            </motion.p>
          </div>
          
          <div className="w-px h-40 bg-white/20 hidden md:block" />
          
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-500 mb-2">ACCELERATION</div>
            <div className="text-4xl md:text-6xl font-bold font-serif">10X</div>
            <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-500">FEEDBACK LOOP</div>
          </div>

          {/* Decorative accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 -ml-16 -mb-16 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
};
