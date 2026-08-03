import { Link } from '@tanstack/react-router';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const IMAGES = {
  redShirt1: '/images/455082619_8098523016902786_920092106083080418_n__592fb000.webp',
  redShirt2: '/images/301503221_456856363151119_1248543110073884434_n__b21743d9.webp'
};

export const NewHeroSection = () => {
  return (
    <section className="relative pt-20 sm:pt-28 pb-20 sm:pb-24 overflow-hidden bg-white text-black">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 font-serif leading-[1.08] text-accent"
          >
            THE FEEDBACK YOUR SWING<br /><span className="text-black">HAS BEEN MISSING.</span>
          </motion.h1>
          
          {/* The bullets and the buttons share one shrink-to-fit column.
              Centring them separately gave each its own width and so its own left
              edge — the list sat about 48px inside the buttons, which is what read
              as misaligned. Sizing them together means one left edge for both.
              max-w-full so the long bullets wrap on a phone instead of overflowing. */}
          <div className="w-fit max-w-full mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-10 text-left"
            >
              <ul className="space-y-2.5">
                {[
                  'Weighted training system',
                  'Teaches swing path and swing plane',
                  'Immediate feedback on every rep',
                  'Works on full swing, chipping, putting alignment',
                  'Used indoors or outdoors',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 bg-accent shrink-0" />
                    <span className="text-base md:text-lg text-gray-600 font-sans leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12"
            >
              <Link
                to="/shop/$category" params={{ category: 'training-system' }}
                className="px-10 py-4 bg-black text-white font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors text-xs text-center"
              >
                SHOP THE TOUR PURE SYSTEM
              </Link>
              <Link
                to="/tour-pure-guide"
                className="px-10 py-4 border border-black/20 text-black font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all text-xs text-center"
              >
                HOW IT WORKS
              </Link>
            </motion.div>
          </div>

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
                <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-black" />
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
          <div className="aspect-[4/3] overflow-hidden bg-gray-100 border border-black/5 group relative rounded-sm shadow-2xl">
            <img 
              src={IMAGES.redShirt1} 
              alt="Professional golfer training with Tour Pure System" 
              className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="aspect-[4/3] overflow-hidden bg-gray-100 border border-black/5 group relative rounded-sm shadow-2xl">
            <img 
              src={IMAGES.redShirt2} 
              alt="Elite player feedback loop training" 
              className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Removed: a 20%-opacity blurred black circle anchored at -top-1/4 -left-1/4.
          On a wide screen it washed the top-left quarter grey, which made a centred
          hero read as lopsided. A white hero needs no atmosphere behind the type. */}
    </section>
  );
};
