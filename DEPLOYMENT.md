# Trading Card Deck Generator - Vercel Deployment Guide

This guide covers deploying the Trading Card Game Deck Generator to Vercel with separate frontend and backend deployments.

## 🏗️ Architecture Overview

This project uses a separated frontend/backend architecture optimized for Vercel:
- **Frontend**: React + Vite application deployed to Vercel
- **Backend**: Node.js Express API deployed as Vercel serverless functions

## Frontend Deployment (Vercel)

### 1. Repository Setup
1. Connect your GitHub repository to Vercel
2. Select the root directory (not a subdirectory)

### 2. Build Configuration
Vercel will automatically detect the Vite configuration from `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. Environment Variables
Set the following environment variables in your Vercel project settings:

```
VITE_APP_PASSWORD=your_secure_password
VITE_API_URL=https://your-backend-project.vercel.app
```

### 4. Deploy
The frontend will automatically deploy when you push to your main branch.

## Backend Deployment (Vercel Serverless Functions)

### 1. Create Separate Vercel Project
1. Create a new Vercel project from the same GitHub repository
2. Set the **Root Directory** to `server/`
3. This ensures Vercel treats the server folder as the project root

### 2. Serverless Configuration
The backend uses the `server/vercel.json` configuration:
```json
{
  "name": "tcg-deck-generator-api",
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "ANTHROPIC_API_KEY": "@anthropic_api_key",
    "NODE_ENV": "production"
  }
}
```

### 3. Environment Variables
Set the following environment variables in your backend Vercel project:

```
ANTHROPIC_API_KEY=your_anthropic_api_key
NODE_ENV=production
```

Note: The `@anthropic_api_key` in vercel.json references a Vercel environment variable.

### 4. Deploy
The backend will deploy automatically when you push changes to the server directory.

## Complete Deployment Steps

### Step 1: Deploy Backend
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set **Root Directory** to `server`
5. Add environment variables:
   - `ANTHROPIC_API_KEY`: Your Claude API key
   - `NODE_ENV`: `production`
6. Deploy

### Step 2: Deploy Frontend
1. Create another new Vercel project
2. Import the same GitHub repository
3. Keep **Root Directory** empty (uses root)
4. Add environment variables:
   - `VITE_APP_PASSWORD`: Your app access password
   - `VITE_API_URL`: Your backend Vercel URL (from Step 1)
5. Deploy

## Local Development

To test the setup locally:

```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Start development servers
npm start
```

## Environment Variables Reference

### Frontend (.env)
```
VITE_APP_PASSWORD=your_secure_password
VITE_API_URL=https://your-backend-project.vercel.app
```

### Backend (server/.env)
```
ANTHROPIC_API_KEY=your_anthropic_api_key
NODE_ENV=production
```

## Troubleshooting

### Common Issues

**Build Errors:**
- Ensure all dependencies are in `dependencies` (not `devDependencies`) for production builds
- Check that TypeScript and Vite are included in dependencies

**API Connection Issues:**
- Verify `VITE_API_URL` points to your backend Vercel deployment
- Check CORS configuration in server if requests are blocked
- Ensure backend environment variables are set correctly

**Password Protection:**
- Verify `VITE_APP_PASSWORD` is set in frontend environment variables
- Password protection is client-side only - not cryptographically secure

**API Rate Limits:**
- Check your Anthropic account balance and usage limits
- Monitor API key usage in Anthropic dashboard

### Vercel-Specific Issues

**Root Directory Configuration:**
- Frontend: Leave root directory empty
- Backend: Set root directory to `server/`

**Function Timeout:**
- Vercel serverless functions have execution time limits
- Large deck generations may need optimization

**Environment Variable Access:**
- Use Vercel dashboard to set environment variables
- Variables set in `vercel.json` reference Vercel environment variables with `@` prefix

## Security Considerations

- Keep your Anthropic API key secure and never commit it to version control
- The password protection is client-side only - implement server-side auth for production security
- Use environment variables for all sensitive configuration
- Regularly rotate API keys and passwords
- Monitor your Anthropic API usage for unexpected activity

## Production Optimization

- Enable Vercel Analytics for performance monitoring
- Use Vercel's built-in caching for static assets
- Consider implementing request rate limiting
- Monitor serverless function cold starts and optimize if needed