import React from 'react';
import { motion } from 'framer-motion';

const SYSTEM_CARDS = [
  {
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FPhotoroom-20251125_1425462241__e480e1c6.png?alt=media&token=7c96a611-0b70-415f-a7f7-8bebe5a974a2',
    title: 'THE TOUR PURE WEIGHTED CLUB',
    text: 'A feedback-based training tool designed to reinforce proper sequencing, improve tempo, and help golfers feel correct swing positions through resistance training.'
  },
  {
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FScreenshot_20260324_042207_SamsungInternet__2f2a1710.jpg?alt=media&token=4e6db837-c08e-4745-b0c4-9d9e5d607413',
    title: 'THE TOUR PURE BLUEPRINT',
    text: 'A structured training manual that removes guesswork and provides a clear step-by-step system for developing swing mechanics, sequencing, and consistency.'
  },
  {
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FR__3951d4b9.png?alt=media&token=9d723d63-318c-4122-b7cd-b70a10e0520f',
    title: 'TRAINING THAT TELLS YOU WHAT’S WRONG',
    text: 'Every rep is designed to give immediate feedback so you can self-correct without guessing. Transitions seamlessly from full-swing mechanics onto the putting green to lock in short-game precision.'
  }
];

export const SystemSection = () => {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-4 font-serif uppercase"
          >
            THE TOUR PURE SYSTEM
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 font-sans uppercase tracking-[0.2em]"
          >
            One system. Three tools. One purpose. Build a swing you can trust under pressure.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-20">
          {SYSTEM_CARDS.map((card, index) => (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col h-full bg-zinc-900/30 p-8 border border-white/5 group hover:border-white/10 transition-colors rounded-sm"
            >
              <div className="aspect-square overflow-hidden bg-zinc-900 border border-white/5 mb-10 rounded-sm group relative">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                />
              </div>
              <h3 className="text-xl font-bold mb-6 tracking-tight font-serif uppercase leading-tight min-h-[3rem]">{card.title}</h3>
              <p className="text-gray-400 font-sans leading-relaxed flex-grow text-sm md:text-base">{card.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <a 
              href="/shop/training-systems" 
              className="inline-block px-12 py-5 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors text-sm"
            >
              BUILD YOUR SYSTEM
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
