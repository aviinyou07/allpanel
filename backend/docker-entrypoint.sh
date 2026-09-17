#!/bin/sh
set -e

echo "=========================================="
echo "⏳ Waiting for MySQL at ${DB_HOST:-mysql}:${DB_PORT:-3306}..."
echo "=========================================="

node -e '
import("mysql2/promise").then(async ({ default: mysql }) => {
  const maxRetries = 30;
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const conn = await mysql.createConnection({
        host: process.env.DB_HOST || "mysql",
        port: parseInt(process.env.DB_PORT || "3306", 10),
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        connectTimeout: 3000,
      });
      await conn.end();
      console.log("✅ MySQL is ready and accepting connections!");
      process.exit(0);
    } catch (err) {
      console.log(`⏳ Waiting for MySQL (${err.code || err.message})... [${i}/${maxRetries}]`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  console.error("❌ Timed out waiting for MySQL database to become available.");
  process.exit(1);
}).catch((err) => {
  console.error("❌ Unexpected error while probing MySQL:", err);
  process.exit(1);
});
'

echo "🔧 Running database schema setup and migrations..."
npm run setup

echo "🌱 Ensuring database is seeded with initial accounts..."
npm run seed

echo "🚀 Starting Allpanel8 Backend on port ${PORT:-5000}..."
exec node src/server.js

