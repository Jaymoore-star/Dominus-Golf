import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Centred rather than tucked in the top-right corner: confirmations like
          "Added to bag" and "Choose a size first" were easy to miss out there,
          and the size prompt in particular has to be read to make sense of the
          navigation that follows it. Sized up for the same reason. */}
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
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
