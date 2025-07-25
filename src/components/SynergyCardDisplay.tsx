import React, { useState } from 'react'
import { DeckSynergy, DeckCard } from '../types'

interface SynergyCardDisplayProps {
  synergy: DeckSynergy
  allCards: DeckCard[]
  onCardHover: (card: DeckCard | null, position: { x: number; y: number }) => void
}

const SynergyCardDisplay: React.FC<SynergyCardDisplayProps> = ({ 
  synergy, 
  allCards,
  onCardHover 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const findCardByName = (cardName: string): DeckCard | null => {
    return allCards.find(card => 
      card.name.toLowerCase() === cardName.toLowerCase()
    ) || null
  }

  const handleCardClick = (cardName: string, event: React.MouseEvent) => {
    const card = findCardByName(cardName)
    if (card) {
      onCardHover(card, { x: event.clientX, y: event.clientY })
    }
  }

  const handleCardMouseEnter = (cardName: string, event: React.MouseEvent) => {
    const card = findCardByName(cardName)
    if (card) {
      onCardHover(card, { x: event.clientX, y: event.clientY })
    }
  }

  const handleCardMouseLeave = () => {
    onCardHover(null, { x: 0, y: 0 })
  }

  const renderCardName = (cardName: string, index: number) => (
    <span
      key={index}
      className="synergy-card-name"
      onMouseEnter={(e) => handleCardMouseEnter(cardName, e)}
      onMouseLeave={handleCardMouseLeave}
      onClick={(e) => handleCardClick(cardName, e)}
    >
      {cardName}
    </span>
  )

  const renderCardNames = () => {
    return synergy.cards.map((cardName, index) => (
      <React.Fragment key={cardName}>
        {index > 0 && <span className="synergy-card-separator"> + </span>}
        {renderCardName(cardName, index)}
      </React.Fragment>
    ))
  }

  return (
    <div className="synergy-item-enhanced">
      <div className="synergy-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className={`synergy-type ${synergy.type}`}>{synergy.type}</span>
        <span className="synergy-cards-interactive">
          {renderCardNames()}
        </span>
        <button className="synergy-expand-btn">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>
      
      <p className="synergy-description">{synergy.description}</p>
      
      {isExpanded && (
        <div className="synergy-expanded-content">
          <h5>Cards in this synergy:</h5>
          <div className="synergy-cards-grid">
            {synergy.cards.map((cardName) => {
              const card = findCardByName(cardName)
              return card ? (
                <div 
                  key={cardName}
                  className="synergy-card-item"
                  onMouseEnter={(e) => handleCardMouseEnter(cardName, e)}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <img 
                    src={`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}&format=image&version=small`}
                    alt={cardName}
                    className="synergy-card-thumbnail"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="synergy-card-info">
                    <span className="synergy-card-title">{cardName}</span>
                    <span className="synergy-card-purpose">{card.purpose}</span>
                  </div>
                </div>
              ) : (
                <div key={cardName} className="synergy-card-item synergy-card-missing">
                  <div className="synergy-card-placeholder">?</div>
                  <div className="synergy-card-info">
                    <span className="synergy-card-title">{cardName}</span>
                    <span className="synergy-card-purpose">Card not found in deck</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default SynergyCardDisplay