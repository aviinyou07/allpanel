FROM node:20-slim

WORKDIR /app

# Install dependencies first for Docker caching
COPY package*.json ./
RUN npm install --omit=dev

# Copy application files
COPY . .
RUN chmod +x docker-entrypoint.sh

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

ENTRYPOINT ["./docker-entrypoint.sh"]

