import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import PasswordProtection from './components/PasswordProtection.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PasswordProtection>
      <App />
    </PasswordProtection>
  </React.StrictMode>,
)