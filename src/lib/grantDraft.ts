/**
 * Draft persistence for the multi-step grant application.
 *
 * Submitting requires a login, which unmounts the form and wipes every field.
 * Without a draft the applicant returns to an empty step 1 after signing in,
 * having already written three essays.
 *
 * localStorage, not sessionStorage. sessionStorage is scoped to a single tab,
 * and the login round-trip does not reliably stay in one: clicking the
 * confirmation link in an email opens a new tab, which starts with empty
 * sessionStorage and so shows an empty form. localStorage also means a closed
 * tab or a browser crash no longer costs the applicant three essays.
 *
 * The trade-off is that personal data (including a guardian's details for
 * junior applicants) now outlives the tab, so the draft is cleared on sign-out
 * and once the application has been paid for.
 */

const GRANT_DRAFT_KEY = 'grantApplicationDraft';

export type GrantDraft = {
  step: number;
  firstName: string;
  lastName: string;
  email: string;
  ageGroup: string;
  stateRegion: string;
  city: string;
  currentHandicap: string;
  targetHandicap: string;
  roadmap: string;
  discipline: string;
  vision: string;
  guardianName: string;
  guardianEmail: string;
};

export function readGrantDraft(): Partial<GrantDraft> {
  try {
    const raw = localStorage.getItem(GRANT_DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<GrantDraft>) : {};
  } catch {
    return {};
  }
}

export function saveGrantDraft(draft: GrantDraft) {
  try {
    localStorage.setItem(GRANT_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // ignore storage errors (private mode / quota)
  }
}

/** Discard the saved draft. Called once the application has been paid for. */
export function clearGrantDraft() {
  try {
    localStorage.removeItem(GRANT_DRAFT_KEY);
  } catch {
    // ignore storage errors (private mode)
  }
}
