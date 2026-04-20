# Build stage for frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - Node.js server
FROM node:20-alpine

WORKDIR /app

# Copy server files
COPY server/package*.json ./
RUN npm install --production

COPY server/ ./

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/dist ./dist

# Expose port 80
EXPOSE 80

# Set default port and production mode
ENV PORT=80
ENV NODE_ENV=production

CMD ["node", "index.js"]
