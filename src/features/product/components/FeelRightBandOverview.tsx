import { Info, Target, Zap, Activity, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function FeelRightBandOverview() {
  const steps = [
    {
      number: '01',
      title: 'Set up the band',
      icon: <Activity className="w-5 h-5 text-accent" />,
      content: 'Slide the Feel Right Band up your trail arm and position it around the bicep—just like Nelly places her training floatie. Check that the Dominus Golf logo faces the target at address. The band should sit comfortably against your upper arm.'
    },
    {
      number: '02',
      title: 'Take your address position',
      icon: <Target className="w-5 h-5 text-accent" />,
      content: 'Set up normally with your club. Feel the band resting lightly against your ribcage. Logo faces the target. This is your connected starting position—your trail arm, torso, and club form a single, unified structure.'
    },
    {
      number: '03',
      title: 'Make your takeaway',
      icon: <Zap className="w-5 h-5 text-accent" />,
      content: 'Begin the backswing with a one-piece takeaway—hands, arms, chest, and shoulders moving together. As the shoulders turn, the band will naturally separate from the body, maintaining proper arm width without letting the elbow fly wide.'
    },
    {
      number: '04',
      title: 'Reach the top of the backswing',
      icon: <Activity className="w-5 h-5 text-accent" />,
      content: 'At the top, the logo should face the sky. Your trail elbow points toward the ground, keeping the arm structured and wide. Pause here and confirm the logo position before starting down.'
    },
    {
      number: '05',
      title: 'Start the downswing with your body',
      icon: <Activity className="w-5 h-5 text-accent" />,
      content: 'Begin the downswing from the ground up—hips first, then torso. As your body rotates toward the target, it will naturally pull the trail arm back in. Do not force the band back with your arm; let your core rotation do the work.'
    },
    {
      number: '06',
      title: 'Feel the reconnection',
      icon: <Zap className="w-5 h-5 text-accent" />,
      content: 'As the trail arm drops into the slot, the band will make contact with your ribcage again and the logo will return to face the target. This delivers the exact "reconnection feel" of the floatie drill, happening smoothly just before impact.'
    },
    {
      number: '07',
      title: 'Hit balls with it on',
      icon: <Target className="w-5 h-5 text-accent" />,
      content: 'Unlike bulky makeshift training aids, the streamlined Feel Right Band is designed for live fire. Start with short irons and half swings to capture that signature tour-level sequencing, then work up to full swings as the reconnection becomes automatic.'
    }
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

          <div className="max-w-3xl mx-auto text-center">
            <div className="space-y-4">
              <div className="flex justify-center"><Info className="text-accent" size={24} /></div>
              <h3 className="font-serif text-xl font-bold italic underline decoration-accent/30 underline-offset-8 decoration-2">What it is</h3>
              <p className="font-sans text-base text-white/80 leading-relaxed">
                The Feel Right Band is a connection training aid worn around the trail arm bicep. It replicates the biomechanics of the tour-famous "floatie drill"—teaching the trail arm to stay structured through the backswing and seamlessly reconnect to the body during the downswing. This is the single most important sequencing move for a repeatable golf swing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connection Callout Box */}
      <section className="max-w-5xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-accent/5 border border-accent/20 p-8 sm:p-12 rounded-lg shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <Target className="text-accent" size={32} />
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                The Connection: Why the "Floatie" Works
              </h3>
              <p className="font-sans text-muted-foreground leading-relaxed text-lg">
                If you’ve seen world #1 Nelly Korda warming up on the range, you’ve likely seen her swinging with an inflatable floatie on her trail arm. Why? Because it prevents the trailing elbow from getting stuck behind the hip or flying outward.
              </p>
              <p className="font-sans text-muted-foreground leading-relaxed">
                The Feel Right Band gives you that exact same tour-proven feel without the bulk. It provides immediate tactile feedback:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/5 p-5 border border-border/10 rounded-sm">
                  <p className="font-sans text-sm">
                    <strong className="text-accent block mb-1 uppercase tracking-widest text-[10px]">In the Backswing</strong>
                    It keeps the trail arm from over-folding, maintaining the critical width and structural support your swing needs.
                  </p>
                </div>
                <div className="bg-white/5 p-5 border border-border/10 rounded-sm">
                  <p className="font-sans text-sm">
                    <strong className="text-accent block mb-1 uppercase tracking-widest text-[10px]">On the Downswing</strong>
                    As your body rotates, the band naturally guides your trail arm back into the "slot" against your ribcage, perfectly syncing your arms with your torso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <p className="font-sans text-[11px] font-semibold tracking-[0.4em] uppercase text-accent mb-4">
            Methodology
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6 text-foreground">
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
                  <h3 className="font-serif text-2xl font-bold mb-3">
                    {step.number} | {step.title}
                  </h3>
                  <div className="font-sans text-muted-foreground leading-relaxed">
                    {step.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
