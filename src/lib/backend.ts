// Shared backend/config for the frontend.
//
// The fallback is the real production Worker, so a build with no
// VITE_BACKEND_URL set still reaches a live API. It used to point at the old
// Blink host, which has been dead since the migration — meaning any build that
// forgot the variable succeeded and then failed silently at checkout. Local
// development overrides this via .env (127.0.0.1:8787).
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'https://dominus-golf-backend.jaymoore.workers.dev';

// Grant payment mode: true = Square sandbox (test cards, no real charge);
// false = production ($15 real charge).
export const GRANT_USE_SANDBOX = false;
