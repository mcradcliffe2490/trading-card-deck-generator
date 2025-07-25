import React, { useState } from 'react'
import { DeckSuggestion } from '../types'
import ProgressiveDeckDetails from './ProgressiveDeckDetails'

interface ProgressiveDeckCardProps {
  deck: DeckSuggestion
}

const ProgressiveDeckCard: React.FC<ProgressiveDeckCardProps> = ({ deck }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(cost)
  }

  const handleCardClick = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`deck-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="deck-card-summary" onClick={handleCardClick}>
        <h3>{deck.name}</h3>
        {deck.game === 'mtg' && (
          <>
            <p><strong>Commander:</strong> {deck.commander}</p>
            <p><strong>Colors:</strong> {deck.colors?.join(', ')}</p>
          </>
        )}
        {deck.game === 'gundam' && (
          <>
            <p><strong>Pilot:</strong> {deck.pilot}</p>
            <p><strong>Forces:</strong> {deck.forces?.join(', ')}</p>
          </>
        )}
        <p><strong>Power Level:</strong> {deck.powerLevel}/10</p>
        <p><strong>Estimated Cost:</strong> {formatCost(deck.estimatedCost)}</p>
        <p><strong>Strategy:</strong> {deck.strategy}</p>
        <p style={{ marginTop: '10px' }}>{deck.description}</p>
        
        {deck.keyCards && deck.keyCards.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <strong>Key Cards:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
              {deck.keyCards.slice(0, 5).map((card, index) => (
                <li key={index}>{card}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="expand-indicator">
          {isExpanded ? '▼ Click to collapse' : '▶ Click for full deck details'}
        </div>
      </div>
      
      {isExpanded && (
        <ProgressiveDeckDetails deck={deck} />
      )}
    </div>
  )
}

export default ProgressiveDeckCard