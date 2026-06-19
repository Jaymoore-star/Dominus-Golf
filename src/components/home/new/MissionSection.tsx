import React from 'react';
import { motion } from 'framer-motion';

export const MissionSection = () => {
  return (
    <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 relative"
          >
            <div className="aspect-[4/3] overflow-hidden bg-zinc-900 border border-white/10 rounded-sm shadow-2xl relative">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F455040396_8098531156901972_191203825751922657_n__0cf04f01.jpg?alt=media&token=db93f688-5d6d-4929-821a-5305e4bdcbb8" 
                alt="Dominus Golf Community" 
                className="w-full h-full object-cover brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-10 font-serif uppercase leading-tight text-accent">
              MORE THAN A GOLF COMPANY
            </h2>
            <p className="text-gray-400 text-lg md:text-2xl mb-14 font-sans leading-relaxed">
              Dominus Golf supports player development through structured access programs, including the <span className="text-white font-bold">Dominus Golf Development Program</span>, designed to help emerging golfers access training, equipment, and competitive opportunities. The brand also supports community-based golf events focused on participation and skill development.
            </p>
            <a 
              href="/about" 
              className="inline-block px-12 py-5 border border-white/20 text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all text-sm"
            >
              LEARN ABOUT OUR MISSION
            </a>
          </motion.div>
        </div>
      </div>

      {/* Background visual motif */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white blur-[200px] -mr-[400px] -mt-[400px] rounded-full" />
      </div>
    </section>
  );
};
