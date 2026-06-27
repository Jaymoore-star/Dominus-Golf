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
          className="max-w-6xl mx-auto bg-gray-100 text-black p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row gap-16 items-center"
        >
          <div className="relative z-10 flex-1">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold tracking-tight mb-10 font-serif uppercase leading-[1.1] text-accent"
            >
              BUILT ON A SINGLE PRINCIPLE
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl md:text-4xl text-gray-600 font-sans leading-relaxed italic"
            >
              "Golfers improve faster when every swing provides feedback. This eliminates guesswork and accelerates the development of repeatable mechanics."
            </motion.p>
          </div>
          
          <div className="w-px h-64 bg-black/10 hidden md:block" />
          
          <div className="flex flex-col items-center md:items-start gap-6 relative z-10">
            <div className="text-xs font-bold tracking-[0.5em] uppercase text-gray-600 mb-2">ACCELERATION</div>
            <div className="text-6xl md:text-9xl font-bold font-serif leading-none tracking-tighter">10X</div>
            <div className="text-xs font-bold tracking-[0.5em] uppercase text-gray-600">FEEDBACK LOOP</div>
          </div>

          {/* Depth elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-black/5 -mr-64 -mt-64 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/5 -ml-64 -mb-64 rounded-full blur-[120px]" />
        </motion.div>
      </div>
    </section>
  );
};
