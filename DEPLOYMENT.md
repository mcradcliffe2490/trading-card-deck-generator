# TCG Deck Generator - Deployment Guide

This guide covers deploying the Trading Card Game Deck Generator to various hosting platforms.

## 🔧 Build Process Fixed

The build process has been updated to work correctly on deployment platforms:
- Moved TypeScript and Vite to production dependencies 
- Simplified build command to just `vite build`
- Created separate build configs for different platforms
- Added nixpacks.toml for Railway optimization

## Quick Deploy Options

### Option 1: Railway (Recommended - Full Stack)
Railway can host both frontend and backend together:

1. Connect your GitHub repo to Railway
2. Set environment variables:
   - `ANTHROPIC_API_KEY`: Your Claude API key
   - `VITE_APP_PASSWORD`: Your app access password
   - `VITE_API_URL`: Your Railway app URL (e.g., `https://your-app.railway.app`)
   - `NODE_ENV`: `production`
3. Deploy automatically triggers

**Build Process**: Railway will use `nixpacks.toml` to:
- Install frontend dependencies
- Install server dependencies  
- Build frontend (`npm run build`)
- Copy built files to server/public/
- Start the server

**Troubleshooting**: If nixpacks fails, Railway should fall back to the `Procfile` which runs everything in sequence.

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

## Manual Deployment (Alternative)

If automated deployment fails, you can deploy manually:

```bash
# 1. Build and prepare
./deploy.sh

# 2. Start the server
cd server && npm start
```

Or step by step:
```bash
# Build frontend
npm run build

# Install server dependencies
cd server && npm install --only=production

# Copy frontend files
mkdir -p public
cp -r ../dist/* public/

# Start server
npm start
```

## Troubleshooting

- If API calls fail, check the VITE_API_URL environment variable
- For CORS issues, ensure the backend allows your frontend domain
- Password issues: verify VITE_APP_PASSWORD is set correctly
- API credit errors: check your Anthropic account balance
- **"Missing script: build" error**: This happens when Railway tries to run build in the server directory. The nixpacks.toml should prevent this.
- **Files not found**: The server now checks multiple locations for static files and will log where it found them.