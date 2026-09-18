import { Toaster } from 'react-hot-toast';

/**
 * The app's single, configured `<Toaster>`.
 *
 * It lives in its own component so that `main.tsx` (the browser) and
 * `entry-ssr.tsx` (the build-time renderer) mount *the same element with the
 * same props*, rather than two copies that can drift.
 *
 * ── Why this exists ───────────────────────────────────────────────────────
 *
 * `entry-ssr.tsx` originally left the Toaster out, on the assumption that it
 * "renders nothing until a toast fires". That is wrong: react-hot-toast mounts
 * a positioned wrapper `<div data-rht-toaster>` immediately, toast or no toast.
 *
 * So the client rendered a div the server never did — on the first child of the
 * tree. Under `hydrateRoot` that is fatal rather than cosmetic: React reported
 *
 *   Hydration failed because the server rendered HTML didn't match the client.
 *     <AV position="top-center" containerStyle={{top:110}} ...>
 *   +   <div data-rht-toaster="" style={{position:"fixed",zIndex:9999,top:110,…}}>
 *   -   <Suspense>
 *
 * and threw the entire server-rendered tree away, re-rendering from scratch —
 * exactly the double render hydration was adopted to remove.
 *
 * The props matter as much as the presence: `containerStyle` is serialised into
 * that div's inline `style`, so a difference there would mismatch just as badly
 * as omitting it. Keeping one definition is what makes that impossible.
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      // Cleared below the sticky navbar. At the default offset the toast sat on
      // top of the dark header and was unreadable against it.
      containerStyle={{ top: 110 }}
      toastOptions={{
        duration: 2600,
        style: {
          // Theme tokens rather than the hardcoded #1A1A1A/#ffffff this used to
          // carry, so the toast tracks the palette instead of drifting from it.
          background: 'hsl(var(--primary))',
          color: 'hsl(var(--primary-foreground))',
          border: '1px solid hsl(var(--accent) / 0.4)',
          borderRadius: 'var(--radius)',
          fontSize: '15px',
          fontFamily: 'var(--font-sans)',
          letterSpacing: '0.02em',
          padding: '16px 28px',
          minWidth: '340px',
          maxWidth: '90vw',
          justifyContent: 'center',
        },
        // Default icons are a generic green tick and red cross. Gold for success
        // puts the brand on the most frequent toast ("Added to bag"); errors keep
        // a red, since that is the one place the colour carries meaning.
        success: {
          iconTheme: { primary: 'hsl(var(--accent))', secondary: 'hsl(var(--primary))' },
        },
        error: {
          iconTheme: {
            primary: 'hsl(var(--destructive))',
            secondary: 'hsl(var(--primary-foreground))',
          },
        },
      }}
    />
  );
}
