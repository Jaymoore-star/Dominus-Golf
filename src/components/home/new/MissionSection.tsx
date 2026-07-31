import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';

export const MissionSection = () => {
  return (
    <section className="py-20 sm:py-24 bg-gray-50 text-black relative overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 relative"
          >
            <div className="aspect-[4/3] overflow-hidden bg-gray-100 border border-black/10 rounded-sm shadow-2xl relative">
              <img 
                src="/images/455040396_8098531156901972_191203825751922657_n__0cf04f01.webp" 
                alt="Dominus Golf Community" 
                className="w-full h-full object-cover brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-10 font-serif uppercase leading-tight text-accent">
              MORE THAN A GOLF COMPANY
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-10 font-sans leading-relaxed">
              Dominus Golf supports player development through structured access programs, including the <span className="text-black font-bold">Dominus Golf Development Program</span>, designed to help emerging golfers access training, equipment, and competitive opportunities. The brand also supports community-based golf events focused on participation and skill development.
            </p>
            {/* Mission is the last section, so the shop CTA lives here — otherwise
                the page ends with no way to buy anything. Primary first. */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/shop/$category"
                params={{ category: 'training-system' }}
                className="inline-flex items-center justify-center px-10 py-4 bg-black text-white font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors text-xs"
              >
                SHOP THE TOUR PURE SYSTEM
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-10 py-4 border border-black/20 text-black font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all text-xs"
              >
                LEARN ABOUT OUR MISSION
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background visual motif */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-black blur-[200px] -mr-[400px] -mt-[400px] rounded-full" />
      </div>
    </section>
  );
};
