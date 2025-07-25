import React from 'react'
import { TCGGame } from '../types'

interface GameSelectionProps {
  onGameSelect: (game: TCGGame) => void
}

const GameSelection: React.FC<GameSelectionProps> = ({ onGameSelect }) => {
  return (
    <div className="game-selection">
      <h1>TCG Deck Generator</h1>
      <p>Choose your trading card game to generate personalized deck ideas</p>
      
      <div className="game-options">
        <div className="game-card" onClick={() => onGameSelect('mtg')}>
          <div className="game-icon">🧙‍♂️</div>
          <h3>Magic: The Gathering</h3>
          <p>Generate EDH/Commander decks with AI-powered suggestions</p>
          <div className="game-details">
            <span className="deck-size">100 cards</span>
            <span className="format">EDH/Commander</span>
          </div>
        </div>
        
        <div className="game-card" onClick={() => onGameSelect('gundam')}>
          <div className="game-icon">🤖</div>
          <h3>Gundam TCG</h3>
          <p>Build competitive Gundam decks with pilot and mobile suit synergies</p>
          <div className="game-details">
            <span className="deck-size">50 cards</span>
            <span className="format">Standard</span>
          </div>
        </div>
      </div>
      
      <div className="coming-soon">
        <h4>Coming Soon</h4>
        <div className="future-games">
          <span className="future-game">Pokemon TCG</span>
          <span className="future-game">Yu-Gi-Oh!</span>
          <span className="future-game">One Piece TCG</span>
        </div>
      </div>
    </div>
  )
}

export default GameSelection