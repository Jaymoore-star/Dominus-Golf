import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

export function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-4">
            Work With Us
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            Join the Stable.
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="space-y-6 font-sans text-base leading-relaxed text-foreground/80 mb-16">
          <p>
            Dominus Golf is a rapidly growing brand dedicated to changing the way the world practices golf. We look for individuals who share our core values: integrity, discipline, and a relentless drive for improvement.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {['Integrity', 'Discipline', 'Relentless Improvement'].map((val) => (
            <div key={val} className="border-t-2 border-accent pt-4">
              <p className="font-serif font-semibold text-foreground">{val}</p>
            </div>
          ))}
        </div>

        {/* Current Openings */}
        <div className="border border-border p-8 mb-10">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Current Openings</h2>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">
            We are currently expanding our digital marketing and local Arizona swing-consulting teams.
          </p>
          <div className="space-y-4">
            {[
              { role: 'Digital Marketing Specialist', type: 'Full-Time · Remote', location: 'Arizona / Remote' },
              { role: 'Swing Consultant', type: 'Part-Time · On-Site', location: 'Florence, Arizona' },
            ].map((job) => (
              <div key={job.role} className="flex items-start justify-between py-4 border-b border-border last:border-0">
                <div>
                  <p className="font-sans font-semibold text-sm text-foreground">{job.role}</p>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5">{job.location}</p>
                </div>
                <span className="font-sans text-[10px] font-semibold tracking-widest uppercase bg-accent/10 text-accent px-3 py-1 shrink-0">
                  {job.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* How to Apply */}
        <div className="bg-muted p-8">
          <h2 className="font-serif text-xl font-bold text-foreground mb-3">How to Apply</h2>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-5">
            We value story and character as much as a resume. Send your background and a brief "golf story" to us — tell us who you are, why golf matters to you, and what you'd bring to the Dominus stable.
          </p>
          <p className="font-sans text-sm font-semibold text-foreground">
            Apply to: <span className="text-accent">[Insert Business Email]</span>
          </p>
        </div>
      </div>

      <Footer />
      <CartDrawer />
    </div>
  );
}
