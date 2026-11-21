import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/base.css'
import './styles/components.css'
import App from './App.jsx'
import { applyTheme, getStoredTheme, watchSystemTheme } from './utils/theme'

// index.html already set data-theme before paint; re-apply in case storage changed, then follow the OS for "auto".
applyTheme(getStoredTheme())
watchSystemTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
