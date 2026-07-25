import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Loader2, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { BACKEND_URL, GRANT_USE_SANDBOX } from '../lib/backend';
import { clearGrantDraft } from '../lib/grantDraft';

type Status = 'verifying' | 'success' | 'unpaid' | 'error';

export function GrantSuccessPage() {
  const [status, setStatus] = useState<Status>('verifying');
  const [message, setMessage] = useState('');
  const ranRef = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode double-invocation.
    if (ranRef.current) return;
    ranRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId') || params.get('order_id') || undefined;
    const paymentId = params.get('transactionId') || params.get('payment_id') || undefined;
    const email = params.get('e') || undefined;
    const name = params.get('n') || undefined;

    // If we've already confirmed this order in this browser, don't re-send.
    const dedupeKey = `grant-emailed-${orderId || paymentId || 'unknown'}`;
    if (orderId || paymentId) {
      if (sessionStorage.getItem(dedupeKey)) {
        clearGrantDraft();
        setStatus('success');
        return;
      }
    } else {
      // No payment reference in the URL — can't verify.
      setStatus('error');
      setMessage('We could not read your payment reference. If you were charged, please contact support.');
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/grant/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, paymentId, email, name, sandbox: GRANT_USE_SANDBOX }),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success) {
          sessionStorage.setItem(dedupeKey, '1');
          // Application is paid for — the draft has served its purpose.
          clearGrantDraft();
          setStatus('success');
        } else if (res.status === 402 || data.paid === false) {
          setStatus('unpaid');
          setMessage(data.error || 'We could not confirm your payment yet.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Something went wrong confirming your application.');
        }
      } catch {
        setStatus('error');
        setMessage('Could not reach the server to confirm your application.');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="py-20 sm:py-28 lg:py-32 px-5 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">

          {status === 'verifying' && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <h1 className="mt-6 font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                Confirming your payment…
              </h1>
              <p className="mt-3 text-sm text-muted-foreground font-sans">
                One moment while we verify your application.
              </p>
            </div>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center">
                <CheckCircle2 className="w-14 h-14 text-accent" strokeWidth={1.5} />
              </div>
              <h1 className="mt-6 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Application Confirmed
              </h1>
              <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed font-sans">
                Thank you for applying to the Dominus Golf Development Grant. Your payment has been
                received and a confirmation email with your free eBook is on its way to your inbox.
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
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 btn-gold px-8 py-4 text-sm font-sans font-semibold tracking-wider uppercase transition-all duration-200 active:scale-[0.98]"
                >
                  Continue to Home
                </Link>
              </div>
            </>
          )}

          {status === 'unpaid' && (
            <>
              <div className="flex justify-center">
                <AlertCircle className="w-14 h-14 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h1 className="mt-6 font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                Payment Not Confirmed
              </h1>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed font-sans">
                {message || 'We could not confirm your payment. If you completed checkout, please wait a moment and refresh this page.'}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center gap-2 border border-accent text-accent px-6 py-3 text-sm font-sans font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Refresh
                </button>
                <Link
                  to="/grant"
                  className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 text-sm font-sans font-medium hover:bg-secondary transition-colors"
                >
                  Back to Grant
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center">
                <AlertCircle className="w-14 h-14 text-destructive" strokeWidth={1.5} />
              </div>
              <h1 className="mt-6 font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                Something Went Wrong
              </h1>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed font-sans">
                {message}
              </p>
              <p className="mt-3 text-sm text-muted-foreground font-sans">
                If you were charged, email{' '}
                <a href="mailto:Customersupport@dominusgolf.com" className="text-accent hover:underline">
                  Customersupport@dominusgolf.com
                </a>{' '}
                and we'll sort it out right away.
              </p>
              <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground font-sans">
                <Download className="w-3.5 h-3.5" /> Your eBook link is also included in your confirmation email.
              </div>
              <div className="mt-8">
                <Link
                  to="/"
                  className="inline-block border border-accent text-accent px-6 py-3 text-sm font-sans font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Back to Dominus Golf
                </Link>
              </div>
            </>
          )}

        </div>
      </section>
      <Footer />
    </div>
  );
}
