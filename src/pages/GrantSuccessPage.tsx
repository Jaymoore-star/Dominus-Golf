import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function GrantSuccessPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Application Submitted
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed font-sans">
            Thank you for applying to the Dominus Golf Development Grant.
            We've received your application and payment, and your confirmation email
            with the eBook download link is on its way.
          </p>
          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="font-serif text-xl font-semibold tracking-tight">What's Next</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed font-sans text-left max-w-sm mx-auto">
              <li className="flex gap-3">
                <span className="text-accent font-bold shrink-0">1.</span>
                Check your inbox for the confirmation email and eBook download.
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold shrink-0">2.</span>
                Our team reviews applications on a rolling basis.
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold shrink-0">3.</span>
                The winner will be notified on <strong className="text-foreground">August 22, 2026</strong>.
              </li>
            </ul>
          </div>
          <div className="mt-12">
            <a
              href="https://www.dominusgolf.com"
              className="inline-block border border-accent text-accent px-6 py-3 text-sm font-sans font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Back to Dominus Golf
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
