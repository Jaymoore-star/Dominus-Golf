import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

const sections = [
  {
    title: 'Read Before Use',
    body: `The Tour Pure weighted training system is a professional-grade swing trainer designed for controlled, deliberate practice. It is NOT a standard golf club and must NOT be used as one. Misuse of this product can result in serious personal injury or property damage. By using the Tour Pure system, you agree to the terms and conditions outlined in this safety disclaimer.`,
  },
  {
    title: 'Swing Speed Warning',
    body: `Do NOT swing Tour Pure at full speed. Use 50–75% of your maximum swing speed at all times during practice. The additional weight of the trainer places significant stress on your muscles, tendons, and joints. Swinging at full speed with a weighted trainer dramatically increases the risk of strain, sprain, or more serious injury.`,
  },
  {
    title: 'Warm-Up Required',
    body: `Always warm up for a minimum of 5–10 minutes before using Tour Pure. Begin with light stretching targeting the shoulders, back, hips, and forearms. Never use the trainer cold or immediately after waking. Begin every session with slow, controlled half-swings before progressing to fuller motions.`,
  },
  {
    title: 'Clear Your Surroundings',
    body: `Before each practice session, ensure you have at least 10 feet of clear space in every direction, including overhead clearance. Never use Tour Pure indoors unless in a dedicated training facility with proper clearances. Check for bystanders, pets, and property before every swing.`,
  },
  {
    title: 'Session Duration',
    body: `Limit weighted swing training sessions to 10–15 minutes of active swinging per session. Overuse or prolonged sessions without rest significantly increases injury risk. Allow a minimum of 24 hours of recovery between intense training sessions.`,
  },
  {
    title: 'Who Should Not Use This Product',
    body: `Tour Pure is not suitable for individuals with existing shoulder, back, elbow, wrist, or hip injuries without clearance from a qualified medical professional. If you are pregnant, have recently undergone surgery, or are currently receiving treatment for a musculoskeletal condition, do not use this product until cleared by a physician.`,
  },
  {
    title: 'No Liability',
    body: `Dominus Golf LLC is not responsible for injuries, property damage, or any other losses resulting from improper use, failure to follow safety guidelines, or use of the product contrary to its intended purpose. Users assume all risk associated with use of the Tour Pure training system.`,
  },
  {
    title: 'Cool Down',
    body: `After every training session, complete a cool-down period of at least 5 minutes with light stretching. Target the same muscle groups used during practice - shoulders, forearms, back, and hips. Proper recovery is as important as the training itself.`,
  },
];

export function SafetyDisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Important Information
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            Safety Disclaimer
          </h1>
          <p className="font-sans text-sm text-white/55 mt-5 max-w-xl mx-auto leading-relaxed">
            Please read this entire disclaimer before using the Tour Pure training system.
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-accent/10 border-y border-accent/30 py-5 px-4">
        <div className="max-w-3xl mx-auto flex items-start gap-4">
          <span className="text-accent text-xl shrink-0 mt-0.5">⚠</span>
          <p className="font-sans text-sm text-accent leading-relaxed font-semibold">
            Do NOT swing Tour Pure at full speed. Use 50–75% of maximum swing speed. Failure to follow safety guidelines may result in serious injury.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="space-y-12">
          {sections.map((s, i) => (
            <div key={s.title}>
              <div className="flex items-start gap-5 mb-4">
                <span className="font-sans text-[11px] font-semibold tracking-[0.3em] uppercase text-accent/60 shrink-0 mt-1 w-7">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="font-serif text-xl font-bold text-foreground">{s.title}</h2>
              </div>
              <div className="pl-12">
                <p className="font-sans text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
              {i < sections.length - 1 && <div className="mt-12 border-b border-border" />}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-muted p-8 border-l-4 border-accent">
          <p className="font-serif text-base font-semibold text-foreground mb-2">
            Questions about safe usage?
          </p>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Contact our team at{' '}
            <a href="mailto:Customersupport@dominusgolf.com" className="text-accent hover:underline">
              Customersupport@dominusgolf.com
            </a>{' '}
            before beginning your training program.
          </p>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}
