import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { store } from '@/redux/store'
import { router } from '@/router'
import { ThemeProvider } from '@/components/ThemeProvider'
import '@/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            className: 'text-sm',
            style: {
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #18181b)',
              border: '1px solid var(--toast-border, #e4e4e7)',
              borderRadius: '0.75rem',
              padding: '12px 16px',
            },
          }}
        />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
