import { Check, Info, Target, Zap, Waves, Activity } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../../components/ui/accordion';

export function TourPureOverview() {
  const steps = [
    {
      number: '01',
      title: 'Get familiar with the feel',
      icon: <Activity className="w-5 h-5 text-accent" />,
      content: 'Pick up the trainer and take slow half-swings. The added weight is intentional — it forces you to engage the correct muscles and develop awareness of club position throughout the swing.'
    },
    {
      number: '02',
      title: 'Work through the swing sequence',
      icon: <Zap className="w-5 h-5 text-accent" />,
      content: (
        <ul className="space-y-2 mt-2">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-accent/40 mt-1.5 shrink-0" />
            <span>Set up above the ball in your normal address position.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-accent/40 mt-1.5 shrink-0" />
            <span>Make a controlled takeaway, pausing at waist height to check club face and path.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-accent/40 mt-1.5 shrink-0" />
            <span>Proceed to the top of the backswing — the weight will expose any breakdown in your wrist or arm position.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-accent/40 mt-1.5 shrink-0" />
            <span>Swing through to impact and follow-through, letting the weight teach proper sequencing and tempo.</span>
          </li>
          <li className="flex items-start gap-2 italic text-muted-foreground">
            <span className="w-1.5 h-1.5 bg-accent/20 mt-1.5 shrink-0" />
            <span>Do this 5–10 times, slowly, building feel rather than speed.</span>
          </li>
        </ul>
      )
    },
    {
      number: '03',
      title: 'Use it as a putting aid too',
      icon: <Target className="w-5 h-5 text-accent" />,
      content: 'The Tour Pure doubles as a putting trainer. Use it on the putting green to reinforce a consistent stroke path and feel for distance control.'
    },
    {
      number: '04',
      title: 'Transition to your real club',
      icon: <Waves className="w-5 h-5 text-accent" />,
      content: 'After several reps with the Tour Pure, set it aside and pick up your normal club. Your real club will feel lighter and faster — try to replicate the tempo and positions you felt with the trainer.'
    },
    {
      number: '05',
      title: 'Fitness use',
      icon: <Activity className="w-5 h-5 text-accent" />,
      content: 'The weighted design also doubles as a fitness tool. Golfers can use it for swing-specific warm-up exercises and strength-building routines off the course.'
    }
  ];

  const tips = [
    'Go slow first. The weight will expose swing flaws quickly — rushing defeats the purpose.',
    'Pause at key positions — takeaway, top of backswing, and impact — to build body memory.',
    'Just minutes a day counts. Even 50–100 purposeful swings daily will reinforce muscle memory over time.',
    'Don\'t grip too tight. A tense grip with the added weight will cause fatigue and bad habits.',
    'Use it before rounds, at the range, or on the green — the weight primes your swing muscles wherever you play.'
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
                Designed to build a more consistent, repeatable swing in just minutes a day — for golfers serious about developing real mechanics, better tempo, and lasting improvement on the course.
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
            How to Use the Trainer
          </h2>
          <p className="font-sans text-muted-foreground max-w-2xl mx-auto italic mb-10">
            Based on what Dominus Golf and comparable weighted swing trainer methodology recommends:
          </p>

          <div className="w-full text-left max-w-4xl mx-auto">
            <Accordion type="single" className="w-full">
              <AccordionItem value="swing-methodology" className="border-border/10">
                <AccordionTrigger className="font-serif text-xl sm:text-2xl font-bold hover:no-underline py-6">
                  The P Position Swing Sequence
                </AccordionTrigger>
                <AccordionContent className="font-sans text-muted-foreground leading-relaxed pt-2 pb-8">
                  <p className="mb-6">
                    To build a repeatable, bulletproof swing, we map the movement using the dynamic P Position system. By utilizing the unique feedback of the Tour Pure and its 3.8 weighted barrel, you can feel exactly where the clubhead is at every critical transition point, ensuring proper body rotation and perfect sequencing.
                  </p>
                  
                  <h4 className="font-serif text-lg font-bold text-foreground mb-6">The P Position Sequence</h4>
                  
                  <div className="space-y-8">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center font-serif font-bold text-accent">1</div>
                      <div>
                        <h5 className="font-sans font-bold text-foreground mb-2">P1 to P2: The Takeaway: Address to Shaft Parallel.</h5>
                        <p>Start with a balanced setup. As you move to P2 (club shaft parallel to the ground), focus on a one-piece takeaway. The extra weight of the Tour Pure barrel prevents your hands from flipping, forcing your larger torso muscles to drive the initial movement.</p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center font-serif font-bold text-accent">2</div>
                      <div>
                        <h5 className="font-sans font-bold text-foreground mb-2">P3: The Half-Backswing: Lead Arm Parallel to Ground.</h5>
                        <p>At P3, your lead arm is parallel to the ground and the club shaft points upward. The Tour Pure accentuates the hinge of your wrists. If you over-swing or lose control here, the weighted barrel will immediately pull your hands out of position, giving you instant physical feedback.</p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center font-serif font-bold text-accent">3</div>
                      <div>
                        <h5 className="font-sans font-bold text-foreground mb-2">P4 to P5: The Top and Transition: Top of Swing to Downswing Initiative.</h5>
                        <p>From the top of the swing (P4), the transition to the downswing (P5) must be driven by the lower body. Keep your upper body passive. Let the gravity and weight of the barrel naturally drop the club into the slot, preventing an "over-the-top" slicing motion.</p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center font-serif font-bold text-accent">4</div>
                      <div>
                        <h5 className="font-sans font-bold text-foreground mb-2">P6 to P7: Impact Delivery: Shaft Parallel to Impact.</h5>
                        <p>As the club travels from P6 (shaft parallel to the ground on the downswing) to P7 (impact), focus on the lateral roll of your lead ankle. Rolling the ankle correctly clears your hips and allows the weighted barrel to release precisely through the hitting zone, squaring the clubface naturally.</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="space-y-12 mt-20">
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
