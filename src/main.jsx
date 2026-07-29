import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/App'
import { AppProvider } from '@/contexts/AppContext'
import { AuthProvider } from '@/contexts/AuthContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AppProvider>
        <AuthProvider>
            <App />
        </AuthProvider>
      </AppProvider>
  </StrictMode>,
)
