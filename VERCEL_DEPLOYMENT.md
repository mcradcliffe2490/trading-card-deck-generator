# 🚀 Vercel Deployment Guide

This guide walks you through deploying both the frontend and backend to Vercel.

## 📋 **What You'll Deploy:**
- **Frontend**: React app with password protection and UI
- **Backend**: Express API server with Claude AI integration

## 🎯 **Step-by-Step Deployment:**

### **Part 1: Deploy Backend (API) First**

1. **Go to [vercel.com](https://vercel.com) and sign in**

2. **Click "New Project"**

3. **Import your GitHub repository**
   - Select `trading-card-deck-generator`

4. **Configure for Backend:**
   - **Root Directory**: `server`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

5. **Set Environment Variables:**
   - `ANTHROPIC_API_KEY` = your actual Claude API key
   - `NODE_ENV` = `production`

6. **Deploy** - You'll get a URL like: `https://your-backend-name.vercel.app`

7. **Test your API:**
   - Visit: `https://your-backend-name.vercel.app/api/generate-decks` 
   - Should see an error about missing form data (this is good!)

### **Part 2: Deploy Frontend**

1. **Create a second Vercel project** (click "New Project" again)

2. **Import the same GitHub repository**

3. **Configure for Frontend:**
   - **Root Directory**: Leave empty (uses root)
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables:**
   - `VITE_APP_PASSWORD` = your chosen password
   - `VITE_API_URL` = your backend URL from Part 1

5. **Deploy** - You'll get a URL like: `https://your-frontend-name.vercel.app`

## 🎉 **Testing Your Deployed App:**

1. **Visit your frontend URL**
2. **Enter your password** (from `VITE_APP_PASSWORD`)
3. **Select a game** (MTG or Gundam)
4. **Generate a deck** - it should work!

## 🔧 **Environment Variables Summary:**

### **Backend Project:**
```
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key
NODE_ENV=production
```

### **Frontend Project:**
```
VITE_APP_PASSWORD=your_secure_password
VITE_API_URL=https://your-backend-name.vercel.app
```

## 🚨 **Important Notes:**

- **Deploy backend FIRST** to get the API URL
- **Use the API URL** in your frontend environment variables
- **Don't include `/api` in VITE_API_URL** - the frontend code adds it
- **Test both projects** independently before connecting them

## 🛠️ **Troubleshooting:**

- **CORS errors**: Make sure VITE_API_URL is correct
- **Password not working**: Check VITE_APP_PASSWORD spelling
- **API errors**: Verify ANTHROPIC_API_KEY is set correctly
- **Build fails**: Make sure you selected the right root directory

## 🔗 **What You'll Have:**

- **Frontend URL**: Your main app for users
- **Backend URL**: API endpoint (users won't visit this directly)
- **Two separate Vercel projects** that work together

**Both deployments will auto-update when you push to GitHub!** 🎯