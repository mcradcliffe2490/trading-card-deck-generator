import React, { useState } from 'react'
import { DeckSuggestion, DeckCard } from '../types'

interface DeckDetailsProps {
  deck: DeckSuggestion
}

const DeckDetails: React.FC<DeckDetailsProps> = ({ deck }) => {
  const [activeTab, setActiveTab] = useState<'decklist' | 'synergies' | 'strategy'>('decklist')

  const groupCardsByCategory = (cards: DeckCard[]) => {
    const grouped: { [key: string]: DeckCard[] } = {}
    cards.forEach(card => {
      if (!grouped[card.category]) {
        grouped[card.category] = []
      }
      grouped[card.category].push(card)
    })
    return grouped
  }

  const getCategoryOrder = () => {
    return ['creature', 'instant', 'sorcery', 'artifact', 'enchantment', 'planeswalker', 'land']
  }

  const groupedCards = deck.fullDeckList ? groupCardsByCategory(deck.fullDeckList) : {}

  const getCardImage = (cardName: string) => {
    const encodedName = encodeURIComponent(cardName)
    return `https://api.scryfall.com/cards/named?exact=${encodedName}&format=image&version=normal`
  }

  return (
    <div className="deck-details">
      <div className="deck-details-tabs">
        <button 
          className={`tab-button ${activeTab === 'decklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('decklist')}
        >
          Full Deck List ({deck.fullDeckList?.length || 0}/99)
        </button>
        <button 
          className={`tab-button ${activeTab === 'synergies' ? 'active' : ''}`}
          onClick={() => setActiveTab('synergies')}
        >
          Synergies & Combos
        </button>
        <button 
          className={`tab-button ${activeTab === 'strategy' ? 'active' : ''}`}
          onClick={() => setActiveTab('strategy')}
        >
          Strategy Guide
        </button>
      </div>

      <div className="deck-details-content">
        {activeTab === 'decklist' && (
          <div className="decklist-view">
            <div className="commander-section">
              <h4>Commander</h4>
              <div className="card-item commander-card">
                <img 
                  src={getCardImage(deck.commander!)}
                  alt={deck.commander}
                  className="card-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div className="card-info">
                  <span className="card-name">{deck.commander}</span>
                </div>
              </div>
            </div>

            {getCategoryOrder().map(category => {
              const cards = groupedCards[category] || []
              if (cards.length === 0) return null
              
              return (
                <div key={category} className="category-section">
                  <h4>{category.charAt(0).toUpperCase() + category.slice(1)}s ({cards.length})</h4>
                  <div className="cards-grid">
                    {cards.map((card, index) => (
                      <div key={index} className="card-item">
                        <img 
                          src={getCardImage(card.name)}
                          alt={card.name}
                          className="card-image"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                        <div className="card-info">
                          <span className="card-name">{card.name}</span>
                          <span className="card-cost">{card.manaCost}</span>
                          <span className="card-purpose">{card.purpose}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'synergies' && (
          <div className="synergies-view">
            <h4>Key Synergies</h4>
            {deck.synergies?.map((synergy, index) => (
              <div key={index} className="synergy-item">
                <div className="synergy-header">
                  <span className={`synergy-type ${synergy.type}`}>{synergy.type}</span>
                  <span className="synergy-cards">{synergy.cards.join(' + ')}</span>
                </div>
                <p className="synergy-description">{synergy.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="strategy-view">
            <div className="strategy-section">
              <h4>Win Conditions</h4>
              <ul>
                {deck.winConditions?.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>

            <div className="strategy-section">
              <h4>Opening Hand Priority</h4>
              <div className="priority-cards">
                {deck.openingHandPriority?.map((card, index) => (
                  <div key={index} className="priority-card">
                    <img 
                      src={getCardImage(card)}
                      alt={card}
                      className="card-image-small"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <span>{card}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="strategy-section">
              <h4>Strengths</h4>
              <ul className="strengths-list">
                {deck.strengths?.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="strategy-section">
              <h4>Weaknesses</h4>
              <ul className="weaknesses-list">
                {deck.weaknesses?.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeckDetails