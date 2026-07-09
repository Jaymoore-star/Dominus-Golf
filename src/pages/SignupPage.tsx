import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { blink } from '@/blink/client'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export function SignupPage() {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const passwordChecks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains a number', met: /\d/.test(password) },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      await blink.auth.signUp({
        email,
        password,
        displayName: displayName || undefined,
        metadata: { signupSource: 'dominusgolf.com' },
      })
      setSuccess(true)
    } catch (err: any) {
      const code = err?.code || err?.message || ''
      if (code.includes('EMAIL_ALREADY_EXISTS') || code.includes('email_already_exists')) {
        setError('An account with this email already exists.')
      } else if (code.includes('WEAK_PASSWORD') || code.includes('weak_password')) {
        setError('Password is too weak. Use at least 8 characters with numbers and letters.')
      } else {
        setError(err?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      await blink.auth.signInWithGoogle()
    } catch (err: any) {
      setError(err?.message || 'Google sign-up failed.')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 size={56} className="text-accent" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground tracking-wide mb-4">
              Check Your Email
            </h1>
            <p className="font-sans text-sm text-muted-foreground mb-8 leading-relaxed">
              We've sent a verification link to <strong className="text-foreground">{email}</strong>.
              Please verify your email to activate your account.
            </p>
            <Link
              to="/login"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              Go to Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-wide">
              Create Account
            </h1>
            <p className="font-sans text-sm text-muted-foreground mt-3">
              Join Dominus Golf and elevate your game
            </p>
          </div>

          {/* Form Card */}
          <div className="border border-border p-8 sm:p-10">
            {/* Google Signup */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 border border-border py-3 px-4 font-sans text-sm font-medium text-foreground hover:bg-muted transition-colors duration-200 mb-6"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 border-t border-border" />
              <span className="font-sans text-xs text-muted-foreground tracking-widest uppercase">or</span>
              <div className="flex-1 border-t border-border" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive font-sans text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border border-border bg-background px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full border border-border bg-background px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Create a strong password"
                    className="w-full border border-border bg-background px-4 py-3 pr-12 font-sans text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password strength indicators */}
                {password.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {passwordChecks.map((check) => (
                      <div key={check.label} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${check.met ? 'bg-accent' : 'bg-muted-foreground/30'}`} />
                        <span className={`font-sans text-xs ${check.met ? 'text-accent' : 'text-muted-foreground/60'}`}>
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3.5 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> Creating Account…</>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="mt-6 font-sans text-[11px] text-muted-foreground text-center leading-relaxed">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="underline hover:text-accent transition-colors">Terms & Conditions</Link>{' '}
              and{' '}
              <Link to="/safety-disclaimer" className="underline hover:text-accent transition-colors">Privacy Policy</Link>.
            </p>
          </div>

          {/* Footer link */}
          <p className="text-center mt-8 font-sans text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:text-accent/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
