import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const IMAGES = {
  swingSequence: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FGemini_Generated_Image_ofjfkaofjfkaofjf__1e06169b.png?alt=media&token=8b7d6778-29b1-44d2-a5b5-436472032131',
  blueprint: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FScreenshot_20260324_042207_SamsungInternet__2f2a1710.jpg?alt=media&token=4e6db837-c08e-4745-b0c4-9d9e5d607413'
};

export const NewHeroSection = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-black text-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 font-serif leading-[1.05] text-accent"
          >
            STOP PRACTICING.<br />START TRAINING.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto font-sans leading-relaxed"
          >
            The Tour Pure System gives everyday golfers the same type of immediate feedback elite players use to build a connected, repeatable swing—without guesswork.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <a 
              href="/shop/training-system" 
              className="w-full sm:w-auto px-10 py-5 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors text-sm"
            >
              SHOP THE TOUR PURE SYSTEM
            </a>
            <a 
              href="/tour-pure-guide" 
              className="w-full sm:w-auto px-10 py-5 border border-white/20 text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all text-sm"
            >
              HOW IT WORKS
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-accent"
          >
            {[
              "Tour-Inspired Training",
              "Immediate Feedback",
              "Built for Every Skill Level"
            ].map((prop) => (
              <div key={prop} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span>{prop}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          <div className="aspect-[4/3] overflow-hidden bg-zinc-900 border border-white/5 group relative rounded-sm shadow-2xl">
            <img 
              src={IMAGES.swingSequence} 
              alt="Swing sequence mechanics" 
              className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div className="aspect-[4/3] overflow-hidden bg-zinc-900 border border-white/5 group relative rounded-sm shadow-2xl">
            <img 
              src={IMAGES.blueprint} 
              alt="Tour Pure Blueprint book" 
              className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Atmospheric depth elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-white blur-[150px] rounded-full" />
      </div>
    </section>
  );
};
