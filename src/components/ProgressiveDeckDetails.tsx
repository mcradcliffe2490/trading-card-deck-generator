import React, { useState, useEffect } from 'react'
import { DeckSuggestion, DeckCard, DeckSynergy } from '../types'
import DeckListExport from './DeckListExport'
import CardPreview from './CardPreview'
import SynergyCardDisplay from './SynergyCardDisplay'
import { useToast } from '../hooks/useToast'

interface ProgressiveDeckDetailsProps {
  deck: DeckSuggestion
}

interface LoadingState {
  strategy: boolean
  manabase: boolean
  // MTG micro-chunks
  earlyCreatures: boolean
  midCreatures: boolean
  lateCreatures: boolean
  rampDraw: boolean
  removalInteraction: boolean
  winConsArtifacts: boolean
  // Gundam sections (keep for compatibility)
  creatures: boolean
  spells: boolean
  artifacts: boolean
}

interface DeckData {
  strategy?: {
    synergies: DeckSynergy[]
    openingHandPriority: string[]
    winConditions: string[]
    strengths: string[]
    weaknesses: string[]
  }
  manabase?: DeckCard[]
  // MTG micro-chunks
  earlyCreatures?: DeckCard[]
  midCreatures?: DeckCard[]
  lateCreatures?: DeckCard[]
  rampDraw?: DeckCard[]
  removalInteraction?: DeckCard[]
  winConsArtifacts?: DeckCard[]
  // Gundam sections (keep for compatibility)
  creatures?: DeckCard[]
  spells?: DeckCard[]
  artifacts?: DeckCard[]
}

const ProgressiveDeckDetails: React.FC<ProgressiveDeckDetailsProps> = ({ deck }) => {
  const [activeTab, setActiveTab] = useState<'decklist' | 'synergies' | 'strategy' | 'export'>('decklist')
  const [loading, setLoading] = useState<LoadingState>({
    strategy: true,
    manabase: true,
    // MTG micro-chunks
    earlyCreatures: true,
    midCreatures: true,
    lateCreatures: true,
    rampDraw: true,
    removalInteraction: true,
    winConsArtifacts: true,
    // Gundam sections
    creatures: true,
    spells: true,
    artifacts: true
  })
  const [data, setData] = useState<DeckData>({})
  const [previewCard, setPreviewCard] = useState<DeckCard | null>(null)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const [showPreview, setShowPreview] = useState(false)
  const { handleApiError } = useToast()
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    fetchAllData()
  }, [deck.id])

  const fetchAllData = async () => {
    try {
      // Fetch strategy first (fastest)
      fetchStrategy()
      
      // Then fetch deck sections based on game type
      fetchManabase()
      
      if (deck.game === 'mtg') {
        // MTG micro-chunks
        fetchEarlyCreatures()
        fetchMidCreatures()
        fetchLateCreatures()
        fetchRampDraw()
        fetchRemovalInteraction()
        fetchWinConsArtifacts()
      } else {
        // Gundam sections
        fetchCreatures()
        fetchSpells()
        fetchArtifacts()
      }
    } catch (error) {
      console.error('Error fetching deck data:', error)
    }
  }

  const fetchStrategy = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/deck-strategy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckSummary: deck }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error = new Error(errorData.error || 'Failed to fetch strategy') as Error & { status: number }
        error.status = response.status
        throw error
      }
      
      const strategy = await response.json()
      setData(prev => ({ ...prev, strategy }))
    } catch (error) {
      console.error('Strategy fetch error:', error)
      handleApiError(error, 'Failed to Load Strategy')
    } finally {
      setLoading(prev => ({ ...prev, strategy: false }))
    }
  }

  const fetchManabase = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/deck-manabase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckSummary: deck }),
      })
      
      if (response.ok) {
        const manabase = await response.json()
        setData(prev => ({ ...prev, manabase }))
      }
    } catch (error) {
      console.error('Manabase fetch error:', error)
    } finally {
      setLoading(prev => ({ ...prev, manabase: false }))
    }
  }

  const fetchCreatures = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/deck-spells/creatures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckSummary: deck }),
      })
      
      if (response.ok) {
        const creatures = await response.json()
        setData(prev => ({ ...prev, creatures }))
      }
    } catch (error) {
      console.error('Creatures fetch error:', error)
    } finally {
      setLoading(prev => ({ ...prev, creatures: false }))
    }
  }

  const fetchSpells = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/deck-spells/instants-sorceries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckSummary: deck }),
      })
      
      if (response.ok) {
        const spells = await response.json()
        setData(prev => ({ ...prev, spells }))
      }
    } catch (error) {
      console.error('Spells fetch error:', error)
    } finally {
      setLoading(prev => ({ ...prev, spells: false }))
    }
  }

  const fetchArtifacts = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/deck-spells/artifacts-enchantments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckSummary: deck }),
      })
      
      if (response.ok) {
        const artifacts = await response.json()
        setData(prev => ({ ...prev, artifacts }))
      }
    } catch (error) {
      console.error('Artifacts fetch error:', error)
    } finally {
      setLoading(prev => ({ ...prev, artifacts: false }))
    }
  }

  // MTG micro-chunk fetch functions
  const fetchEarlyCreatures = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/deck-spells/early-creatures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckSummary: deck }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error = new Error(errorData.error || 'Failed to generate early creatures') as Error & { status: number }
        error.status = response.status
        throw error
      }
      
      const earlyCreatures = await response.json()
      setData(prev => ({ ...prev, earlyCreatures }))
    } catch (error) {
      console.error('Early creatures fetch error:', error)
      handleApiError(error, 'Failed to Generate Early Creatures')
    } finally {
      setLoading(prev => ({ ...prev, earlyCreatures: false }))
    }
  }

  const fetchMidCreatures = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/deck-spells/mid-creatures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckSummary: deck }),
      })
      
      if (response.ok) {
        const midCreatures = await response.json()
        setData(prev => ({ ...prev, midCreatures }))
      }
    } catch (error) {
      console.error('Mid creatures fetch error:', error)
    } finally {
      setLoading(prev => ({ ...prev, midCreatures: false }))
    }
  }

  const fetchLateCreatures = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/deck-spells/late-creatures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckSummary: deck }),
      })
      
      if (response.ok) {
        const lateCreatures = await response.json()
        setData(prev => ({ ...prev, lateCreatures }))
      }
    } catch (error) {
      console.error('Late creatures fetch error:', error)
    } finally {
      setLoading(prev => ({ ...prev, lateCreatures: false }))
    }
  }

  const fetchRampDraw = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/deck-spells/ramp-draw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckSummary: deck }),
      })
      
      if (response.ok) {
        const rampDraw = await response.json()
        setData(prev => ({ ...prev, rampDraw }))
      }
    } catch (error) {
      console.error('Ramp/draw fetch error:', error)
    } finally {
      setLoading(prev => ({ ...prev, rampDraw: false }))
    }
  }

  const fetchRemovalInteraction = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/deck-spells/removal-interaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckSummary: deck }),
      })
      
      if (response.ok) {
        const removalInteraction = await response.json()
        setData(prev => ({ ...prev, removalInteraction }))
      }
    } catch (error) {
      console.error('Removal/interaction fetch error:', error)
    } finally {
      setLoading(prev => ({ ...prev, removalInteraction: false }))
    }
  }

  const fetchWinConsArtifacts = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/deck-spells/win-cons-artifacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckSummary: deck }),
      })
      
      if (response.ok) {
        const winConsArtifacts = await response.json()
        setData(prev => ({ ...prev, winConsArtifacts }))
      }
    } catch (error) {
      console.error('Win conditions/artifacts fetch error:', error)
    } finally {
      setLoading(prev => ({ ...prev, winConsArtifacts: false }))
    }
  }


  const getTotalCards = () => {
    let total = 0
    if (data.manabase) total += data.manabase.reduce((sum, card) => sum + card.quantity, 0)
    
    if (deck.game === 'mtg') {
      // MTG micro-chunks
      if (data.earlyCreatures) total += data.earlyCreatures.reduce((sum, card) => sum + card.quantity, 0)
      if (data.midCreatures) total += data.midCreatures.reduce((sum, card) => sum + card.quantity, 0)
      if (data.lateCreatures) total += data.lateCreatures.reduce((sum, card) => sum + card.quantity, 0)
      if (data.rampDraw) total += data.rampDraw.reduce((sum, card) => sum + card.quantity, 0)
      if (data.removalInteraction) total += data.removalInteraction.reduce((sum, card) => sum + card.quantity, 0)
      if (data.winConsArtifacts) total += data.winConsArtifacts.reduce((sum, card) => sum + card.quantity, 0)
    } else {
      // Gundam sections
      if (data.creatures) total += data.creatures.reduce((sum, card) => sum + card.quantity, 0)
      if (data.spells) total += data.spells.reduce((sum, card) => sum + card.quantity, 0)
      if (data.artifacts) total += data.artifacts.reduce((sum, card) => sum + card.quantity, 0)
    }
    
    return total
  }


  const getExpectedTotalCards = () => {
    if (deck.game === 'gundam') {
      return 50 // 25 units + 12 commands + 13 pilots/bases = 50
    } else {
      return 99 // MTG Commander deck
    }
  }

  const handleCardHover = (card: DeckCard | null, position: { x: number; y: number }) => {
    setPreviewCard(card)
    setPreviewPosition(position)
    setShowPreview(!!card)
  }

  const getAllCards = (): DeckCard[] => {
    const allCards: DeckCard[] = []
    
    if (data.manabase) allCards.push(...data.manabase)
    
    if (deck.game === 'mtg') {
      if (data.earlyCreatures) allCards.push(...data.earlyCreatures)
      if (data.midCreatures) allCards.push(...data.midCreatures)
      if (data.lateCreatures) allCards.push(...data.lateCreatures)
      if (data.rampDraw) allCards.push(...data.rampDraw)
      if (data.removalInteraction) allCards.push(...data.removalInteraction)
      if (data.winConsArtifacts) allCards.push(...data.winConsArtifacts)
    } else {
      if (data.creatures) allCards.push(...data.creatures)
      if (data.spells) allCards.push(...data.spells)
      if (data.artifacts) allCards.push(...data.artifacts)
    }

    return allCards
  }

  const getCardImage = (cardName: string) => {
    const encodedName = encodeURIComponent(cardName)
    return `https://api.scryfall.com/cards/named?exact=${encodedName}&format=image&version=normal`
  }

  const renderCardSection = (title: string, cards: DeckCard[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="category-section">
          <h4>{title} (Loading...)</h4>
          <div className="loading-section">
            <p>Generating {title.toLowerCase()}...</p>
          </div>
        </div>
      )
    }

    if (!cards || cards.length === 0) {
      return (
        <div className="category-section">
          <h4>{title} (0)</h4>
          <p>No cards generated</p>
        </div>
      )
    }

    const totalQuantity = cards.reduce((sum, card) => sum + card.quantity, 0)
    const sectionTitle = deck.game === 'gundam' 
      ? `${title} (${totalQuantity} cards, ${cards.length} unique)`
      : `${title} (${cards.length})`

    return (
      <div className="category-section">
        <h4>{sectionTitle}</h4>
        <div className="cards-grid">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="card-item card-hoverable"
              onMouseEnter={(e) => handleCardHover(card, { x: e.clientX, y: e.clientY })}
              onMouseLeave={() => handleCardHover(null, { x: 0, y: 0 })}
              onMouseMove={(e) => {
                if (showPreview) {
                  setPreviewPosition({ x: e.clientX, y: e.clientY })
                }
              }}
            >
              <img 
                src={getCardImage(card.name)}
                alt={card.name}
                className="card-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="card-info">
                <span className="card-name">
                  {deck.game === 'gundam' && card.quantity > 1 ? `${card.quantity}x ` : ''}
                  {card.name}
                </span>
                <span className="card-cost">{card.manaCost}</span>
                <span className="card-purpose">{card.purpose}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="deck-details">
      <div className="deck-details-tabs">
        <button 
          className={`tab-button ${activeTab === 'decklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('decklist')}
        >
          Full Deck List ({getTotalCards()}/{getExpectedTotalCards()})
        </button>
        <button 
          className={`tab-button ${activeTab === 'synergies' ? 'active' : ''}`}
          onClick={() => setActiveTab('synergies')}
          disabled={loading.strategy}
        >
          Synergies & Combos {loading.strategy && '(Loading...)'}
        </button>
        <button 
          className={`tab-button ${activeTab === 'strategy' ? 'active' : ''}`}
          onClick={() => setActiveTab('strategy')}
          disabled={loading.strategy}
        >
          Strategy Guide {loading.strategy && '(Loading...)'}
        </button>
        <button 
          className={`tab-button ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          Export Deck
        </button>
      </div>

      <div className="deck-details-content">
        {activeTab === 'decklist' && (
          <div className="decklist-view">
            {deck.game === 'mtg' && (
              <div className="commander-section">
                <h4>Commander</h4>
                <div 
                  className="card-item commander-card card-hoverable"
                  onMouseEnter={(e) => handleCardHover(
                    { name: deck.commander!, quantity: 1, category: 'commander', purpose: 'Deck commander' }, 
                    { x: e.clientX, y: e.clientY }
                  )}
                  onMouseLeave={() => handleCardHover(null, { x: 0, y: 0 })}
                  onMouseMove={(e) => {
                    if (showPreview) {
                      setPreviewPosition({ x: e.clientX, y: e.clientY })
                    }
                  }}
                >
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
            )}

            {deck.game === 'gundam' && (
              <div className="commander-section">
                <h4>Pilot</h4>
                <div className="card-item commander-card">
                  <div className="card-placeholder">🤖</div>
                  <div className="card-info">
                    <span className="card-name">{deck.pilot}</span>
                  </div>
                </div>
              </div>
            )}

            {deck.game === 'mtg' && (
              <>
                {renderCardSection('Lands', data.manabase, loading.manabase)}
                {renderCardSection('Early Game Creatures', data.earlyCreatures, loading.earlyCreatures)}
                {renderCardSection('Mid Game Creatures', data.midCreatures, loading.midCreatures)}
                {renderCardSection('Late Game Creatures', data.lateCreatures, loading.lateCreatures)}
                {renderCardSection('Ramp & Card Draw', data.rampDraw, loading.rampDraw)}
                {renderCardSection('Removal & Interaction', data.removalInteraction, loading.removalInteraction)}
                {renderCardSection('Win Conditions & Artifacts', data.winConsArtifacts, loading.winConsArtifacts)}
              </>
            )}

            {deck.game === 'gundam' && (
              <>
                {renderCardSection('Resource Deck', data.manabase, loading.manabase)}
                {renderCardSection('Units', data.creatures, loading.creatures)}
                {renderCardSection('Commands', data.spells, loading.spells)}
                {renderCardSection('Pilots & Bases', data.artifacts, loading.artifacts)}
              </>
            )}
          </div>
        )}

        {activeTab === 'synergies' && (
          <div className="synergies-view">
            {loading.strategy ? (
              <div className="loading-section">
                <p>Loading synergies and combos...</p>
              </div>
            ) : data.strategy?.synergies ? (
              <>
                <h4>Key Synergies</h4>
                {data.strategy.synergies.map((synergy, index) => (
                  <SynergyCardDisplay
                    key={index}
                    synergy={synergy}
                    allCards={getAllCards()}
                    onCardHover={handleCardHover}
                  />
                ))}
              </>
            ) : (
              <p>No synergies available</p>
            )}
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="strategy-view">
            {loading.strategy ? (
              <div className="loading-section">
                <p>Loading strategy guide...</p>
              </div>
            ) : data.strategy ? (
              <>
                <div className="strategy-section">
                  <h4>Win Conditions</h4>
                  <ul>
                    {data.strategy.winConditions?.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                </div>

                <div className="strategy-section">
                  <h4>Opening Hand Priority</h4>
                  <div className="priority-cards">
                    {data.strategy.openingHandPriority?.map((card, index) => (
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
                    {data.strategy.strengths?.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="strategy-section">
                  <h4>Weaknesses</h4>
                  <ul className="weaknesses-list">
                    {data.strategy.weaknesses?.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <p>No strategy information available</p>
            )}
          </div>
        )}

        {activeTab === 'export' && (
          <div className="export-view">
            <DeckListExport
              mainDeck={deck.game === 'mtg' ? [
                ...(data.manabase || []),
                ...(data.earlyCreatures || []),
                ...(data.midCreatures || []),
                ...(data.lateCreatures || []),
                ...(data.rampDraw || []),
                ...(data.removalInteraction || []),
                ...(data.winConsArtifacts || [])
              ] : [
                ...(data.creatures || []),
                ...(data.spells || []),
                ...(data.artifacts || [])
              ]}
              resourceDeck={deck.game === 'gundam' ? data.manabase : undefined}
              deckName={deck.name}
              game={deck.game}
            />
          </div>
        )}
      </div>
      
      <CardPreview 
        card={previewCard}
        position={previewPosition}
        visible={showPreview}
      />
    </div>
  )
}

export default ProgressiveDeckDetails