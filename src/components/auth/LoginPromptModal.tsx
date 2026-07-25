import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { X, Lock } from 'lucide-react';
import { useAuthPrompt } from '../../store/authPromptStore';
import { useScrollLock } from '../../hooks/useScrollLock';

export function LoginPromptModal() {
  const { isOpen, close } = useAuthPrompt();
  const navigate = useNavigate();

  useScrollLock(isOpen);

  // Close on Escape while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  const go = (to: '/login' | '/signup') => {
    close();
    navigate({ to });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={close}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-prompt-title"
        className="relative w-full max-w-md bg-background border border-border shadow-2xl p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mx-auto mb-5 w-12 h-12 flex items-center justify-center rounded-full bg-accent/10 text-accent">
          <Lock size={20} />
        </div>

        <h2 id="login-prompt-title" className="font-serif text-2xl font-bold text-foreground tracking-tight">
          Sign in to continue
        </h2>
        <p className="mt-3 font-sans text-sm text-muted-foreground leading-relaxed">
          Please log in or create an account to complete your purchase.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => go('/login')}
            className="w-full btn-primary-black py-3.5 font-sans text-xs font-semibold tracking-widest uppercase"
          >
            Log In
          </button>
          <button
            onClick={() => go('/signup')}
            className="w-full border border-border py-3.5 font-sans text-xs font-semibold tracking-widest uppercase text-foreground hover:bg-muted transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
