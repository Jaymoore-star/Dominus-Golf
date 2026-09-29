import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { joinEmailList, type SignupSource } from '../../lib/emailList';

type EmailSignupFormProps = {
  source: SignupSource;
  /** `dark` sits on the black footer; `light` on the popup's cream card. */
  tone: 'dark' | 'light';
  /** Called once the address is in, e.g. so the popup can close itself. */
  onJoined?: () => void;
};

/**
 * The email field and button, shared by the footer and the popup so the two
 * cannot drift apart in what they send or how they report errors.
 */
export function EmailSignupForm({ source, tone, onJoined }: EmailSignupFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'already'>('idle');
  const [error, setError] = useState<string | null>(null);

  const dark = tone === 'dark';
  const inputId = `email-signup-${source}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus('sending');
    try {
      const { already } = await joinEmailList(email, source);
      setStatus(already ? 'already' : 'done');
      onJoined?.();
    } catch (err) {
      setStatus('idle');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'done' || status === 'already') {
    return (
      <p
        role="status"
        className={`flex items-start gap-2 font-sans text-sm ${dark ? 'text-white/80' : 'text-foreground'}`}
      >
        <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-accent" />
        {status === 'done'
          ? 'You are in. Your 10% off code is on its way - check your inbox, or the Promotions tab in Gmail.'
          : 'You are already on the list - your code was emailed when you joined.'}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`min-w-0 flex-1 px-4 py-3 font-sans text-base sm:text-sm focus:outline-none transition-colors ${
            dark
              ? 'bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-accent'
              : 'bg-background border border-border text-foreground placeholder:text-muted-foreground focus:border-accent'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'sending' || !email.trim()}
          className="shrink-0 flex items-center justify-center gap-2 bg-accent px-6 py-3 font-sans text-xs font-semibold tracking-widest uppercase text-white hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'sending' && <Loader2 size={14} className="animate-spin" />}
          Get 10% Off
        </button>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-2 font-sans text-[11px] text-red-400">
          {error}
        </p>
      )}
      <p className={`mt-2 font-sans text-[11px] ${dark ? 'text-white/40' : 'text-muted-foreground'}`}>
        Unsubscribe any time. See our{' '}
        <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-accent">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
