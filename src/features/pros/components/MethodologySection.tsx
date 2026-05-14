export function MethodologySection() {
  return (
    <section className="w-full bg-[#0e0e0e] border-b border-white/10 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
              The Dominus Method
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
              Instruction vs. Integration:<br />The Evolution of Your Game
            </h2>
            <div className="w-12 h-1 bg-accent mx-auto mb-8" />
            <p className="font-sans text-lg text-white/70 leading-relaxed">
              Most golfers are stuck in a cycle of "fixing" their swing. They spend years collecting technical cues, 
              hoping that one more tip about their elbow position or wrist hinge will finally unlock lower scores. At Dominus Golf, we believe there is a massive gap between knowing how to swing and knowing how to play. That’s why we distinguish between traditional Golf Instruction and our signature Practice With a Pro sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <div className="bg-[#111] border border-white/5 p-8 sm:p-10">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6">
                Traditional Instruction: <span className="text-white/40 block mt-1">The Mechanics of the Move</span>
              </h3>
              <p className="font-sans text-sm text-white/55 leading-relaxed mb-8">
                Traditional lessons are essential for building a foundation, but they often stop at the "how." In a standard lesson, the focus is almost entirely on:
              </p>
              <ul className="space-y-4">
                {[
                  { label: 'Static Positions', desc: 'Perfecting the grip, posture, and alignment.' },
                  { label: 'Swing Path', desc: 'Correcting the arc and plane of the club.' },
                  { label: 'Internal Cues', desc: 'Thinking about what your body is doing during the 1.2 seconds of a swing.' },
                ].map((item) => (
                  <li key={item.label} className="flex gap-4 items-start">
                    <span className="w-1.5 h-1.5 bg-white/20 mt-2 shrink-0" />
                    <div>
                      <span className="block font-sans text-sm font-semibold text-white/90">{item.label}</span>
                      <span className="block font-sans text-xs text-white/40 leading-relaxed">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-10 pt-10 border-t border-white/5 font-sans text-sm italic text-white/30 leading-relaxed">
                While mechanics matter, standing on a lesson tee "block practicing" the same movement can often lead to a "driving range swing"—one that looks great in practice but falls apart the moment you step onto the first tee.
              </p>
            </div>

            <div className="bg-[#161616] border border-accent/20 p-8 sm:p-10 relative overflow-hidden">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6">
                Practice With a Pro: <span className="text-accent block mt-1">The Art of the Performance</span>
              </h3>
              <p className="font-sans text-sm text-white/80 leading-relaxed mb-8">
                Practice with a Pro is not a lecture; it is an immersive apprenticeship. Instead of receiving a list of corrections, you train alongside elite players who compete at a high level. You move beyond the mechanics and into the methodology of excellence.
              </p>
              
              <div className="space-y-6">
                <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-accent">
                  What You’ll Actually Learn
                </p>
                <ul className="space-y-6">
                  {[
                    { label: "The Pro's Routine", desc: "Witness the discipline of a pre-shot routine that stands up under pressure." },
                    { label: "Strategic Recovery", desc: "Learn how elite players navigate a \"bad\" shot without letting it derail their entire round." },
                    { label: "Effective Practice", desc: "Stop \"raking\" balls and start practicing with intention, variety, and competitive stress." },
                    { label: "The Scoring Mindset", desc: "Understand how to manage a golf course and make decisions based on percentages, not just ego." },
                  ].map((item) => (
                    <li key={item.label} className="flex gap-4 items-start">
                      <span className="w-1.5 h-1.5 bg-accent mt-2 shrink-0" />
                      <div>
                        <span className="block font-sans text-sm font-semibold text-white">{item.label}</span>
                        <span className="block font-sans text-xs text-white/50 leading-relaxed mt-1">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center bg-white/5 border border-white/10 p-10 sm:p-12">
            <h3 className="font-serif text-2xl font-bold text-white mb-6">
              The Dominus Difference
            </h3>
            <p className="font-sans text-lg text-white/60 leading-relaxed max-w-2xl mx-auto mb-8 italic">
              "Anyone can give you a swing thought. We give you the habits, routines, and mental toughness used by the best in the world."
            </p>
            <p className="font-serif text-xl font-bold text-white uppercase tracking-wider">
              Stop overthinking your swing.<br />Start mastering your game.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
