import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App.tsx'
import { refreshAccessToken } from '@/lib/apiClient'

refreshAccessToken().finally(() => {
  console.log('=== XXXXXXXXXXXXXXXXXXXXXx ===', import.meta.env.VITE_API_BASE_URL)
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster position="top-center" />
    </StrictMode>
  )
})
