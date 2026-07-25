/**
 * Account details stored on the Supabase user's `user_metadata`.
 *
 * No extra table for these: they're small, they belong to exactly one user, and
 * Supabase already returns them with the session. Orders are the opposite shape
 * — many rows per user, written by the payment flow rather than the customer —
 * so those will need real storage rather than metadata.
 */

export type SavedAddress = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

export type AccountPreferences = {
  /** Marketing email opt-in. Off by default — opt-in, not opt-out. */
  marketingEmails: boolean;
  /** New product and restock announcements. */
  productUpdates: boolean;
  /** Grant programme announcements and deadlines. */
  grantAnnouncements: boolean;
};

export const EMPTY_ADDRESS: SavedAddress = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
  phone: '',
};

export const DEFAULT_PREFERENCES: AccountPreferences = {
  marketingEmails: false,
  productUpdates: false,
  grantAnnouncements: false,
};

type Metadata = Record<string, unknown>;

/** Read the saved address out of user metadata, tolerating missing/partial data. */
export function readAddress(metadata: Metadata | undefined): SavedAddress {
  const raw = (metadata?.address ?? {}) as Partial<SavedAddress>;
  return { ...EMPTY_ADDRESS, ...raw };
}

/** Read preferences out of user metadata, defaulting anything absent to off. */
export function readPreferences(metadata: Metadata | undefined): AccountPreferences {
  const raw = (metadata?.preferences ?? {}) as Partial<AccountPreferences>;
  return { ...DEFAULT_PREFERENCES, ...raw };
}
