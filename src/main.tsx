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
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2200,
          style: {
            background: '#1A1A1A',
            color: '#ffffff',
            borderRadius: '0',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '13px',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.02em',
            padding: '12px 16px',
          },
        }}
      />
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
