import React from 'react';
import { motion } from 'framer-motion';

export const ConnectionSection = () => {
  return (
    <section className="py-24 bg-zinc-950 text-white overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 bg-white/10 text-white text-[10px] font-bold tracking-[0.3em] uppercase mb-6 rounded-full">
              COMING SOON
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-serif uppercase">
              THE EVOLUTION OF CONNECTION TRAINING
            </h2>
            <p className="text-lg md:text-xl text-white mb-8 font-sans font-medium italic">
              The drill made famous on tour—engineered into a system you can use every day.
            </p>
            <p className="text-gray-400 text-base md:text-lg mb-10 font-sans leading-relaxed">
              Many golfers have tried towels, headcovers, floaties, and elbow gadgets to create connection. The next evolution of the Tour Pure System is designed to provide the same immediate feedback with a purpose-built approach that trains how the arms and body work together.
            </p>
            <a 
              href="/feel-right-band-guide" 
              className="inline-block px-10 py-4 border border-white text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all"
            >
              JOIN THE WAITLIST
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-zinc-900 overflow-hidden border border-white/10 rounded-sm">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBand__cc34ac6f.png?alt=media&token=9a5b1874-aaa1-4e7c-ac39-2f865b12225b" 
                alt="Feel Right Band" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
