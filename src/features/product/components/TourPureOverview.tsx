import { Check, Info, Target, Zap, Waves, Activity } from 'lucide-react';

export function TourPureOverview() {
  const steps = [
    {
      number: '01',
      title: 'P1 to P2: The Takeaway',
      icon: <Activity className="w-5 h-5 text-accent" />,
      content: (
        <div className="space-y-3">
          <p className="font-bold text-foreground">Address to Shaft Parallel.</p>
          <p>Start with a balanced setup. As you move to P2 (club shaft parallel to the ground), focus on a one-piece takeaway. The extra weight of the Tour Pure barrel prevents your hands from flipping, forcing your larger torso muscles to drive the initial movement.</p>
        </div>
      )
    },
    {
      number: '02',
      title: 'P3: The Half-Backswing',
      icon: <Zap className="w-5 h-5 text-accent" />,
      content: (
        <div className="space-y-3">
          <p className="font-bold text-foreground">Lead Arm Parallel to Ground.</p>
          <p>At P3, your lead arm is parallel to the ground and the club shaft points upward. The Tour Pure accentuates the hinge of your wrists. If you over-swing or lose control here, the weighted barrel will immediately pull your hands out of position, giving you instant physical feedback.</p>
        </div>
      )
    },
    {
      number: '03',
      title: 'P4 to P5: The Top and Transition',
      icon: <Target className="w-5 h-5 text-accent" />,
      content: (
        <div className="space-y-3">
          <p className="font-bold text-foreground">Top of Swing to Downswing Initiative.</p>
          <p>From the top of the swing (P4), the transition to the downswing (P5) must be driven by the lower body. Keep your upper body passive. Let the gravity and weight of the barrel naturally drop the club into the slot, preventing an "over-the-top" slicing motion.</p>
        </div>
      )
    },
    {
      number: '04',
      title: 'P6 to P7: Impact Delivery',
      icon: <Waves className="w-5 h-5 text-accent" />,
      content: (
        <div className="space-y-3">
          <p className="font-bold text-foreground">Shaft Parallel to Impact.</p>
          <p>As the club travels from P6 (shaft parallel to the ground on the downswing) to P7 (impact), focus on the lateral roll of your lead ankle. Rolling the ankle correctly clears your hips and allows the weighted barrel to release precisely through the hitting zone, squaring the clubface naturally.</p>
        </div>
      )
    },
    {
      number: '05',
      title: 'Fitness & Putting Use',
      icon: <Activity className="w-5 h-5 text-accent" />,
      content: 'The weighted design also doubles as a fitness tool for swing-specific warm-ups and a putting aid to reinforce a consistent stroke path and distance control.'
    }
  ];

  const tips = [
    'Go slow first. The weight will expose swing flaws quickly — rushing defeats the purpose.',
    'Pause at key positions — takeaway, top of backswing, and impact — to build body memory.',
    'Just minutes a day counts. Even 50–100 purposeful swings daily will reinforce muscle memory over time.',
    'Don\'t grip too tight. A tense grip with the added weight will cause fatigue and bad habits.',
    'Use it to warm up before rounds, not just at the range — the weight primes your swing muscles effectively.'
  ];

  return (
    <div className="mt-20 space-y-24">
      {/* Overview Section */}
      <section id="overview" className="relative overflow-hidden bg-black text-white py-20 px-6 border border-white/10">
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
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                Dominus Golf's patented multifunctional weighted golf trainer, the Tour Pure, is an all-in-one swing mechanics tool, putting aid, and fitness trainer.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center"><Target className="text-accent" size={24} /></div>
              <h3 className="font-serif text-xl font-bold italic underline decoration-accent/30 underline-offset-8 decoration-2">Who it's for</h3>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                The Tour Pure is an excellent training aid for beginners, while low handicap golfers can use it to focus and sharpen skills already developed.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center"><Zap className="text-accent" size={24} /></div>
              <h3 className="font-serif text-xl font-bold italic underline decoration-accent/30 underline-offset-8 decoration-2">The Promise</h3>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                Designed to create a stronger and more powerful golf swing in just minutes a day — particularly for golfers working on ball control, increasing distance, and getting into golfing shape.
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
            Swing Methodology — The Step-by-Step Sequence
          </h2>
          <p className="font-sans text-muted-foreground max-w-3xl mx-auto italic leading-relaxed">
            To build a repeatable, bulletproof swing, we map the movement using the dynamic P Position system. 
            By utilizing the unique feedback of the Tour Pure and its 3.8 weighted barrel, you can feel exactly 
            where the clubhead is at every critical transition point, ensuring proper body rotation and perfect sequencing.
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((step, idx) => (
            <div key={idx} className="group relative bg-white/5 hover:bg-white/10 border border-border/10 p-8 sm:p-10 transition-all duration-300 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
                <div className="flex-shrink-0 flex items-center gap-4">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-accent/20 group-hover:text-accent/30 transition-colors">
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

      {/* Key Tips */}
      <section id="tips" className="bg-accent/5 border-y border-accent/10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <Target className="text-accent" size={32} />
            <h2 className="font-serif text-3xl font-bold">Key Tips for Best Results</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
      </section>
    </div>
  );
}
