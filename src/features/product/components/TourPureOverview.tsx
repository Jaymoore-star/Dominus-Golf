import { Check, Info, Target, Zap, Waves, Activity, ArrowRight } from 'lucide-react';

/**
 * `variant` exists to stop this block cannibalising its own guide page.
 *
 * It renders in full on /tour-pure-guide AND on all three /product/tour-pure-*
 * pages. Once bodies started being server-rendered (scripts/prerender.mjs),
 * that became measurable: after stripping nav and footer boilerplate, the guide and each product page shared ~90% of their unique text, and the three product pages shared 86-88% with each other. One ~540-word block was 60%+ of the content on four URLs, which is what near-duplicate demotion exists to catch - and it left Google choosing which of four pages answers "swing path drills".
 *
 *   'full'    - every section. The guide page, which should own the method.
 *   'summary' - the overview only: What it is / Who it's for / The Promise. The product page keeps the persuasive material and its own description, features, specs and reviews, and already links to the full guide.
 *
 * No copy was rewritten for this: the sections are the existing ones, rendered in one place instead of four. To put the whole block back on product pages, drop the `variant` prop at the ProductPage call site.
 */
export function TourPureOverview({ variant = 'full' }: { variant?: 'full' | 'summary' } = {}) {
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
          <li>• Avoid liting the arms independently.</li>
        </ul>
      )
    },
    {
      number: 'P3',
      title: '9 O’Clock Position',
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
            <p className="text-xs font-medium pt-2 border-t border-accent/10"><strong>Checkpoint:</strong> Trainer is being delivered into impact with structure intact, not released</p>
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
            <p className="text-accent font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Dominus Logo Check</p>
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
    'Practice for 30 minutes per day to build body memory.',
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
          <div class=\"flex flex-col items-center text-center mb-12\">
            <p className=\"font-sans text-[11px] font-semibold tracking-[0.4em] uppercase text-accent mb-4\">
              Overview
            </p>
            <h2 class=\"font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-6\">
              Tour Pure Swing Trainer
            </h2>
            <div class=\"w-20 h-1 bg-accent mb-8\" />
          </div>
        </div>
        {variant === 'full' && (
          <>
        <section id=\"methodology\" className=\"max-w-5xl mx-auto\">
        </div>
       </div>
      )
      </div>
      </>

