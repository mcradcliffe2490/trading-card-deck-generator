import React from 'react'
import { DeckSuggestion } from '../types'
import ProgressiveDeckCard from './ProgressiveDeckCard'

interface DeckSuggestionsProps {
  suggestions: DeckSuggestion[]
}

const DeckSuggestions: React.FC<DeckSuggestionsProps> = ({ suggestions }) => {
  return (
    <div>
      <h2>Deck Suggestions</h2>
      <div className="deck-suggestions">
        {suggestions.map((deck) => (
          <ProgressiveDeckCard key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  )
}

export default DeckSuggestions