import { useState } from 'react'
import GameSelection from './components/GameSelection'
import DeckForm from './components/DeckForm'
import DeckSuggestions from './components/DeckSuggestions'
import { ToastContainer } from './components/Toast'
import { useToast } from './hooks/useToast'
import { DeckFormData, DeckSuggestion, TCGGame } from './types'

function App() {
  const [selectedGame, setSelectedGame] = useState<TCGGame | null>(null)
  const [deckSuggestions, setDeckSuggestions] = useState<DeckSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const { toasts, removeToast, handleApiError, showSuccess } = useToast()

  const handleGameSelect = (game: TCGGame) => {
    setSelectedGame(game)
    setDeckSuggestions([])
  }

  const handleFormSubmit = async (formData: DeckFormData) => {
    setLoading(true)
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/generate-decks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error = new Error(errorData.error || 'Failed to generate deck suggestions') as Error & { status: number }
        error.status = response.status
        throw error
      }

      const suggestions = await response.json()
      setDeckSuggestions(suggestions)
      showSuccess(
        'Decks Generated!', 
        `Successfully generated ${suggestions.length} deck suggestions.`
      )
    } catch (err) {
      handleApiError(err, 'Failed to Generate Decks')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToGameSelection = () => {
    setSelectedGame(null)
    setDeckSuggestions([])
  }

  const getGameTitle = (game: TCGGame) => {
    switch (game) {
      case 'mtg':
        return 'Magic: The Gathering Deck Generator'
      case 'gundam':
        return 'Gundam TCG Deck Generator'
      default:
        return 'TCG Deck Generator'
    }
  }

  const getGameSubtitle = (game: TCGGame) => {
    switch (game) {
      case 'mtg':
        return 'Generate personalized EDH/Commander deck ideas powered by AI'
      case 'gundam':
        return 'Build competitive Gundam decks with AI-powered suggestions'
      default:
        return 'Generate personalized deck ideas powered by AI'
    }
  }

  if (!selectedGame) {
    return (
      <div className="container">
        <GameSelection onGameSelect={handleGameSelect} />
      </div>
    )
  }

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button className="back-button" onClick={handleBackToGameSelection}>
          ← Back to Game Selection
        </button>
        <h1>{getGameTitle(selectedGame)}</h1>
        <p>{getGameSubtitle(selectedGame)}</p>
      </header>

      <DeckForm game={selectedGame} onSubmit={handleFormSubmit} loading={loading} />
      
      {loading && (
        <div className="loading">
          <p>Generating deck suggestions...</p>
        </div>
      )}
      
      {deckSuggestions.length > 0 && (
        <DeckSuggestions suggestions={deckSuggestions} />
      )}
      
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  )
}

export default App