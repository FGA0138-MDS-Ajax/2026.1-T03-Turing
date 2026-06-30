import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadAndApplyAccessibilityPreferences } from './utils/preferenciasAcessibilidade'

// Aplica as preferencias de acessibilidade do usuario (ou de 'guest',
// se ninguem estiver logado ainda) antes da primeira renderizacao, para
// evitar qualquer "flash" da interface no tamanho/cor padrao.
loadAndApplyAccessibilityPreferences()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
