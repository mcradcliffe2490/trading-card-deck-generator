import React, { useState, useEffect } from 'react'
import { DeckCard } from '../types'

interface CardPreviewProps {
  card: DeckCard | null
  position: { x: number; y: number }
  visible: boolean
}

const CardPreview: React.FC<CardPreviewProps> = ({ card, position, visible }) => {
  const [cardDetails, setCardDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (card && visible) {
      fetchCardDetails(card.name)
    }
  }, [card, visible])

  const fetchCardDetails = async (cardName: string) => {
    setLoading(true)
    try {
      // Try Scryfall API for MTG cards
      const response = await fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`)
      if (response.ok) {
        const data = await response.json()
        setCardDetails(data)
      }
    } catch (error) {
      console.error('Error fetching card details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCardImage = (cardName: string) => {
    const encodedName = encodeURIComponent(cardName)
    return `https://api.scryfall.com/cards/named?exact=${encodedName}&format=image&version=normal`
  }

  if (!card || !visible) return null

  const adjustedPosition = {
    x: position.x + 20, // Offset to avoid cursor overlap
    y: Math.max(10, position.y - 150) // Keep within viewport
  }

  return (
    <div 
      className="card-preview-tooltip"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      <div className="card-preview-content">
        <div className="card-preview-image">
          <img 
            src={getCardImage(card.name)}
            alt={card.name}
            onError={(e) => {
              e.currentTarget.src = '/card-placeholder.png'
            }}
          />
        </div>
        
        <div className="card-preview-details">
          <div className="card-preview-header">
            <h4 className="card-preview-name">{card.name}</h4>
            {card.manaCost && (
              <span className="card-preview-cost">{card.manaCost}</span>
            )}
            {card.cost && (
              <span className="card-preview-cost">Cost: {card.cost}</span>
            )}
          </div>
          
          {loading ? (
            <div className="card-preview-loading">Loading details...</div>
          ) : cardDetails ? (
            <div className="card-preview-info">
              <div className="card-preview-type">
                {cardDetails.type_line}
              </div>
              {cardDetails.oracle_text && (
                <div className="card-preview-text">
                  {cardDetails.oracle_text}
                </div>
              )}
              {cardDetails.power && cardDetails.toughness && (
                <div className="card-preview-stats">
                  {cardDetails.power}/{cardDetails.toughness}
                </div>
              )}
            </div>
          ) : (
            <div className="card-preview-info">
              <div className="card-preview-purpose">
                {card.purpose}
              </div>
              {card.category && (
                <div className="card-preview-category">
                  Type: {card.category}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CardPreview