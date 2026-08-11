/**
 * Reading a message off a caught value, without `any`.
 *
 * Every `catch` in the auth and account pages did the same thing:
 *
 *     catch (err: any) { setError(err?.message || 'Something went wrong.') }
 *
 * The `any` was load-bearing only because `err` has no type until you narrow it.
 * This does the narrowing once so the call sites do not have to opt out of the
 * type system to read one string.
 *
 * Three shapes are worth handling. Supabase throws `AuthError`, which extends
 * `Error`; some libraries reject with a bare string; and a plain object carrying
 * a `message` covers the rest, including anything that crossed a `fetch`
 * boundary and arrived as JSON rather than as a real `Error`.
 *
 * An empty message returns the fallback rather than an empty string, matching
 * the `||` the call sites already used — an error whose message is blank should
 * still show the reader something.
 */
export function errorMessage(err: unknown, fallback = ''): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'string' && err) return err;

  if (err && typeof err === 'object' && 'message' in err) {
    const message = (err as { message?: unknown }).message;
    if (typeof message === 'string' && message) return message;
  }

  return fallback;
}
