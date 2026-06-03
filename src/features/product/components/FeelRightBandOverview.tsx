import { Check, Info, Target, Zap, Activity, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function FeelRightBandOverview() {
  const steps = [
    {
      number: '01',
      title: 'Set up the band',
      icon: <Activity className="w-5 h-5 text-accent" />,
      content: 'Slide the Feel Right Band up your trail arm and position it around the bicep. Check that the Dominus Golf logo faces the target at address. The band should sit comfortably — not tight enough to restrict blood flow, not loose enough to slide down during the swing.'
    },
    {
      number: '02',
      title: 'Take your address position',
      icon: <Target className="w-5 h-5 text-accent" />,
      content: 'Set up normally with your club. Feel the band resting lightly against your ribcage. Logo faces the target. This is your connected starting position — your trail arm, torso, and club are one unit.'
    },
    {
      number: '03',
      title: 'Make your takeaway',
      icon: <Zap className="w-5 h-5 text-accent" />,
      content: 'Begin the backswing with a one-piece takeaway — hands, arms, chest, and shoulders moving together. As the shoulders turn, the band will naturally separate from the body. This is correct. Do not try to keep it pinned. Let it go.'
    },
    {
      number: '04',
      title: 'Reach the top of the backswing',
      icon: <Activity className="w-5 h-5 text-accent" />,
      content: 'At the top, the logo should face the sky. Your trail elbow points toward the ground, your shoulders are fully turned, and the band is away from the body. Pause here and confirm the logo position before starting down.'
    },
    {
      number: '05',
      title: 'Start the downswing with your body',
      icon: <Activity className="w-5 h-5 text-accent" />,
      content: 'Begin the downswing from the ground up — hips first, then torso. As your body rotates toward the target, it will naturally pull the trail arm back in. Do not force the band back with your arm. Let your body rotation do the work.'
    },
    {
      number: '06',
      title: 'Feel the reconnection',
      icon: <Zap className="w-5 h-5 text-accent" />,
      content: 'As the trail arm drops into the slot, the band will make contact with your ribcage again and the logo will return to face the target. This reconnection should happen before impact. When you feel it, your sequencing is correct.'
    },
    {
      number: '07',
      title: 'Hit balls with it on',
      icon: <Target className="w-5 h-5 text-accent" />,
      content: 'Unlike many training aids, the Feel Right Band can be used while hitting real shots at the range. Start with short irons and half swings. Work up to full swings as the reconnection becomes automatic.'
    }
  ];

  const tips = [
    'Never force the reconnection. If you pull the band back with your arm, you will create a different swing fault. The logo returning to face the target must be a result of body rotation — not arm movement.',
    'Pause at the top. Especially early in your training, stop at the top of the backswing and check that the logo faces the sky before starting down. This builds the correct positions before adding speed.',
    'Start with half swings. The reconnection happens faster than you think. Short swings let you feel it clearly before adding full speed.',
    'Use it before every round. Ten swings with the Feel Right Band before you tee off primes your sequencing and reminds your body of the correct movement pattern.',
    'If you\'re slicing — you are almost certainly not reconnecting before impact. Slow down, feel the band touch your ribcage, then fire through. The slice will disappear.',
    'If you\'re losing distance — disconnection robs you of the stored energy in the downswing. Reconnecting the trail arm before impact unlocks power you didn\'t know you had.'
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
              Feel Right Band
            </h2>
            <div className="w-20 h-1 bg-accent mb-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="flex justify-center"><Info className="text-accent" size={24} /></div>
              <h3 className="font-serif text-xl font-bold italic underline decoration-accent/30 underline-offset-8 decoration-2">What it is</h3>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                The Feel Right Band is a connection training aid worn around the trail arm bicep. It teaches the trail arm to reconnect to the body during the downswing — the single most important sequencing move in a repeatable golf swing.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center"><Target className="text-accent" size={24} /></div>
              <h3 className="font-serif text-xl font-bold italic underline decoration-accent/30 underline-offset-8 decoration-2">Who it's for</h3>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                Any golfer who slices, casts, comes over the top, or loses power through impact. If your arms and body are working independently, the Feel Right Band fixes it.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center"><Zap className="text-accent" size={24} /></div>
              <h3 className="font-serif text-xl font-bold italic underline decoration-accent/30 underline-offset-8 decoration-2">The Promise</h3>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                Real, immediate feedback on every swing. No guessing. The band either reconnects or it doesn't — and you'll feel the difference instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Logo System Section */}
      <section id="logo-system" className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <p className="font-sans text-[11px] font-semibold tracking-[0.4em] uppercase text-accent mb-4">
            The Logo System
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6">
            Your Visual Checkpoint
          </h2>
          <p className="font-sans text-muted-foreground max-w-2xl mx-auto italic mb-10 text-center">
            The Dominus Golf logo on the band is your checkpoint at every key position in the swing. Learn these three positions and you'll always know if your swing is on track.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full mt-12">
            <div className="bg-white/5 border border-border/10 p-8 rounded-lg shadow-sm">
              <h3 className="font-serif text-xl font-bold mb-4">Position 1: Address</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                Logo faces the target. Trail arm is connected, relaxed, and in front of the body. This is your starting reference point.
              </p>
            </div>
            <div className="bg-white/5 border border-border/10 p-8 rounded-lg shadow-sm">
              <h3 className="font-serif text-xl font-bold mb-4">Position 2: Top of Backswing</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                Logo faces the sky. The trail arm has separated naturally from the body as the shoulders turn. This is correct — do not try to keep the band pinned to your side during the backswing.
              </p>
            </div>
            <div className="bg-white/5 border border-border/10 p-8 rounded-lg shadow-sm">
              <h3 className="font-serif text-xl font-bold mb-4">Position 3: Downswing & Impact</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                Logo returns to face the target. This is the moment that matters. The band must reconnect to the body before impact — driven by body rotation, not by the arm pulling itself back in. If the logo is facing the sky at impact, the trail arm never reconnected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Guide */}
      <section id="methodology" className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <p className="font-sans text-[11px] font-semibold tracking-[0.4em] uppercase text-accent mb-4">
            Methodology
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6">
            How to Use the Feel Right Band
          </h2>
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
            <h2 className="font-serif text-3xl font-bold">Key Tips</h2>
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

      {/* Closing CTA */}
      <section className="text-center py-20">
        <h2 className="font-serif text-3xl font-bold mb-8">Ready to train?</h2>
        <Link
          to="/product/$id"
          params={{ id: 'feel-right-band' }}
          className="inline-flex items-center gap-2 font-sans font-semibold text-sm tracking-widest uppercase px-10 py-4 bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
        >
          Get the Feel Right Band
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
