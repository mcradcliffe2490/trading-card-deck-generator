# MTG Deck Generator

An AI-powered Magic: The Gathering deck generator that creates personalized EDH/Commander deck suggestions based on your preferences.

## Features

- Interactive form to capture player preferences (playstyle, budget, power level, etc.)
- AI-powered deck generation using Claude API
- Three unique deck suggestions per query
- Detailed deck information including commander, strategy, key cards, and estimated cost
- Clean, responsive UI built with React and TypeScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trading-card-deck-generator.git
cd trading-card-deck-generator
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
cd ..
```

4. Set up environment variables:
```bash
cp server/.env.example server/.env
```

Edit `server/.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3001
```

### Running the Application

To start both the frontend and backend servers:
```bash
npm start
```

This will start:
- Frontend development server on http://localhost:3000
- Backend API server on http://localhost:3001

Alternatively, you can run them separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run dev
```

## How It Works

1. **User Input**: Users fill out a form with their preferences:
   - Playstyle description
   - Play type (casual/competitive)
   - Commander preference (optional)
   - Budget range
   - Desired power level

2. **AI Generation**: The backend sends user preferences to Claude API with a structured prompt

3. **Deck Suggestions**: Claude returns 3 unique deck suggestions with:
   - Commander and color identity
   - Strategy summary
   - Key cards list
   - Estimated cost
   - Power level rating

4. **Display**: Frontend displays the suggestions as interactive cards

## Project Structure

```
trading-card-deck-generator/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── types.ts           # TypeScript interfaces
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── server/                # Backend Express server
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── package.json           # Frontend dependencies
└── README.md
```

## Future Enhancements

- Integration with TCGPlayer API for real-time pricing
- Export functionality to popular deck building platforms
- Support for other TCG formats (Standard, Modern, etc.)
- Deck testing integration
- User accounts and saved decks
- Community features and deck sharing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
