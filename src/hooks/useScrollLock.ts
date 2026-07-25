import { useEffect } from 'react';

/**
 * Locks background scrolling while an overlay (modal, drawer, mobile menu) is open.
 *
 * Two things this handles that a bare `document.body.style.overflow = 'hidden'`
 * does not:
 *
 * 1. Reference counting. Overlays can overlap — opening the cart from the mobile
 *    menu, say. With independent effects, whichever closes first unlocks the page
 *    while the other is still open. Only the last one out restores scrolling here.
 *
 * 2. Scrollbar compensation. Hiding overflow removes the scrollbar, so the page
 *    widens by ~15px and everything jumps sideways as the overlay opens. Padding
 *    the body by the scrollbar's width keeps the layout still.
 */

let lockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

function lock() {
  if (lockCount === 0) {
    const { body } = document;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    previousOverflow = body.style.overflow;
    previousPaddingRight = body.style.paddingRight;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      const existing = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${existing + scrollbarWidth}px`;
    }
  }
  lockCount += 1;
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
    document.body.style.paddingRight = previousPaddingRight;
  }
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
}
