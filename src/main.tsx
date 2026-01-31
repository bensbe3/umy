import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import './styles/editorial.css'
import { initSecurity } from './utils/security.ts'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { SpeedInsights } from "@vercel/speed-insights/next"

// Initialize security protections (after DOM is ready)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initSecurity, 100); // Delay slightly to ensure gallery can initialize
  });
} else {
  setTimeout(initSecurity, 100); // Delay slightly to ensure gallery can initialize
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
