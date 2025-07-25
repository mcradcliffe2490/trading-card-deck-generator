# Multi-stage build for the complete app
FROM node:18-alpine AS base

# Frontend build stage
FROM base AS frontend-builder
WORKDIR /app

# Copy frontend package files
COPY package*.json ./
RUN npm ci --include=dev

# Copy source and build frontend
COPY . .
RUN npm run build

# Backend stage  
FROM base AS backend
WORKDIR /app

# Copy server package files and install dependencies
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server source
COPY server/ .

# Final stage - serve both frontend and backend
FROM base AS final
WORKDIR /app

# Copy backend files and dependencies
COPY --from=backend /app ./

# Copy built frontend to serve statically  
COPY --from=frontend-builder /app/dist ./public

# Set environment
ENV NODE_ENV=production

EXPOSE 3001

CMD ["npm", "start"]