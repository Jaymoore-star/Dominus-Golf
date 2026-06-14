import React from 'react';
import { motion } from 'framer-motion';

export const ConnectionSection = () => {
  return (
    <section className="py-24 bg-zinc-950 text-white overflow-hidden border-t border-white/5 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <span className="inline-block px-6 py-2 bg-white/10 text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-10 rounded-full border border-white/5 shadow-2xl">
              COMING SOON
            </span>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 font-serif uppercase leading-[1.05]">
              THE EVOLUTION OF CONNECTION TRAINING
            </h2>
            <p className="text-lg md:text-2xl text-white mb-10 font-sans font-medium italic text-gray-300 tracking-tight leading-snug">
              "The drill made famous on tour—engineered into a system you can use every day."
            </p>
            <p className="text-gray-400 text-lg md:text-xl mb-14 font-sans leading-relaxed">
              Many golfers have tried towels, headcovers, floaties, and elbow gadgets to create connection. The next evolution of the Tour Pure System features the <span className="text-white font-bold">Feel Right Band</span>—a connection training tool designed to provide immediate feedback when the swing becomes disconnected, helping you maintain perfect arm-to-body synchronization.
            </p>
            <a 
              href="/feel-right-band-guide" 
              className="inline-block px-14 py-6 border border-white/20 text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all text-sm shadow-2xl"
            >
              JOIN THE WAITLIST
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <div className="aspect-[4/5] bg-zinc-900 overflow-hidden border border-white/10 rounded-sm relative flex items-center justify-center p-12">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBand__cc34ac6f.png?alt=media&token=9a5b1874-aaa1-4e7c-ac39-2f865b12225b" 
                alt="Feel Right Band" 
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </div>
            
            {/* High-performance visual accents */}
            <div className="absolute -top-16 -right-16 w-80 h-80 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-zinc-500/10 blur-[100px] rounded-full pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
