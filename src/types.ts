export type TCGGame = 'mtg' | 'gundam'

export interface DeckFormData {
  game: TCGGame
  playstyle: string
  playType: 'friends' | 'competitive' | 'both'
  commander?: string // MTG specific
  pilot?: string // Gundam specific
  budget: 'budget' | 'mid' | 'high' | 'no-limit'
  level: 'casual' | 'focused' | 'optimized' | 'competitive'
}

export interface DeckCard {
  name: string
  quantity: number
  category: 'commander' | 'creature' | 'instant' | 'sorcery' | 'artifact' | 'enchantment' | 'planeswalker' | 'land' | 'unit' | 'pilot' | 'command' | 'base' | 'resource'
  manaCost?: string // MTG specific
  cmc?: number // MTG specific
  cost?: number // Gundam specific - Resource cost
  level?: number // Gundam specific - Level requirement
  ap?: number // Gundam specific - Attack Power
  hp?: number // Gundam specific - Hit Points
  cardNumber?: string // Gundam specific - Card ID (e.g., "GD01-001")
  purpose: string
}

export interface DeckSynergy {
  cards: string[]
  description: string
  type: 'combo' | 'engine' | 'value' | 'protection'
}

export interface DeckSuggestion {
  id: string
  game: TCGGame
  name: string
  commander?: string // MTG specific
  pilot?: string // Gundam specific
  description: string
  strategy: string
  estimatedCost: number
  keyCards: string[]
  colors?: string[] // MTG specific
  forces?: string[] // Gundam specific (Earth Federation, Zeon, etc.)
  powerLevel: number
  fullDeckList?: DeckCard[]
  resourceDeck?: DeckCard[] // Gundam specific - 10 card resource deck
  synergies?: DeckSynergy[]
  openingHandPriority?: string[]
  winConditions?: string[]
  strengths?: string[]
  weaknesses?: string[]
}

export interface DeckDetails {
  fullDeckList: DeckCard[]
  resourceDeck?: DeckCard[] // Gundam specific
  synergies: DeckSynergy[]
  openingHandPriority: string[]
  winConditions: string[]
  strengths: string[]
  weaknesses: string[]
}