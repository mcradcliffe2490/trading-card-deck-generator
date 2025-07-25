import React, { useState } from 'react'
import { DeckFormData, TCGGame } from '../types'

interface DeckFormProps {
  game: TCGGame
  onSubmit: (data: DeckFormData) => void
  loading: boolean
}

const DeckForm: React.FC<DeckFormProps> = ({ game, onSubmit, loading }) => {
  const [formData, setFormData] = useState<DeckFormData>({
    game,
    playstyle: '',
    playType: 'friends',
    commander: game === 'mtg' ? '' : undefined,
    pilot: game === 'gundam' ? '' : undefined,
    budget: 'mid',
    level: 'casual'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getGameSpecificContent = () => {
    if (game === 'mtg') {
      return (
        <div className="form-group">
          <label htmlFor="commander">
            Do you have a specific commander in mind?
          </label>
          <input
            type="text"
            id="commander"
            name="commander"
            value={formData.commander || ''}
            onChange={handleChange}
            placeholder="e.g., Atraxa, Praetor's Voice or leave blank for suggestions"
          />
        </div>
      )
    } else if (game === 'gundam') {
      return (
        <div className="form-group">
          <label htmlFor="pilot">
            Do you have a specific pilot in mind?
          </label>
          <input
            type="text"
            id="pilot"
            name="pilot"
            value={formData.pilot || ''}
            onChange={handleChange}
            placeholder="e.g., Amuro Ray, Char Aznable or leave blank for suggestions"
          />
        </div>
      )
    }
    return null
  }

  const getPlaystylePlaceholder = () => {
    if (game === 'mtg') {
      return "e.g., I want to play aggro with lots of creatures, or I like control with counterspells and card draw..."
    } else if (game === 'gundam') {
      return "e.g., I want to focus on Mobile Suit rush strategies, or I prefer defensive pilot-based control..."
    }
    return "Describe your preferred playstyle..."
  }

  const getPowerLevelOptions = () => {
    if (game === 'mtg') {
      return (
        <>
          <option value="casual">Casual (1-4 power level)</option>
          <option value="focused">Focused (5-6 power level)</option>
          <option value="optimized">Optimized (7-8 power level)</option>
          <option value="competitive">Competitive (9-10 power level)</option>
        </>
      )
    } else if (game === 'gundam') {
      return (
        <>
          <option value="casual">Casual (fun, thematic builds)</option>
          <option value="focused">Focused (coherent strategy)</option>
          <option value="optimized">Optimized (tournament viable)</option>
          <option value="competitive">Competitive (meta-focused)</option>
        </>
      )
    }
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Tell us about your ideal {game === 'mtg' ? 'Commander' : 'Gundam'} deck</h2>
      
      <div className="form-group">
        <label htmlFor="playstyle">
          Describe the kind of playstyle you're looking for with this deck (if you know):
        </label>
        <textarea
          id="playstyle"
          name="playstyle"
          value={formData.playstyle}
          onChange={handleChange}
          placeholder={getPlaystylePlaceholder()}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="playType">
          Do you plan to play with friends, competitively, or both?
        </label>
        <select
          id="playType"
          name="playType"
          value={formData.playType}
          onChange={handleChange}
          required
        >
          <option value="friends">With friends (casual)</option>
          <option value="competitive">Competitively</option>
          <option value="both">Both</option>
        </select>
      </div>

      {getGameSpecificContent()}

      <div className="form-group">
        <label htmlFor="budget">
          What's your budget?
        </label>
        <select
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          required
        >
          <option value="budget">Budget ($0-50)</option>
          <option value="mid">Mid-range ($50-200)</option>
          <option value="high">High ($200-500)</option>
          <option value="no-limit">No limit ($500+)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="level">
          What level would you like the deck to be?
        </label>
        <select
          id="level"
          name="level"
          value={formData.level}
          onChange={handleChange}
          required
        >
          {getPowerLevelOptions()}
        </select>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Deck Ideas'}
      </button>
    </form>
  )
}

export default DeckForm