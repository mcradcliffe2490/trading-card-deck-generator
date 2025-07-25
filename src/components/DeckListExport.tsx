import React, { useState } from 'react'
import { DeckCard } from '../types'

interface DeckListExportProps {
  mainDeck: DeckCard[]
  resourceDeck?: DeckCard[]
  deckName: string
  game: 'mtg' | 'gundam'
}

const DeckListExport: React.FC<DeckListExportProps> = ({ mainDeck, resourceDeck, deckName, game }) => {
  const [copied, setCopied] = useState(false)

  const formatDeckList = () => {
    if (game === 'mtg') {
      // MTG format is simple
      return mainDeck.map(card => `${card.quantity} ${card.name}`).join('\n')
    } else if (game === 'gundam') {
      // Gundam format with card numbers
      const mainDeckList = mainDeck.map(card => 
        `${card.quantity} ${card.cardNumber || 'UNKNOWN'} ${card.name}`
      ).join('\n')
      
      const resourceDeckList = resourceDeck?.map(card => 
        `${card.quantity} ${card.cardNumber || 'UNKNOWN'} ${card.name}`
      ).join('\n') || ''
      
      return `// ${deckName} - Main Deck (${mainDeck.length} cards)\n${mainDeckList}\n\n// Resource Deck (${resourceDeck?.length || 0} cards)\n${resourceDeckList}`
    }
    return ''
  }

  const copyToClipboard = async () => {
    const deckList = formatDeckList()
    try {
      await navigator.clipboard.writeText(deckList)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy deck list:', err)
    }
  }

  const getTotalCards = () => {
    return mainDeck.reduce((sum, card) => sum + card.quantity, 0)
  }

  const getResourceCards = () => {
    return resourceDeck?.reduce((sum, card) => sum + card.quantity, 0) || 0
  }

  return (
    <div className="deck-export">
      <div className="deck-export-header">
        <h4>📋 Deck List Export</h4>
        <p>
          {game === 'mtg' 
            ? `${getTotalCards()} cards total` 
            : `${getTotalCards()} main deck + ${getResourceCards()} resource deck`
          }
        </p>
      </div>
      
      <div className="deck-export-content">
        <pre className="deck-list-text">{formatDeckList()}</pre>
      </div>
      
      <div className="deck-export-actions">
        <button onClick={copyToClipboard} className="copy-button">
          {copied ? '✅ Copied!' : '📋 Copy Deck List'}
        </button>
        <p className="export-note">
          {game === 'mtg' 
            ? 'Copy this list to import into deck builders like Moxfield or EDHRec'
            : 'Copy this list to import into Gundam TCG deck builders'
          }
        </p>
      </div>
    </div>
  )
}

export default DeckListExport