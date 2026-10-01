import { useEffect, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { Tag, X } from 'lucide-react';
import { hasJoinedEmailList, onEmailListJoined, openEmailSignup } from '../../lib/emailList';

/** Same pages the popup keeps quiet on: mid-purchase, account, signing in. */
const QUIET_PREFIXES = ['/checkout', '/account', '/login', '/signup', '/auth', '/grant', '/wishlist'];

/** Hidden for the rest of the visit once closed, and back on the next one. */
const HIDDEN_KEY = 'emailOfferTabHidden';

/**
 * The always-on "10% OFF" button in the bottom corner, on every device.
 *
 * The rotating announcement bar shows the offer for a few seconds at a time and
 * the footer form only to someone who scrolls to the end, so on a phone - where
 * the popup never appears - the offer was easy to miss entirely. This stays put
 * while the page scrolls, and tapping it opens the signup dialog.
 *
 * Deliberately small: a corner button the visitor chooses to tap is not the
 * content-covering interstitial Google demotes on mobile.
 *
 * Renders nothing until mounted (the server cannot know whether this browser
 * has joined), and nothing once it has.
 */
export function EmailOfferTab() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hidden = false;
    try {
      hidden = sessionStorage.getItem(HIDDEN_KEY) === '1';
    } catch {
      // Storage blocked: show it; the X still works for this page view.
    }
    setVisible(!hidden && !hasJoinedEmailList());
    return onEmailListJoined(() => setVisible(false));
  }, []);

  const hide = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(HIDDEN_KEY, '1');
    } catch {
      // Only means it may come back on the next page load.
    }
  };

  if (!visible || QUIET_PREFIXES.some((p) => path.startsWith(p))) return null;

  // Hidden on product pages below desktop width. It used to sit just above the
  // pinned Add to Cart bar there, which on a phone put it on top of the product
  // H1 at first load (audit, 1 Oct 2026). The announcement bar still carries the
  // offer on those pages, and on desktop the tab covers nothing.
  const onProductPage = path.startsWith('/product/');

  return (
    <div
      className={`fixed left-4 z-[35] items-stretch shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 ${
        onProductPage ? 'hidden lg:flex lg:bottom-6' : 'flex bottom-4 sm:bottom-6'
      }`}
    >
      <button
        type="button"
        onClick={openEmailSignup}
        className="flex items-center gap-2 bg-accent pl-4 pr-3 py-2.5 font-sans text-xs font-bold tracking-widest uppercase text-white hover:bg-accent/90 transition-colors"
      >
        <Tag size={14} className="shrink-0" />
        10% Off
      </button>
      <button
        type="button"
        onClick={hide}
        aria-label="Hide the 10% off offer"
        className="flex items-center bg-accent/90 px-2 text-white/80 hover:text-white border-l border-white/25 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
