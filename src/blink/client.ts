import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'titleist-shopify-store-45pi183s',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_DyU5vTmJDa41hAoYPC7AvxhYYQUMvYKw',
  auth: { mode: 'headless' },
})
