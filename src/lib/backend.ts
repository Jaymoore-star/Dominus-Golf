// Shared backend/config for the frontend.
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'https://45pi183s.backend.blink.new';

// Grant payment mode: true = Square sandbox (test cards, no real charge);
// false = production ($15 real charge).
export const GRANT_USE_SANDBOX = false;
