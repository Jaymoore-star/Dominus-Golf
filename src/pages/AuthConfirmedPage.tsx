import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/hooks/useAuth'

type Status = 'checking' | 'confirmed' | 'expired'

/**
 * Landing page for the "Confirm email address" link in the signup email.
 *
 * Supabase verifies the token on its own side, then redirects here. Because the
 * client has detectSessionInUrl enabled, a valid link also establishes a
 * session — the user arrives already signed in. So this page has to handle both
 * outcomes rather than unconditionally telling people to go and sign in.
 *
 * A dead or already-used link comes back with error params instead of a
 * session, which is a completely different message and needs its own state.
 */
export function AuthConfirmedPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [status, setStatus] = useState<Status>('checking')

  useEffect(() => {
    // Supabase reports failures in the hash on the implicit flow and in the
    // query string on the PKCE flow, so both have to be checked.
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const query = new URLSearchParams(window.location.search)
    const errorCode =
      hash.get('error') || hash.get('error_code') || query.get('error') || query.get('error_code')

    if (errorCode) {
      setStatus('expired')
      return
    }

    // No error means Supabase accepted the token; the address is confirmed
    // whether or not a session came back with it.
    if (!isLoading) setStatus('confirmed')
  }, [isLoading])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-md text-center">
          {status === 'checking' && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <h1 className="mt-6 font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-wide">
                Confirming your email…
              </h1>
            </div>
          )}

          {status === 'confirmed' && (
            <>
              <div className="mb-6 flex justify-center">
                <CheckCircle2 size={56} className="text-accent" strokeWidth={1.5} />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground tracking-wide mb-4">
                Email Confirmed
              </h1>

              {isAuthenticated ? (
                <>
                  <p className="font-sans text-sm text-muted-foreground mb-8 leading-relaxed">
                    Your account is active and you're already signed in. Welcome to Dominus Golf.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      to="/"
                      className="w-full sm:w-auto inline-block bg-primary text-primary-foreground px-8 py-3 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
                    >
                      Start Shopping
                    </Link>
                    <Link
                      to="/account"
                      className="w-full sm:w-auto inline-block border border-border px-8 py-3 font-sans text-xs font-semibold tracking-widest uppercase text-foreground hover:bg-muted transition-colors"
                    >
                      View Account
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-sans text-sm text-muted-foreground mb-8 leading-relaxed">
                    Your email address has been confirmed. You can now sign in to your account.
                  </p>
                  <Link
                    to="/login"
                    className="inline-block bg-primary text-primary-foreground px-8 py-3 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </>
          )}

          {status === 'expired' && (
            <>
              <div className="mb-6 flex justify-center">
                <AlertCircle size={56} className="text-destructive" strokeWidth={1.5} />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground tracking-wide mb-4">
                This Link Has Expired
              </h1>
              <p className="font-sans text-sm text-muted-foreground mb-8 leading-relaxed">
                Confirmation links can only be used once, and they expire after a while.
                Try signing in — if your email still needs confirming, we'll send you a fresh link.
              </p>
              <Link
                to="/login"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                Go to Sign In
              </Link>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
