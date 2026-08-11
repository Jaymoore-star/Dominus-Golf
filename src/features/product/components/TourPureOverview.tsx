import { Check, Info, Target, Zap, Waves, Activity, ArrowRight } from 'lucide-react';

export function TourPureOverview() {
  const steps = [
    {
      number: 'P1',
      title: 'Setup Position',
      icon: <Target className="w-5 h-5 text-accent" />,
      content: (
        <ul className="space-y-1">
          <li>• Feet together to establish balance</li>
          <li>• Step into athletic stance (shoulder-width)</li>
          <li>• Hinge from the hips to approximately 45 degrees</li>
          <li>• Neutral spine maintained</li>
          <li>• Trainer set parallel to the ground at address (The Tour Pure should not be pointed downward)</li>
          <li>• Arms hang naturally beneath the shoulders</li>
        </ul>
      )
    },
    {
      number: 'P2',
      title: 'Takeaway',
      icon: <Zap className="w-5 h-5 text-accent" />,
      content: (
        <ul className="space-y-1">
          <li>• Initiate the movement with the chest and shoulders.</li>
          <li>• Keep the arms connected to the body.</li>
          <li>• Maintain posture and balance.</li>
          <li>• The trainer remains in front of the chest.</li>
          <li>• Avoid lifting the arms independently.</li>
        </ul>
      )
    },
    {
      number: 'P3',
      title: '9 O’Clock Position',
      icon: <Activity className="w-5 h-5 text-accent" />,
      content: (
        <ul className="space-y-1">
          <li>• Lead arm parallel to the ground</li>
          <li>• Wrist hinge established</li>
          <li>• Club shaft vertical</li>
          <li>• Chest rotated away from target</li>
          <li>• Structure maintained in both arms</li>
          <li className="pt-2 text-xs italic opacity-70">This completes the backswing structure used in the 9-to-3 system.</li>
        </ul>
      )
    },
    {
      number: 'P6',
      title: 'Delivery Position',
      icon: <Waves className="w-5 h-5 text-accent" />,
      content: (
        <div className="space-y-3">
          <ul className="space-y-1">
            <li>• Hands lead the Tour Pure trainer into the strike zone</li>
            <li>• Trainer remains parallel to the ground</li>
            <li>• Wrist angles preserved from P3</li>
            <li>• Lower body initiates rotation toward target (Rotate the trail ankle towards the target)</li>
            <li>• Pressure shifting into lead side</li>
            <li>• Chest remains controlled, not fully open</li>
          </ul>
          <div className="bg-accent/5 p-4 rounded-sm border border-accent/10 space-y-2">
            <p className="text-xs font-bold text-accent uppercase tracking-wider">Two things happen here:</p>
            <ol className="text-xs space-y-1 list-decimal ml-4">
              <li>The hips naturally slide towards target.</li>
              <li>The hands and elbow slides inside not over the top.</li>
            </ol>
            <p className="text-xs font-medium pt-2 border-t border-accent/10"><strong>Checkpoint:</strong> Trainer is being delivered into impact with structure intact, not released.</p>
          </div>
        </div>
      )
    },
    {
      number: 'P7',
      title: 'Impact Position',
      icon: <Target className="w-5 h-5 text-accent" />,
      content: (
        <div className="space-y-4">
          <ul className="space-y-1">
            <li>• Weight fully into lead side</li>
            <li>• Hands ahead of the trainer</li>
            <li>• Lead wrist flat and stable</li>
            <li>• Hips open to target</li>
            <li>• Chest rotating through impact</li>
          </ul>
          <div className="bg-gray-100 border border-accent/30 p-4 rounded-sm">
            <p className="text-accent font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Dominus Logo Check:</p>
            <p className="text-sm mb-3">At P7, you should be able to clearly see the Dominus Golf logo on the trainer.</p>
            <ul className="text-xs space-y-1 opacity-80">
              <li>• <span className="text-green-600 font-bold">Logo visible:</span> Impact position is correct</li>
              <li>• <span className="text-red-600 font-bold">Logo not visible:</span> Early release or loss of structure has occurred</li>
            </ul>
            <p className="text-[10px] mt-4 pt-3 border-t border-black/5 uppercase tracking-widest opacity-60">This is the primary feedback mechanism of Tour Pure.</p>
          </div>
        </div>
      )
    },
    {
      number: 'P8',
      title: 'Extension',
      icon: <ArrowRight className="w-5 h-5 text-accent" />,
      content: (
        <ul className="space-y-1">
          <li>• Arms extend down the target line</li>
          <li>• Body continues rotating through impact</li>
          <li>• Posture remains stable</li>
          <li>• Controlled release of the trainer</li>
        </ul>
      )
    },
    {
      number: 'P9',
      title: 'Finish',
      icon: <Check className="w-5 h-5 text-accent" />,
      content: (
        <ul className="space-y-1">
          <li>• Lead arm parallel to the ground</li>
          <li>• Club shaft vertical</li>
          <li>• Chest fully facing target</li>
          <li>• Weight fully stacked on lead side</li>
          <li>• Balanced, athletic finish position</li>
        </ul>
      )
    }
  ];

  const tips = [
    'Perform 100 repetitions daily to build body memory.',
    'Move from P1 → P3, then transition into P6 → P7.',
    'Extend through P8 and finish at P9.',
    'Focus on structure, balance, and repeatability rather than speed.',
    'Do not swing fast. The objective is building a repeatable impact position.',
    'Build consistent contact and compression through proper sequencing.'
  ];

  return (
    <div className="mt-20 space-y-24">
      {/* Overview Section */}
      <section id="overview" className="relative overflow-hidden bg-gray-50 text-black py-20 px-6 border border-black/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <p className="font-sans text-[11px] font-semibold tracking-[0.4em] uppercase text-accent mb-4">
              Overview
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Tour Pure Swing Trainer
            </h2>
            <div className="w-20 h-1 bg-accent mb-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="flex justify-center"><Info className="text-accent" size={24} /></div>
              <h3 className="font-serif text-xl font-bold italic underline decoration-accent/30 underline-offset-8 decoration-2">What it is</h3>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">
                Dominus Golf's patented multifunctional weighted golf trainer, the Tour Pure, is an all-in-one swing mechanics tool, putting aid, and fitness trainer.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center"><Target className="text-accent" size={24} /></div>
              <h3 className="font-serif text-xl font-bold italic underline decoration-accent/30 underline-offset-8 decoration-2">Who it's for</h3>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">
                The Tour Pure is an excellent training aid for beginners, while low handicap golfers can use it to focus and sharpen skills already developed.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center"><Zap className="text-accent" size={24} /></div>
              <h3 className="font-serif text-xl font-bold italic underline decoration-accent/30 underline-offset-8 decoration-2">The Promise</h3>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">
                Designed to build a more consistent, repeatable swing in just minutes a day - for golfers serious about developing real mechanics, better tempo, and lasting improvement on the course.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Guide */}
      <section id="methodology" className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <p className="font-sans text-[11px] font-semibold tracking-[0.4em] uppercase text-accent mb-4">
            Methodology
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6">
            The Dominus 9 o’clock-to-3 o’clock Training Method
          </h2>
          <p className="font-sans text-muted-foreground max-w-2xl mx-auto italic mb-10">
            This system is built around one principle: train impact first, then build the swing around it. Repeat these steps daily 100 reps per day.
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((step, idx) => (
            <div key={idx} className="group relative bg-white/5 hover:bg-white/10 border border-border/10 p-8 sm:p-10 transition-all duration-300 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
                <div className="flex-shrink-0 flex items-center gap-4">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-accent/20 group-hover:text-accent/30 transition-colors">
                    {step.number}
                  </span>
                  <div className="sm:hidden">{step.icon}</div>
                </div>
                <div className="flex-grow">
                  <div className="hidden sm:block mb-4">{step.icon}</div>
                  <h3 className="font-serif text-2xl font-bold mb-3">{step.title}</h3>
                  <div className="font-sans text-muted-foreground leading-relaxed">
                    {step.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Training Protocol */}
      <section id="protocol" className="bg-accent/5 border-y border-accent/10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <Target className="text-accent" size={32} />
            <h2 className="font-serif text-3xl font-bold uppercase tracking-tight">Training Protocol</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-6">
              <p className="font-sans text-sm text-foreground/80 leading-relaxed font-medium">
                The objective is not swing speed. <span className="text-accent font-bold">Do not swing fast.</span>
              </p>
              <p className="font-sans text-sm text-foreground/60 leading-relaxed">
                The objective is building a repeatable impact position that produces consistent contact and compression.
              </p>
            </div>
            <div className="space-y-4">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="mt-1.5 p-1 bg-accent/20 rounded-full flex-shrink-0">
                    <Check size={14} className="text-accent" />
                  </div>
                  <p className="font-sans text-sm text-foreground/80 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
