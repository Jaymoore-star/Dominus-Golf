import React from 'react';
import { motion } from 'framer-motion';

export const ConnectionSection = () => {
  return (
    <section className="py-24 bg-zinc-950 text-white overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <span className="inline-block px-5 py-1.5 bg-white/10 text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-8 rounded-full border border-white/5">
              COMING SOON
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 font-serif uppercase leading-[1.1]">
              THE EVOLUTION OF CONNECTION TRAINING
            </h2>
            <p className="text-lg md:text-2xl text-white mb-10 font-sans font-medium italic text-gray-300">
              "The drill made famous on tour—engineered into a system you can use every day."
            </p>
            <p className="text-gray-400 text-base md:text-xl mb-12 font-sans leading-relaxed">
              Many golfers have tried towels, headcovers, floaties, and elbow gadgets to create connection. The next evolution of the Tour Pure System features the <span className="text-white font-bold">Feel Right Band</span>—a connection training tool designed to provide immediate feedback when the swing becomes disconnected, helping you maintain perfect arm-to-body synchronization.
            </p>
            <a 
              href="/feel-right-band-guide" 
              className="inline-block px-12 py-5 border border-white/20 text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all text-sm"
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
            <div className="aspect-[4/5] bg-zinc-900 overflow-hidden border border-white/10 rounded-sm relative">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBand__cc34ac6f.png?alt=media&token=9a5b1874-aaa1-4e7c-ac39-2f865b12225b" 
                alt="Feel Right Band" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            {/* Visual depth elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-zinc-500/10 blur-[80px] rounded-full pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
