/**
 * Shared auth/account input styling; swaps to the destructive palette when invalid.
 *
 * Kept in its own module rather than beside `FieldError`. A file that exports
 * both a component and a plain function breaks Vite's fast refresh: the module
 * no longer qualifies as a component-only boundary, so editing either one
 * forces a full reload and throws away the form state you were testing against.
 */
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
  ].join(' ');
