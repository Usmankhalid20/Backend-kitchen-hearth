# Use a lightweight Node.js 22 Alpine base image
FROM node:22-alpine

WORKDIR /app

# Copy dependency package files first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application source code
COPY server.js ./
COPY src/ ./src/

# Expose backend service port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start application
CMD ["node", "server.js"]
