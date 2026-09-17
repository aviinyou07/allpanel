FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Build Next.js application
ENV NODE_ENV=production
RUN npm run build

ENV HOSTNAME="0.0.0.0"
ENV PORT=3001

EXPOSE 3001

CMD ["npm", "start"]
