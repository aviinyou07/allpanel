#!/bin/bash
set -e

echo "========================================================"
echo "🚀 Allpanel8 Deployment / Update Script"
echo "========================================================"

# 1. Pull latest code from GitHub repository
echo "📥 Step 1: Pulling latest changes from git..."
git pull origin main

# 2. Ensure .env exists
if [ ! -f .env ]; then
  echo "📄 .env file not found. Copying .env.example to .env..."
  cp .env.example .env
fi

# 3. Build and launch Docker containers
echo "🐳 Step 2: Building and starting Docker containers..."
docker compose up -d --build --remove-orphans

# 4. Clean up dangling builder images to keep VPS storage lean
echo "🧹 Step 3: Cleaning up old build images..."
docker image prune -f

# 5. Detect VPS public IP address
PUBLIC_IP=$(curl -s -m 4 https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')

echo ""
echo "========================================================"
echo "✅ Allpanel8 is LIVE and Healthy!"
echo "========================================================"
docker compose ps
echo ""
echo "🌐 Access Links (without domain):"
echo "   🎮 User Panel:  http://${PUBLIC_IP}:3000"
echo "   🛡️ Admin Panel: http://${PUBLIC_IP}:3001"
echo "   🔌 Backend API: http://${PUBLIC_IP}:5000"
echo ""
echo "Demo User:  user_a  (Password: User@123)"
echo "Supreme Admin: supreme (Password: Supreme@123)"
echo "========================================================"

