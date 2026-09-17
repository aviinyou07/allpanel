import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local if present
const envCandidates = [
  path.resolve(__dirname, '..', '.env.local'),
  path.resolve(__dirname, '..', '..', '.env.local'),
  path.resolve(__dirname, '..', '.env'),
  path.resolve(__dirname, '..', '..', '.env'),
];
for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

async function setupDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306');
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'dragon_tiger_admin';

  console.log(`\n🔧 Setting up Dragon Tiger Admin Database...`);
  console.log(`   Host: ${host}:${port}`);
  console.log(`   User: ${user}`);
  console.log(`   Database: ${dbName}\n`);

  // Connect without database first to create it
  let connection;
  try {
    connection = await mysql.createConnection({ host, port, user, password });
    console.log('✅ Connected to MySQL server');
  } catch (err) {
    console.error('❌ Failed to connect to MySQL:', err.message);
    console.error('\n   Make sure MySQL is running and credentials are correct.');
    console.error('   Update .env.local with your MySQL credentials.\n');
    process.exit(1);
  }

  // Create database
  try {
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database "${dbName}" ready`);
  } catch (err) {
    console.error('❌ Failed to create database:', err.message);
    process.exit(1);
  }

  // Switch to the database
  await connection.changeUser({ database: dbName });

  // Read and execute schema
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Strip SQL comments and split by semicolon
  const cleanSql = schema.replace(/--.*$/gm, '');
  const statements = cleanSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    try {
      await connection.execute(stmt);
    } catch (err) {
      if (err.code !== 'ER_TABLE_EXISTS_ERROR') {
        console.error(`❌ Schema error: ${err.message}`);
        console.error(`   Statement: ${stmt.substring(0, 80)}...`);
      }
    }
  }
  console.log('✅ Tables created');

  // Apply migrations for existing tables safely
  const migrations = [
    {
      table: 'users',
      column: 'must_change_password',
      sql: 'ALTER TABLE users ADD COLUMN must_change_password BOOLEAN DEFAULT TRUE',
    },
    {
      table: 'wallets',
      column: 'exposure',
      sql: 'ALTER TABLE wallets ADD COLUMN exposure BIGINT NOT NULL DEFAULT 0',
    },
    {
      table: 'game_bets',
      column: 'net_pnl',
      sql: 'ALTER TABLE game_bets ADD COLUMN net_pnl BIGINT DEFAULT 0',
    },
  ];

  for (const mig of migrations) {
    try {
      const [cols] = await connection.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [dbName, mig.table, mig.column]
      );
      if (cols.length === 0) {
        await connection.execute(mig.sql);
        console.log(`✅ Applied migration: Added ${mig.column} to ${mig.table}`);
      }
    } catch (err) {
      console.error(`⚠️ Migration error on ${mig.table}.${mig.column}:`, err.message);
    }
  }

  await connection.end();
  console.log('\n🎉 Database setup complete!\n');
  console.log('   Run "npm run seed" to add sample data.\n');
}

setupDatabase().catch(console.error);
