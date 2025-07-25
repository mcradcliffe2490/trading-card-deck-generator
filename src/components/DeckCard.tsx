import React, { useState } from 'react'
import { DeckSuggestion, DeckDetails as DeckDetailsType } from '../types'
import DeckDetails from './DeckDetails'

interface DeckCardProps {
  deck: DeckSuggestion
}

const DeckCard: React.FC<DeckCardProps> = ({ deck }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [deckDetails, setDeckDetails] = useState<DeckDetailsType | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(cost)
  }

  const handleCardClick = async () => {
    if (!isExpanded) {
      // Expanding - fetch details if we don't have them
      setIsExpanded(true)
      
      if (!deckDetails && !loadingDetails) {
        await fetchDeckDetails()
      }
    } else {
      // Collapsing
      setIsExpanded(false)
    }
  }

  const fetchDeckDetails = async () => {
    setLoadingDetails(true)
    setDetailsError(null)
    
    try {
      // Start all requests in parallel for faster loading
      const [strategyRes, manabaseRes, creaturesRes, spellsRes, artifactsRes] = await Promise.all([
        fetch('/api/deck-strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckSummary: deck }),
        }),
        fetch('/api/deck-manabase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckSummary: deck }),
        }),
        fetch('/api/deck-spells/creatures', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckSummary: deck }),
        }),
        fetch('/api/deck-spells/instants-sorceries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckSummary: deck }),
        }),
        fetch('/api/deck-spells/artifacts-enchantments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deckSummary: deck }),
        })
      ])

      // Check if all responses are ok
      if (!strategyRes.ok || !manabaseRes.ok || !creaturesRes.ok || !spellsRes.ok || !artifactsRes.ok) {
        throw new Error('Failed to fetch deck details')
      }

      // Parse all responses
      const [strategy, manabase, creatures, spells, artifacts] = await Promise.all([
        strategyRes.json(),
        manabaseRes.json(),
        creaturesRes.json(),
        spellsRes.json(),
        artifactsRes.json()
      ])

      // Combine all cards into fullDeckList
      const fullDeckList = [...manabase, ...creatures, ...spells, ...artifacts]
      
      console.log(`✅ Generated complete deck with ${fullDeckList.length} cards`)

      const details = {
        fullDeckList,
        synergies: strategy.synergies,
        openingHandPriority: strategy.openingHandPriority,
        winConditions: strategy.winConditions,
        strengths: strategy.strengths,
        weaknesses: strategy.weaknesses,
      }

      setDeckDetails(details)
    } catch (error) {
      console.error('Error fetching deck details:', error)
      setDetailsError(error instanceof Error ? error.message : 'Failed to load deck details')
    } finally {
      setLoadingDetails(false)
    }
  }

  // Create a combined deck object for the DeckDetails component
  const combinedDeck = deckDetails ? {
    ...deck,
    fullDeckList: deckDetails.fullDeckList,
    synergies: deckDetails.synergies,
    openingHandPriority: deckDetails.openingHandPriority,
    winConditions: deckDetails.winConditions,
    strengths: deckDetails.strengths,
    weaknesses: deckDetails.weaknesses,
  } : deck

  return (
    <div className={`deck-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="deck-card-summary" onClick={handleCardClick}>
        <h3>{deck.name}</h3>
        <p><strong>Commander:</strong> {deck.commander}</p>
        <p><strong>Colors:</strong> {deck.colors?.join(', ') || 'Not specified'}</p>
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
        <div className="deck-details">
          {loadingDetails && (
            <div className="deck-details-loading">
              <p>Loading detailed deck information...</p>
            </div>
          )}
          
          {detailsError && (
            <div className="deck-details-error">
              <p>Error loading deck details: {detailsError}</p>
              <button onClick={fetchDeckDetails} className="retry-button">
                Try Again
              </button>
            </div>
          )}
          
          {deckDetails && !loadingDetails && (
            <DeckDetails deck={combinedDeck} />
          )}
        </div>
      )}
    </div>
  )
}

export default DeckCard