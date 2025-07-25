import { useState, useEffect } from 'react'

interface PasswordProtectionProps {
  children: React.ReactNode
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing authentication in localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem('tcg-deck-generator-auth')
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const correctPassword = import.meta.env.VITE_APP_PASSWORD || 'deckmaster2024'
    
    if (password === correctPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('tcg-deck-generator-auth', 'authenticated')
      setError('')
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('tcg-deck-generator-auth')
    setPassword('')
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="password-protection">
        <div className="password-form-container">
          <div className="password-header">
            <h1>🎴 TCG Deck Generator</h1>
            <p>This app is currently in private beta. Please enter the access password.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="password">Access Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="submit-btn" disabled={!password.trim()}>
              Access App
            </button>
          </form>
          
          <div className="password-footer">
            <p><small>Need access? Contact the developer for the password.</small></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="auth-header">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      {children}
    </div>
  )
}

export default PasswordProtection