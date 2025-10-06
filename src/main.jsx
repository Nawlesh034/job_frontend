import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ModelProvider } from './ModelContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  
      <ModelProvider>
        <App />
      </ModelProvider>
    
  </StrictMode>
)
