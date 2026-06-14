import React from 'react';
import { motion } from 'framer-motion';

export const MissionSection = () => {
  return (
    <section className="py-24 bg-zinc-950 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="aspect-[16/9] lg:aspect-[4/3] overflow-hidden bg-zinc-900 border border-white/10 rounded-sm">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F455040396_8098531156901972_191203825751922657_n__0cf04f01.jpg?alt=media&token=db93f688-5d6d-4929-821a-5305e4bdcbb8" 
                alt="Dominus Golf Community" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 font-serif uppercase leading-tight">
              MORE THAN A GOLF COMPANY
            </h2>
            <p className="text-gray-400 text-lg md:text-xl mb-12 font-sans leading-relaxed">
              Dominus Golf exists to make elite instruction accessible to everyday golfers while creating opportunities for the next generation of players. Through mentorship, community initiatives, and the Dominus Golf Development Grant, we're committed to growing the game and opening doors for those willing to put in the work.
            </p>
            <a 
              href="/about" 
              className="inline-block px-10 py-4 border border-white text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all"
            >
              LEARN ABOUT OUR MISSION
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
