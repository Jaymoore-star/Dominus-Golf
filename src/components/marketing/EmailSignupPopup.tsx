import { useEffect, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';
import { EmailSignupForm } from './EmailSignupForm';
import {
  dismissEmailPopup,
  emailPopupRecentlyDismissed,
  hasJoinedEmailList,
} from '../../lib/emailList';

/** Seconds on the site before the popup offers itself. */
const DELAY_MS = 20_000;

/**
 * Desktop only. Google demotes mobile pages behind an "intrusive interstitial"
 * - a popup covering the content on a phone - and that is a ranking cost
 * paid on every page, for a form the footer already carries. On a phone the
 * footer form is the whole offer.
 */
const DESKTOP_QUERY = '(min-width: 1024px) and (pointer: fine)';

/**
 * Pages where interrupting is wrong: mid-purchase, in the account area, or
 * signing in. The popup is offered on browsing pages only.
 */
const QUIET_PREFIXES = ['/checkout', '/account', '/login', '/signup', '/auth', '/grant', '/wishlist'];

/**
 * The email-list popup: once per visitor, after DELAY_MS or when the mouse
 * leaves the top of the window (heading for the tab bar or the close button),
 * whichever comes first. A dismissal is remembered for 30 days; joining, for
 * good.
 *
 * Renders nothing on the server, so it adds nothing to the prerendered HTML.
 */
export function EmailSignupPopup() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);

  // Decide once, on first mount, whether this visitor should ever see it.
  useEffect(() => {
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    if (hasJoinedEmailList() || emailPopupRecentlyDismissed()) return;
    setArmed(true);
  }, []);

  const quiet = QUIET_PREFIXES.some((p) => path.startsWith(p));

  useEffect(() => {
    if (!armed || open || quiet) return;
    const show = () => {
      setArmed(false);
      setOpen(true);
    };
    const timer = window.setTimeout(show, DELAY_MS);
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) show();
    };
    document.addEventListener('mouseout', onLeave);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('mouseout', onLeave);
    };
  }, [armed, open, quiet]);

  useScrollLock(open);

  const close = () => {
    setOpen(false);
    dismissEmailPopup();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      dismissEmailPopup();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={close} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-popup-title"
        className="relative w-full max-w-md bg-background border border-border shadow-2xl p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        <p className="font-sans text-[11px] font-semibold tracking-[0.35em] uppercase text-accent mb-3">
          Join the List
        </p>
        <h2 id="email-popup-title" className="font-serif text-2xl font-bold text-foreground tracking-tight">
          10% off your first order
        </h2>
        <p className="mt-3 mb-7 font-sans text-sm text-muted-foreground leading-relaxed">
          New gear, training tips and members-only offers. Your code arrives by email right away.
        </p>

        {/* Stays open on success so the confirmation is read; closing then
            counts as a dismissal, which is harmless once joined. */}
        <EmailSignupForm source="popup" tone="light" />

        <button
          onClick={close}
          className="mt-5 font-sans text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
