import type { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

/**
 * In-page replacement for the browser's native validation bubble, which is
 * drawn by the OS and cannot be styled. Auth forms set `noValidate` and render
 * this instead so messages match the rest of the site.
 */
export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-1.5 font-sans text-xs text-destructive">
      <AlertCircle size={13} className="mt-px shrink-0" />
      <span>{children}</span>
    </p>
  )
}

/** Shared auth input styling; swaps to the destructive palette when invalid. */
export const fieldClass = (hasError: boolean, extra = '') =>
  [
    // text-base (16px) on phones, not text-sm: iOS Safari magnifies the whole
    // page when a focused control is under 16px, and never undoes it. In an SPA
    // there is no reload to reset the zoom, so signing in left every subsequent
    // page enlarged and cut off at the right.
    'w-full border bg-background px-4 py-3 font-sans text-base sm:text-sm text-foreground',
    'placeholder:text-muted-foreground/60 focus:outline-none transition-colors',
    extra,
    hasError ? 'border-destructive focus:border-destructive' : 'border-border focus:border-accent',
  ].join(' ')
