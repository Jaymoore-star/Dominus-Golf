import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { peekPostLoginRedirect, takePostLoginRedirect } from '@/hooks/useRequireAuth'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FieldError, fieldClass } from '@/components/auth/FieldError'

type FieldErrors = { email?: string; password?: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const validate = () => {
    const next: FieldErrors = {}
    if (!email.trim()) next.email = 'Enter your email address.'
    else if (!EMAIL_RE.test(email.trim())) next.email = "That doesn't look like a valid email address."
    if (!password) next.password = 'Enter your password.'
    return next
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNotice('')

    const invalid = validate()
    setFieldErrors(invalid)
    if (Object.keys(invalid).length > 0) return

    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) throw signInError
      const dest = takePostLoginRedirect()
      if (dest) window.location.assign(dest)
      else navigate({ to: '/' })
    } catch (err: any) {
      const msg = (err?.message || '').toLowerCase()
      if (msg.includes('invalid login credentials')) {
        setError('Invalid email or password. Please try again.')
      } else if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
        setError('Please verify your email before signing in. We just resent the link.')
        // Best-effort resend: the user already has the "verify your email"
        // message, and a resend failure should not replace it with a worse one.
        try { await supabase.auth.resend({ type: 'signup', email }) } catch { /* ignored */ }
      } else {
        setError(err?.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}${peekPostLoginRedirect()}` },
      })
      if (oauthError) throw oauthError
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-wide">
              Welcome Back
            </h1>
            <p className="font-sans text-sm text-muted-foreground mt-3">
              Sign in to your Dominus Golf account
            </p>
          </div>

          {/* Form Card */}
          <div className="border border-border p-8 sm:p-10">
            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
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
              <div role="alert" className="mb-6 flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive font-sans text-sm">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Notice */}
            {notice && (
              <div role="status" className="mb-6 flex items-start gap-2 p-3 bg-accent/10 border border-accent/20 text-accent font-sans text-sm">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                <span>{notice}</span>
              </div>
            )}

            {/* Form — noValidate: we render our own messages instead of the browser's bubbles */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="email" className="block font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  required
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  placeholder="you@example.com"
                  className={fieldClass(!!fieldErrors.email)}
                />
                {fieldErrors.email && <FieldError id="email-error">{fieldErrors.email}</FieldError>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                    Password
                  </label>
                  <button
                    type="button"
                    className="font-sans text-xs text-accent hover:text-accent/80 transition-colors"
                    onClick={async () => {
                      setError('')
                      setNotice('')
                      if (!email.trim()) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          email: 'Enter your email address first, then choose "Forgot password?".',
                        }))
                        return
                      }
                      try {
                        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                          redirectTo: `${window.location.origin}/login`,
                        })
                        if (resetError) throw resetError
                        setNotice('Password reset link sent. Check your inbox for the next step.')
                      } catch (err: any) {
                        setError(err?.message || 'Could not send the reset email. Please try again.')
                      }
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }))
                    }}
                    required
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                    placeholder="Enter your password"
                    className={fieldClass(!!fieldErrors.password, 'pr-12')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && <FieldError id="password-error">{fieldErrors.password}</FieldError>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3.5 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> Signing In…</>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className="text-center mt-8 font-sans text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent font-medium hover:text-accent/80 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
