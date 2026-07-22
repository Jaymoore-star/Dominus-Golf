import React from 'react';
import { motion } from 'framer-motion';

export const ConnectionSection = () => {
  return (
    <section className="py-24 bg-gray-50 text-black overflow-hidden border-t border-black/5 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <span className="inline-block px-6 py-2 bg-black/10 text-black text-[10px] font-bold tracking-[0.4em] uppercase mb-10 rounded-full border border-black/5 shadow-2xl">
              COMING SOON
            </span>
            <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-8 font-serif uppercase leading-[1.05] text-accent">
              THE EVOLUTION OF CONNECTION TRAINING
            </h2>
            <p className="text-lg md:text-2xl text-black mb-10 font-sans font-medium italic text-gray-600 tracking-tight leading-snug">
              "The drill made famous on tour-engineered into a system you can use every day."
            </p>
            <p className="text-gray-600 text-lg md:text-xl mb-14 font-sans leading-relaxed">
              Many golfers have tried towels, headcovers, floaties, and elbow gadgets to create connection. The next evolution of the Tour Pure System features the <span className="text-black font-bold">Feel Right Band</span>-a connection training tool designed to provide immediate feedback when the swing becomes disconnected, helping you maintain perfect arm-to-body synchronization.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden border border-black/10 rounded-sm relative flex items-center justify-center p-12">
              <img 
                src="/images/FeelRiteGolfBand__cc34ac6f.webp" 
                alt="Feel Right Band" 
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-60" />
            </div>
            
            {/* High-performance visual accents */}
            <div className="absolute -top-16 -right-16 w-80 h-80 bg-black/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-gray-300/20 blur-[100px] rounded-full pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
