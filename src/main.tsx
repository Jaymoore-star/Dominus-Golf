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
            background: '#1A1A1A',
            color: '#ffffff',
            borderRadius: '0',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '15px',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.02em',
            padding: '16px 28px',
            minWidth: '340px',
            maxWidth: '90vw',
            justifyContent: 'center',
          },
        }}
      />
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
