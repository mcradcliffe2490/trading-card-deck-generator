const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const Anthropic = require('@anthropic-ai/sdk')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const generateDeckPrompt = (formData) => {
  const game = formData.game || 'mtg'
  
  if (game === 'mtg') {
    return `You are an expert Magic: The Gathering deck builder. Based on the following user preferences, generate exactly 3 different EDH/Commander deck suggestions in valid JSON format.

User Preferences:
- Playstyle: ${formData.playstyle || 'Open to suggestions'}
- Play Type: ${formData.playType}
- Commander: ${formData.commander || 'Open to suggestions'}
- Budget: ${formData.budget}
- Power Level: ${formData.level}

Please respond with a JSON array containing exactly 3 deck objects, each with this structure:
{
  "id": "unique-id",
  "game": "mtg",
  "name": "Deck Name",
  "commander": "Commander Name",
  "description": "Brief description of the deck's playstyle and strategy",
  "strategy": "Main strategy summary",
  "estimatedCost": 150,
  "keyCards": ["Card 1", "Card 2", "Card 3", "Card 4", "Card 5"],
  "colors": ["White", "Blue", "Black", "Red", "Green"],
  "powerLevel": 6
}

Budget guidelines:
- Budget ($0-50): Focus on budget-friendly options
- Mid-range ($50-200): Include some powerful cards but avoid expensive staples
- High ($200-500): Include strong staples and powerful cards
- No limit ($500+): Include any cards needed for optimal performance

Power Level guidelines:
- Casual (1-4): Fun, thematic decks with basic synergies
- Focused (5-6): Coherent strategy with good synergies
- Optimized (7-8): Efficient decks with strong synergies and good card quality
- Competitive (9-10): Tournament-level decks with optimal card choices

Make sure each deck suggestion is different and offers variety in commanders, strategies, and colors. Only return the JSON array, no additional text.`
  } else if (game === 'gundam') {
    return `You are an expert Gundam TCG deck builder. Based on the following user preferences, generate exactly 3 different Gundam deck suggestions in valid JSON format.

User Preferences:
- Playstyle: ${formData.playstyle || 'Open to suggestions'}
- Play Type: ${formData.playType}
- Pilot: ${formData.pilot || 'Open to suggestions'}
- Budget: ${formData.budget}
- Power Level: ${formData.level}

Please respond with a JSON array containing exactly 3 deck objects, each with this structure:
{
  "id": "unique-id",
  "game": "gundam",
  "name": "Deck Name",
  "pilot": "Pilot Name",
  "description": "Brief description of the deck's playstyle and strategy",
  "strategy": "Main strategy summary",
  "estimatedCost": 150,
  "keyCards": ["Card 1", "Card 2", "Card 3", "Card 4", "Card 5"],
  "forces": ["Earth Federation", "Zeon", "AEUG"],
  "powerLevel": 6
}

Budget guidelines:
- Budget ($0-50): Focus on budget-friendly options
- Mid-range ($50-200): Include some powerful cards but avoid expensive staples
- High ($200-500): Include strong staples and powerful cards
- No limit ($500+): Include any cards needed for optimal performance

Power Level guidelines:
- Casual: Fun, thematic decks with basic synergies
- Focused: Coherent strategy with good synergies
- Optimized: Tournament-viable decks with strong card choices
- Competitive: Meta-focused decks with optimal performance

Make sure each deck suggestion is different and offers variety in pilots, strategies, and forces. Only return the JSON array, no additional text.`
  }
  
  return 'Invalid game type'
}

app.post('/api/generate-decks', async (req, res) => {
  try {
    const { playstyle, playType, commander, budget, level } = req.body

    if (!playType || !budget || !level) {
      return res.status(400).json({ error: 'Missing required form data' })
    }

    const prompt = generateDeckPrompt(req.body)
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const responseText = response.content[0].text
    
    let deckSuggestions
    try {
      deckSuggestions = JSON.parse(responseText)
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Response text:', responseText)
      return res.status(500).json({ error: 'Failed to parse deck suggestions' })
    }

    if (!Array.isArray(deckSuggestions) || deckSuggestions.length !== 3) {
      return res.status(500).json({ error: 'Invalid deck suggestions format' })
    }

    res.json(deckSuggestions)
  } catch (error) {
    console.error('Error generating deck suggestions:', error)
    console.error('Error details:', error.message)
    
    // Check for specific Anthropic API errors
    let errorMessage = 'Failed to generate deck suggestions'
    let statusCode = 500
    
    if (error.response) {
      console.error('API Response:', error.response.data)
      
      // Check for credit/quota issues
      if (error.response.status === 429 || 
          error.response.data?.error?.message?.includes('credit') ||
          error.response.data?.error?.message?.includes('quota') ||
          error.response.data?.error?.message?.includes('limit')) {
        errorMessage = 'API credits exhausted. Please check your Anthropic account and add more credits.'
        statusCode = 429
      } else if (error.response.status === 401) {
        errorMessage = 'Invalid API key. Please check your configuration.'
        statusCode = 401
      } else if (error.response.data?.error?.message) {
        errorMessage = error.response.data.error.message
        statusCode = error.response.status
      }
    } else if (error.message?.includes('credit') || error.message?.includes('quota')) {
      errorMessage = 'API credits exhausted. Please check your Anthropic account and add more credits.'
      statusCode = 429
    }
    
    res.status(statusCode).json({ error: errorMessage, details: error.message })
  }
})

// Generate deck strategy and metadata
const generateStrategyPrompt = (deckSummary) => {
  const game = deckSummary.game || 'mtg'
  
  if (game === 'mtg') {
    return `Based on this Magic: The Gathering deck summary, generate strategy information in JSON format.

Deck Summary:
- Name: ${deckSummary.name}
- Commander: ${deckSummary.commander}
- Strategy: ${deckSummary.strategy}
- Colors: ${deckSummary.colors?.join(', ')}
- Power Level: ${deckSummary.powerLevel}

Return JSON object:
{
  "synergies": [
    {
      "cards": ["Card A", "Card B"],
      "description": "How these cards work together",
      "type": "engine"
    }
  ],
  "openingHandPriority": ["Card 1", "Card 2", "Card 3"],
  "winConditions": ["Primary win condition", "Secondary win condition"],
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"]
}

Include 3-5 synergies (types: combo, engine, value, protection), 3-5 opening hand cards, 2-3 win conditions, 2-3 strengths/weaknesses. Only return JSON.`
  } else if (game === 'gundam') {
    return `Based on this Gundam TCG deck summary, generate strategy information in JSON format.

Deck Summary:
- Name: ${deckSummary.name}
- Pilot: ${deckSummary.pilot}
- Strategy: ${deckSummary.strategy}
- Forces: ${deckSummary.forces?.join(', ')}
- Power Level: ${deckSummary.powerLevel}

Return JSON object:
{
  "synergies": [
    {
      "cards": ["Card A", "Card B"],
      "description": "How these cards work together",
      "type": "engine"
    }
  ],
  "openingHandPriority": ["Card 1", "Card 2", "Card 3"],
  "winConditions": ["Primary win condition", "Secondary win condition"],
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"]
}

Include 3-5 synergies (types: combo, engine, value, protection), 3-5 opening hand cards, 2-3 win conditions, 2-3 strengths/weaknesses. Only return JSON.`
  }
}

// Generate manabase (lands for MTG, or Resource Deck for Gundam)
const generateManabasePrompt = (deckSummary) => {
  const game = deckSummary.game || 'mtg'
  
  if (game === 'mtg') {
    return `Generate a 37-card manabase for this Magic deck in JSON format.

Deck: ${deckSummary.name} (${deckSummary.commander})
Colors: ${deckSummary.colors?.join(', ')}
Budget: $${deckSummary.estimatedCost}

Return JSON array with exactly 37 land cards:
[
  {"name": "Command Tower", "quantity": 1, "category": "land", "manaCost": "", "cmc": 0, "purpose": "Mana fixing"},
  {"name": "Forest", "quantity": 15, "category": "land", "manaCost": "", "cmc": 0, "purpose": "Basic land"}
]

Include: Command Tower, appropriate dual lands, basics (adjust for colors), utility lands. Total must be exactly 37 cards. Only return JSON array.`
  } else if (game === 'gundam') {
    return `Generate a 10-card Resource Deck for this Gundam TCG deck in JSON format.

Deck: ${deckSummary.name} (${deckSummary.pilot})
Forces: ${deckSummary.forces?.join(', ')}

Return JSON array with exactly 10 resource cards:
[
  {"name": "EX Base", "quantity": 1, "category": "resource", "cardNumber": "EXB-001", "purpose": "Starting Base"},
  {"name": "EX Resource", "quantity": 5, "category": "resource", "cardNumber": "EXR-001", "purpose": "Extra Resources"},
  {"name": "Resource", "quantity": 4, "category": "resource", "cardNumber": "R-001", "purpose": "Basic Resources"}
]

Include: 1 EX Base, 5 EX Resources, 4 basic Resources. Total must be exactly 10 cards. Only return JSON array.`
  }
}

// Generate nonland spells
const generateSpellsPrompt = (deckSummary, section) => {
  const game = deckSummary.game || 'mtg'
  
  if (game === 'mtg') {
    const sectionMap = {
      'early-creatures': 'early game creatures (8-10 cards, CMC 1-4)',
      'mid-creatures': 'mid game creatures (8-10 cards, CMC 4-6)', 
      'late-creatures': 'late game creatures and threats (6-8 cards, CMC 6+)',
      'ramp-draw': 'ramp and card draw spells (8-10 cards)',
      'removal-interaction': 'removal and interaction spells (8-10 cards)',
      'win-cons-artifacts': 'win conditions, artifacts, and planeswalkers (8-10 cards)'
    }
    
    const sectionGuidance = {
      'early-creatures': 'Focus on utility creatures, mana dorks, early threats, and creatures that enable your strategy. Include 1-2 mana creatures and efficient 3-4 mana creatures.',
      'mid-creatures': 'Include powerful 4-6 mana creatures that advance your strategy. These should be your deck\'s workhorses and key synergy pieces.',
      'late-creatures': 'Big threats, game-ending creatures, and powerful late-game options. These should be your major win conditions.',
      'ramp-draw': 'Mana acceleration (ramp) and card advantage engines. Essential for consistency and keeping up in multiplayer.',
      'removal-interaction': 'Targeted removal, board wipes, counterspells, and other interactive spells to deal with threats.',
      'win-cons-artifacts': 'Artifacts that support your strategy, planeswalkers, and alternative win conditions beyond creatures.'
    }
    
    return `Generate ${sectionMap[section]} for this Magic deck in JSON format.

Deck: ${deckSummary.name} (${deckSummary.commander})
Strategy: ${deckSummary.strategy}
Colors: ${deckSummary.colors?.join(', ')}
Power Level: ${deckSummary.powerLevel}

Focus: ${sectionGuidance[section]}

Return JSON array:
[
  {"name": "Card Name", "quantity": 1, "category": "creature", "manaCost": "2G", "cmc": 3, "purpose": "Card purpose"}
]

Use real MTG card names that fit the strategy and colors. Only return JSON array.`
  } else if (game === 'gundam') {
    const sectionMap = {
      'creatures': 'Units (20-25 cards)',
      'instants-sorceries': 'Commands (8-12 cards)', 
      'artifacts-enchantments': 'Pilots and Bases (15-20 cards)'
    }
    
    if (section === 'creatures') {
      return `Generate Unit cards totaling exactly 25 cards for this Gundam TCG deck using real cards and proper quantities (1-4 copies each).

Deck: ${deckSummary.name} (${deckSummary.pilot})
Strategy: ${deckSummary.strategy}
Forces: ${deckSummary.forces?.join(', ')}
Power Level: ${deckSummary.powerLevel}

CRITICAL RULE: You can include 1-4 copies of any card. Think about card value:
- Core strategy cards: 4 copies for consistency
- Good support cards: 2-3 copies  
- Situational cards: 1-2 copies
- Tech/one-off effects: 1 copy

Return JSON array totaling exactly 25 cards:
[
  {"name": "Gundam", "quantity": 4, "category": "unit", "cardNumber": "GD01-013", "cost": 3, "level": 4, "purpose": "Core attacker - 4x for consistency"},
  {"name": "Wing Gundam", "quantity": 3, "category": "unit", "cardNumber": "GD01-040", "cost": 4, "level": 5, "purpose": "Heavy attacker - 3x good support"},
  {"name": "GM", "quantity": 2, "category": "unit", "cardNumber": "ST01-005", "cost": 2, "level": 3, "purpose": "Early game - 2x for curve"}
]

Use real cards: Gundam (GD01-013), Wing Gundam (GD01-040), Strike Gundam (GD01-077), Gundam Aerial (GD01-070), Char's Zaku II (GD01-026), Unicorn Gundam (GD01-005), Guncannon (GD01-004), Guntank (GD01-008), GM (ST01-005), Zaku II (ST03-008), etc.

Total quantity must equal exactly 25. Count: 4+3+2+... = 25. Only return JSON array.`
    } else if (section === 'instants-sorceries') {
      return `Generate Command cards totaling exactly 12 cards for this Gundam TCG deck using real cards and proper quantities (1-4 copies each).

Deck: ${deckSummary.name} (${deckSummary.pilot})
Strategy: ${deckSummary.strategy}
Forces: ${deckSummary.forces?.join(', ')}
Power Level: ${deckSummary.powerLevel}

CRITICAL RULE: You can include 1-4 copies of any card. Think about card value:
- Essential effects: 4 copies for consistency
- Good utility: 2-3 copies
- Situational responses: 1-2 copies
- Tech/counter cards: 1 copy

Return JSON array totaling exactly 12 cards:
[
  {"name": "A Show of Resolve", "quantity": 4, "category": "command", "cardNumber": "GD01-100", "cost": 2, "level": 2, "purpose": "Core combat support - 4x for consistency"},
  {"name": "Intercept Orders", "quantity": 3, "category": "command", "cardNumber": "GD01-099", "cost": 1, "level": 1, "purpose": "Defense - 3x good utility"},
  {"name": "First Contact", "quantity": 2, "category": "command", "cardNumber": "GD01-107", "cost": 2, "level": 2, "purpose": "Draw power - 2x for card advantage"}
]

Use real cards: A Show of Resolve (GD01-100), Intercept Orders (GD01-099), First Contact (GD01-107), The Witch and the Bride (GD01-117), Naval Bombardment (GD01-120), Thoroughly Damaged (ST01-012), Kai's Resolve (ST01-013), etc.

Total quantity must equal exactly 12. Count: 4+3+2+... = 12. Only return JSON array.`
    } else if (section === 'artifacts-enchantments') {
      return `Generate Pilot and Base cards totaling exactly 13 cards for this Gundam TCG deck using real cards and proper quantities (1-4 copies each).

Deck: ${deckSummary.name} (${deckSummary.pilot})
Strategy: ${deckSummary.strategy}
Forces: ${deckSummary.forces?.join(', ')}
Power Level: ${deckSummary.powerLevel}

CRITICAL RULE: You can include 1-4 copies of any card. Think about card value:
- Key pilots for strategy: 4 copies for consistency  
- Good support pilots: 2-3 copies
- Situational pilots: 1-2 copies
- Bases (usually 1 active): 1-2 copies each

Return JSON array totaling exactly 13 cards:
[
  {"name": "Amuro Ray", "quantity": 4, "category": "pilot", "cardNumber": "ST01-010", "cost": 2, "level": 2, "purpose": "Core pilot - 4x for consistency"},
  {"name": "Char Aznable", "quantity": 3, "category": "pilot", "cardNumber": "ST03-011", "cost": 3, "level": 3, "purpose": "Strong pilot - 3x for reliability"},
  {"name": "White Base", "quantity": 2, "category": "base", "cardNumber": "ST01-015", "cost": 3, "level": 3, "purpose": "Base support - 2x for options"}
]

Use real cards: Amuro Ray (ST01-010), Char Aznable (ST03-011), Suletta Mercury (ST01-011), Heero Yuy (ST02-010), Kira Yamato (ST04-010), Banagher Links (GD01-088), White Base (ST01-015), Side 7 (GD01-124), etc.

Total quantity must equal exactly 13. Count: 4+3+2+... = 13. Only return JSON array.`
    }
  }
}


// Fast strategy endpoint
app.post('/api/deck-strategy', async (req, res) => {
  try {
    const { deckSummary } = req.body
    if (!deckSummary?.name || !deckSummary?.commander) {
      return res.status(400).json({ error: 'Missing deck data' })
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: generateStrategyPrompt(deckSummary) }]
    })

    const strategy = JSON.parse(response.content[0].text)
    res.json(strategy)
  } catch (error) {
    console.error('Strategy generation error:', error)
    
    let errorMessage = 'Failed to generate strategy'
    let statusCode = 500
    
    if (error.response?.status === 429 || error.message?.includes('credit') || error.message?.includes('quota')) {
      errorMessage = 'API credits exhausted. Please check your Anthropic account and add more credits.'
      statusCode = 429
    }
    
    res.status(statusCode).json({ error: errorMessage })
  }
})

// Manabase endpoint
app.post('/api/deck-manabase', async (req, res) => {
  try {
    const { deckSummary } = req.body
    if (!deckSummary?.name || !deckSummary?.commander) {
      return res.status(400).json({ error: 'Missing deck data' })
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [{ role: 'user', content: generateManabasePrompt(deckSummary) }]
    })

    const manabase = JSON.parse(response.content[0].text)
    console.log(`Generated manabase with ${manabase.length} lands`)
    res.json(manabase)
  } catch (error) {
    console.error('Manabase generation error:', error)
    res.status(500).json({ error: 'Failed to generate manabase' })
  }
})

// Spells endpoint (creatures, instants/sorceries, artifacts/enchantments)
app.post('/api/deck-spells/:section', async (req, res) => {
  try {
    const { deckSummary } = req.body
    const { section } = req.params
    
    if (!deckSummary?.name || (!deckSummary?.commander && !deckSummary?.pilot)) {
      return res.status(400).json({ error: 'Missing deck data' })
    }

    const validSections = [
      'creatures', 'instants-sorceries', 'artifacts-enchantments', // Gundam sections
      'early-creatures', 'mid-creatures', 'late-creatures', // MTG micro-chunks
      'ramp-draw', 'removal-interaction', 'win-cons-artifacts'
    ]
    
    if (!validSections.includes(section)) {
      return res.status(400).json({ error: 'Invalid section' })
    }

    const game = deckSummary.game || 'mtg'
    const expectedCounts = {
      'mtg': { 
        'early-creatures': 9, 
        'mid-creatures': 9, 
        'late-creatures': 7,
        'ramp-draw': 9, 
        'removal-interaction': 9, 
        'win-cons-artifacts': 9 
      },
      'gundam': { 'creatures': 25, 'instants-sorceries': 12, 'artifacts-enchantments': 13 }
    }

    const expectedCount = expectedCounts[game][section]
    let spells = []
    let attempt = 0
    const maxAttempts = 3

    while (attempt < maxAttempts) {
      try {
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: attempt === 0 ? 3000 : 2000, // Start with more tokens, reduce on retry
          messages: [{ role: 'user', content: generateSpellsPrompt(deckSummary, section) }]
        })

        const responseText = response.content[0].text
        spells = JSON.parse(responseText)
        
        // Check if we got the expected number of cards
        const totalCards = spells.reduce((sum, card) => sum + card.quantity, 0)
        
        if (totalCards >= expectedCount * 0.8) { // Accept if we got at least 80% of expected cards
          console.log(`Generated ${section} with ${spells.length} cards (${totalCards} total)`)
          res.json(spells)
          return
        } else {
          console.log(`Attempt ${attempt + 1}: Only got ${totalCards} cards, expected ${expectedCount}`)
        }
        
      } catch (parseError) {
        console.error(`Parse error on attempt ${attempt + 1}:`, parseError)
        if (attempt === maxAttempts - 1) {
          throw parseError
        }
      }
      
      attempt++
    }

    // If we get here, all attempts failed
    console.error(`Failed to generate complete ${section} after ${maxAttempts} attempts`)
    res.status(500).json({ error: `Failed to generate complete ${section}` })
    
  } catch (error) {
    console.error(`${req.params.section} generation error:`, error)
    
    let errorMessage = `Failed to generate ${req.params.section}`
    let statusCode = 500
    
    if (error.response?.status === 429 || error.message?.includes('credit') || error.message?.includes('quota')) {
      errorMessage = 'API credits exhausted. Please check your Anthropic account and add more credits.'
      statusCode = 429
    }
    
    res.status(statusCode).json({ error: errorMessage })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})