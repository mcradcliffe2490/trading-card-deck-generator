# TCG Deck Generator - Deployment Guide

This guide covers deploying the Trading Card Game Deck Generator to various hosting platforms.

## Quick Deploy Options

### Option 1: Railway (Recommended - Full Stack)
Railway can host both frontend and backend together:

1. Connect your GitHub repo to Railway
2. Set environment variables:
   - `ANTHROPIC_API_KEY`: Your Claude API key
   - `NODE_ENV`: `production`
   - `VITE_APP_PASSWORD`: Your app access password
   - `VITE_API_URL`: Your Railway app URL (e.g., `https://your-app.railway.app`)
3. Deploy automatically triggers

### Option 2: Vercel (Frontend) + Railway (Backend)
For separate frontend/backend deployment:

**Backend (Railway):**
1. Create new Railway project from GitHub
2. Set root directory to `/server`
3. Set environment variables:
   - `ANTHROPIC_API_KEY`: Your Claude API key
   - `NODE_ENV`: `production`

**Frontend (Vercel):**
1. Connect GitHub repo to Vercel
2. Set environment variables:
   - `VITE_APP_PASSWORD`: Your app access password  
   - `VITE_API_URL`: Your Railway backend URL

### Option 3: Netlify (Full Stack with Functions)
1. Connect GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables in Netlify dashboard

## Environment Variables

### Frontend (.env)
```
VITE_APP_PASSWORD=your_secure_password
VITE_API_URL=https://your-backend-url.com
```

### Backend (server/.env)
```
ANTHROPIC_API_KEY=your_anthropic_api_key
PORT=3001
NODE_ENV=production
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

2. Set up environment variables (copy from .env.example)

3. Start development servers:
   ```bash
   npm start
   ```

## Security Notes

- The password protection is client-side and not cryptographically secure
- For production use, consider implementing server-side authentication
- Keep your Anthropic API key secure and never commit it to version control
- Use strong passwords and rotate them regularly

## Building for Production

```bash
# Build frontend
npm run build

# Test production build locally
npm run preview

# Start production server
cd server && npm start
```

## Troubleshooting

- If API calls fail, check the VITE_API_URL environment variable
- For CORS issues, ensure the backend allows your frontend domain
- Password issues: verify VITE_APP_PASSWORD is set correctly
- API credit errors: check your Anthropic account balance