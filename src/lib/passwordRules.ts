/**
 * Password rules, shared by signup and the account password change.
 *
 * Must stay in step with the Supabase Auth policy (minimum length 8 +
 * "Lowercase, uppercase letters, digits and symbols"). Keeping the list here
 * means the live checklist and the submit gate can't drift apart, and both
 * forms enforce exactly the same thing.
 */

/**
 * ASCII punctuation, matching Supabase's symbol set. Deliberately excludes
 * spaces and non-ASCII, which Supabase does not count as symbols — a looser
 * test would pass on the client and then be rejected by the server.
 */
export const SYMBOL_RE = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

export type PasswordCheck = {
  /** Shown in the live checklist. */
  label: string;
  /** Fragment used to build the "still needs: …" message. */
  hint: string;
  met: boolean;
};

export function passwordChecksFor(password: string): PasswordCheck[] {
  return [
    { label: 'At least 8 characters', hint: '8 or more characters', met: password.length >= 8 },
    { label: 'Contains a number', hint: 'a number', met: /\d/.test(password) },
    { label: 'Contains an uppercase letter', hint: 'an uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains a lowercase letter', hint: 'a lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains a symbol', hint: 'a symbol (!@#$…)', met: SYMBOL_RE.test(password) },
  ];
}

/** Returns an error message, or null when the password satisfies every rule. */
export function validatePassword(password: string): string | null {
  if (!password) return 'Choose a password.';
  const unmet = passwordChecksFor(password).filter((check) => !check.met);
  if (unmet.length === 0) return null;
  return `Your password still needs: ${unmet.map((check) => check.hint).join(', ')}.`;
}
