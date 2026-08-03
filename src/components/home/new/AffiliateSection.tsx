import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';

/**
 * Recruits affiliates from the homepage. Deliberately the only dark band in the
 * lower half of the page — Connection, Results, Mission and Final are all light,
 * so the contrast is what makes this findable while scrolling.
 *
 * Keeps the pitch to one line: the detail lives on /affiliates.
 */
export const AffiliateSection = () => {
  return (
    <section className="py-20 sm:py-24 on-dark bg-primary text-primary-foreground relative overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-6">
            Affiliate Program
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-10 font-serif uppercase leading-tight text-white">
            EARN WITH DOMINUS
          </h2>

          <p className="text-white/70 text-base sm:text-lg mb-10 font-sans leading-relaxed">
            Coaches, content creators, clubs and academies - get paid commission for
            sending serious players to equipment that works.
          </p>

          <Link
            to="/affiliates"
            className="inline-block px-10 py-4 border border-white/25 text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all text-xs"
          >
            BECOME AN AFFILIATE
          </Link>
        </motion.div>
      </div>

      {/* Centred, like FinalSection's. An off-centre blob washes one side and makes
          centred content read as lopsided — which is what the hero's used to do. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent blur-[200px] rounded-full" />
      </div>
    </section>
  );
};
