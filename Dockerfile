# Multi-stage build for the complete app
FROM node:18-alpine AS base

# Frontend build stage
FROM base AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Backend stage
FROM base AS backend
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .

# Final stage - serve both frontend and backend
FROM base AS final
WORKDIR /app

# Copy backend
COPY --from=backend /app .

# Copy built frontend to serve statically
COPY --from=frontend-builder /app/dist ./public

EXPOSE 3001

CMD ["npm", "start"]