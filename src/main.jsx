import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/inter/latin-800.css'
import '@fontsource/inter/latin-900.css'
import '@fontsource/inter/vietnamese-400.css'
import '@fontsource/inter/vietnamese-500.css'
import '@fontsource/inter/vietnamese-600.css'
import '@fontsource/inter/vietnamese-700.css'
import '@fontsource/inter/vietnamese-800.css'
import '@fontsource/inter/vietnamese-900.css'
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
