import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { passwordChecksFor, validatePassword } from '@/lib/passwordRules'
import { FieldError, fieldClass } from '@/components/auth/FieldError'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

type Status = 'checking' | 'ready' | 'invalid' | 'done'

const labelClass =
  'block font-sans text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2'

const buttonClass =
  'w-full bg-primary text-primary-foreground py-3.5 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'

/**
 * Landing page for the "reset your password" email.
 *
 * Supabase verifies the recovery token and redirects here with a live session,
 * which is what makes updateUser({ password }) work without knowing the old
 * password. Previously this link pointed at /login, which has no set-password
 * form — so the reset flow sent an email and then dead-ended.
 *
 * Three things can arrive here: a valid recovery session, an expired or
 * already-used link (error params, no session), or someone opening the URL
 * directly with no session at all. The last two get the same advice.
 */
export function AuthResetPasswordPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  const [status, setStatus] = useState<Status>('checking')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')

  const passwordChecks = passwordChecksFor(password)
  const passwordsMatch = confirmPassword.length > 0 && confirmPassword === password

  useEffect(() => {
    if (status === 'done' || status === 'ready') return

    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const query = new URLSearchParams(window.location.search)
    const errorCode =
      hash.get('error') || hash.get('error_code') || query.get('error') || query.get('error_code')

    // An explicit error is definitive — Supabase rejected the token.
    if (errorCode) {
      setStatus('invalid')
      return
    }

    if (isAuthenticated) {
      setStatus('ready')
      return
    }

    if (isLoading) return

    // Not authenticated, but that may not be final. useAuth flips isLoading off
    // as soon as getSession() resolves, which can happen before the client has
    // finished turning the recovery token in the URL into a session — and
    // supabase-js strips the hash while doing it, so the URL cannot be
    // inspected to tell the two cases apart. Give onAuthStateChange a moment
    // rather than flashing "expired" at someone holding a perfectly good link.
    const timer = setTimeout(() => setStatus('invalid'), 1500)
    return () => clearTimeout(timer)
  }, [isLoading, isAuthenticated, status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setPasswordError('')
    setConfirmError('')

    const problem = validatePassword(password)
    if (problem) {
      setPasswordError(problem)
      return
    }
    if (confirmPassword !== password) {
      setConfirmError('Passwords do not match.')
      return
    }

    setSaving(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setStatus('done')
      window.scrollTo(0, 0)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : ''
      const msg = message.toLowerCase()
      if (msg.includes('new password should be different')) {
        setPasswordError('Choose a password different from your current one.')
      } else if (msg.includes('password')) {
        setPasswordError('That password does not meet the requirements above.')
      } else if (msg.includes('session') || msg.includes('expired') || msg.includes('token')) {
        // The recovery session can lapse while the form is open.
        setStatus('invalid')
      } else {
        setError(message || 'Could not update your password. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-md">
          {status === 'checking' && (
            <div className="flex flex-col items-center text-center">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <h1 className="mt-6 font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-wide">
                Checking your link…
              </h1>
            </div>
          )}

          {status === 'invalid' && (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <AlertCircle size={56} className="text-destructive" strokeWidth={1.5} />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground tracking-wide mb-4">
                This Link Has Expired
              </h1>
              <p className="font-sans text-sm text-muted-foreground mb-8 leading-relaxed">
                Password reset links can only be used once, and they expire after a short while.
                Head to sign in and choose “Forgot password?” to get a fresh one.
              </p>
              <Link
                to="/login"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                Go to Sign In
              </Link>
            </div>
          )}

          {status === 'done' && (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <CheckCircle2 size={56} className="text-accent" strokeWidth={1.5} />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground tracking-wide mb-4">
                Password Updated
              </h1>
              <p className="font-sans text-sm text-muted-foreground mb-8 leading-relaxed">
                Your new password is saved and you're signed in. Use it next time you sign in.
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
            </div>
          )}

          {status === 'ready' && (
            <>
              <div className="text-center mb-10">
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-wide">
                  Set a New Password
                </h1>
                <p className="font-sans text-sm text-muted-foreground mt-3">
                  Choose something you don't use anywhere else.
                </p>
              </div>

              <div className="border border-border p-8 sm:p-10">
                {error && (
                  <div
                    role="alert"
                    className="mb-6 flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive font-sans text-sm"
                  >
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <label htmlFor="newPassword" className={labelClass}>
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (passwordError) setPasswordError('')
                        }}
                        disabled={saving}
                        autoComplete="new-password"
                        placeholder="New password"
                        aria-invalid={!!passwordError}
                        aria-describedby={passwordError ? 'new-password-error' : undefined}
                        className={fieldClass(!!passwordError, 'pr-12')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordError && <FieldError id="new-password-error">{passwordError}</FieldError>}

                    {password.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {passwordChecks.map((check) => (
                          <div key={check.label} className="flex items-center gap-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                check.met ? 'bg-accent' : 'bg-muted-foreground/30'
                              }`}
                            />
                            <span
                              className={`font-sans text-xs ${
                                check.met ? 'text-accent' : 'text-muted-foreground/60'
                              }`}
                            >
                              {check.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmNewPassword" className={labelClass}>
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmNewPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          if (confirmError) setConfirmError('')
                        }}
                        disabled={saving}
                        autoComplete="new-password"
                        placeholder="Re-enter your new password"
                        aria-invalid={!!confirmError}
                        aria-describedby={confirmError ? 'confirm-new-password-error' : undefined}
                        className={fieldClass(!!confirmError, 'pr-12')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {confirmError && (
                      <FieldError id="confirm-new-password-error">{confirmError}</FieldError>
                    )}
                    {!confirmError && confirmPassword.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            passwordsMatch ? 'bg-accent' : 'bg-muted-foreground/30'
                          }`}
                        />
                        <span
                          className={`font-sans text-xs ${
                            passwordsMatch ? 'text-accent' : 'text-muted-foreground/60'
                          }`}
                        >
                          Passwords match
                        </span>
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={saving} className={buttonClass}>
                    {saving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Updating…
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => navigate({ to: '/login' })}
                  className="mt-6 w-full font-sans text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel and go back to sign in
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
