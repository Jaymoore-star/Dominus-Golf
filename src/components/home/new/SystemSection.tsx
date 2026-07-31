import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';

const SYSTEM_CARDS = [
  {
    image: '/images/IMG_20251125_140842__6f9f5d69.webp',
    title: 'THE TOUR PURE WEIGHTED CLUB',
    text: 'A feedback-based training tool designed to reinforce proper sequencing, improve tempo, and help golfers feel correct swing positions through resistance training.'
  },
  {
    image: '/images/Screenshot_20260324_042207_SamsungInternet__2f2a1710.webp',
    title: 'THE TOUR PURE BLUEPRINT',
    text: 'A structured training manual that removes guesswork and provides a clear step-by-step system for developing swing mechanics, sequencing, and consistency.'
  },
  {
    image: '/images/05e7c204-d2a6-4a57-bd3e-b27b347a8ccb__e06f2841.webp',
    title: 'TRAINING THAT TELLS YOU WHAT’S WRONG',
    text: 'Every rep is designed to give immediate feedback so you can self-correct without guessing. Transitions seamlessly from full-swing mechanics onto the putting green to lock in short-game precision.'
  }
];

export const SystemSection = () => {
  return (
    <section className="py-20 sm:py-24 bg-white text-black">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-serif uppercase text-accent"
          >
            THE TOUR PURE SYSTEM
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 font-sans uppercase tracking-[0.3em] font-medium"
          >
            One system. Three tools. One purpose. Build a swing you can trust under pressure.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-10 mb-12">
          {SYSTEM_CARDS.map((card, index) => (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col h-full bg-gray-50 p-10 border border-black/5 group hover:border-black/10 transition-colors rounded-sm overflow-visible"
            >
              <div className="aspect-square overflow-hidden bg-gray-100 border border-black/5 mb-10 rounded-sm group relative flex items-center justify-center p-8">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-6 tracking-tight font-serif uppercase leading-tight text-accent">{card.title}</h3>
              <p className="text-gray-600 font-sans leading-relaxed flex-grow text-sm md:text-lg">{card.text}</p>
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
            <Link
              to="/shop/$category" params={{ category: 'training-system' }} 
              className="inline-block px-10 py-4 bg-black text-white font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors text-xs shadow-xl"
            >
              BUILD YOUR SYSTEM
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
