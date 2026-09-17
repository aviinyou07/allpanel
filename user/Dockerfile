FROM node:20-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Build Next.js application with backend URL
ARG BACKEND_URL=http://backend:5000
ENV BACKEND_URL=$BACKEND_URL
ENV NODE_ENV=production
RUN npm run build

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
