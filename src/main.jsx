import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Con registerType: 'autoUpdate' el SW se actualiza solo en segundo plano
// y recarga la app cuando hay contenido nuevo, sin pedirle nada al usuario.
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
