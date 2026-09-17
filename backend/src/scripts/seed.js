import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
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

const SALT_ROUNDS = 12;

async function seed() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306');
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'dragon_tiger_admin';

  console.log('\n🌱 Seeding Dragon Tiger Admin Database...\n');

  const connection = await mysql.createConnection({ host, port, user, password, database: dbName });

  // Check if already seeded
  const [existing] = await connection.execute('SELECT COUNT(*) as count FROM users');
  if (existing[0].count > 0) {
    console.log('⚠️  Database already has data. Skipping seed.');
    console.log('   To re-seed, clear the tables first.\n');
    await connection.end();
    return;
  }

  // Hash passwords
  const supremePass = await bcrypt.hash('Supreme@123', SALT_ROUNDS);
  const adminPass = await bcrypt.hash('Admin@123', SALT_ROUNDS);
  const masterPass = await bcrypt.hash('Master@123', SALT_ROUNDS);
  const userPass = await bcrypt.hash('User@123', SALT_ROUNDS);

  // 1. Create Supreme
  const [supremeResult] = await connection.execute(
    `INSERT INTO users (username, email, full_name, mobile, password, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ['supreme', 'supreme@dragontiger.com', 'Supreme Admin', '9999999999', supremePass, 'SUPREME', 'ACTIVE']
  );
  const supremeId = supremeResult.insertId;
  await connection.execute(`INSERT INTO wallets (user_id, balance, total_received, total_distributed) VALUES (?, ?, ?, ?)`,
    [supremeId, 0, 0, 0]); // Supreme has unlimited, balance tracking is for display only
  console.log('✅ Supreme created (supreme / Supreme@123)');

  // 2. Create Super Admin A
  const [saAResult] = await connection.execute(
    `INSERT INTO users (username, email, full_name, mobile, password, role, parent_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['superadmin_a', 'sa_a@dragontiger.com', 'Super Admin A', '9999999901', adminPass, 'SUPER_ADMIN', supremeId, 'ACTIVE']
  );
  const saAId = saAResult.insertId;
  await connection.execute(`INSERT INTO wallets (user_id, balance, total_received, total_distributed) VALUES (?, ?, ?, ?)`,
    [saAId, 300000, 1000000, 700000]);

  // 3. Create Super Admin B
  const [saBResult] = await connection.execute(
    `INSERT INTO users (username, email, full_name, mobile, password, role, parent_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['superadmin_b', 'sa_b@dragontiger.com', 'Super Admin B', '9999999902', adminPass, 'SUPER_ADMIN', supremeId, 'ACTIVE']
  );
  const saBId = saBResult.insertId;
  await connection.execute(`INSERT INTO wallets (user_id, balance, total_received, total_distributed) VALUES (?, ?, ?, ?)`,
    [saBId, 500000, 800000, 300000]);
  console.log('✅ Super Admins created (superadmin_a, superadmin_b / Admin@123)');

  // 4. Create Master A (under Super Admin A)
  const [mAResult] = await connection.execute(
    `INSERT INTO users (username, email, full_name, mobile, password, role, parent_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['master_a', 'master_a@dragontiger.com', 'Master A', '9999999801', masterPass, 'MASTER', saAId, 'ACTIVE']
  );
  const mAId = mAResult.insertId;
  await connection.execute(`INSERT INTO wallets (user_id, balance, total_received, total_distributed) VALUES (?, ?, ?, ?)`,
    [mAId, 100000, 400000, 300000]);

  // 5. Create Master B (under Super Admin A)
  const [mBResult] = await connection.execute(
    `INSERT INTO users (username, email, full_name, mobile, password, role, parent_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['master_b', 'master_b@dragontiger.com', 'Master B', '9999999802', masterPass, 'MASTER', saAId, 'ACTIVE']
  );
  const mBId = mBResult.insertId;
  await connection.execute(`INSERT INTO wallets (user_id, balance, total_received, total_distributed) VALUES (?, ?, ?, ?)`,
    [mBId, 150000, 300000, 150000]);

  // 6. Create Master C (under Super Admin B)
  const [mCResult] = await connection.execute(
    `INSERT INTO users (username, email, full_name, mobile, password, role, parent_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['master_c', 'master_c@dragontiger.com', 'Master C', '9999999803', masterPass, 'MASTER', saBId, 'ACTIVE']
  );
  const mCId = mCResult.insertId;
  await connection.execute(`INSERT INTO wallets (user_id, balance, total_received, total_distributed) VALUES (?, ?, ?, ?)`,
    [mCId, 100000, 300000, 200000]);
  console.log('✅ Masters created (master_a, master_b, master_c / Master@123)');

  // 7. Create Users
  const users = [
    { username: 'user_a', name: 'User A', mobile: '9999999701', parentId: mAId },
    { username: 'user_b', name: 'User B', mobile: '9999999702', parentId: mAId },
    { username: 'user_c', name: 'User C', mobile: '9999999703', parentId: mBId },
    { username: 'user_d', name: 'User D', mobile: '9999999704', parentId: mCId },
    { username: 'user_e', name: 'User E', mobile: '9999999705', parentId: mCId },
  ];

  for (const u of users) {
    const [uResult] = await connection.execute(
      `INSERT INTO users (username, email, full_name, mobile, password, role, parent_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [u.username, `${u.username}@dragontiger.com`, u.name, u.mobile, userPass, 'USER', u.parentId, 'ACTIVE']
    );
    await connection.execute(`INSERT INTO wallets (user_id, balance, total_received, total_distributed) VALUES (?, ?, ?, ?)`,
      [uResult.insertId, 50000, 100000, 50000]);
  }
  console.log('✅ Users created (user_a through user_e / User@123)');

  // 8. Create sample transactions
  const now = new Date();
  const txns = [
    { fromId: supremeId, toId: saAId, fromRole: 'SUPREME', toRole: 'SUPER_ADMIN', amount: 1000000, type: 'CREDIT', remarks: 'Initial allocation' },
    { fromId: supremeId, toId: saBId, fromRole: 'SUPREME', toRole: 'SUPER_ADMIN', amount: 800000, type: 'CREDIT', remarks: 'Initial allocation' },
    { fromId: saAId, toId: mAId, fromRole: 'SUPER_ADMIN', toRole: 'MASTER', amount: 400000, type: 'CREDIT', remarks: 'Coin distribution' },
    { fromId: saAId, toId: mBId, fromRole: 'SUPER_ADMIN', toRole: 'MASTER', amount: 300000, type: 'CREDIT', remarks: 'Coin distribution' },
    { fromId: saBId, toId: mCId, fromRole: 'SUPER_ADMIN', toRole: 'MASTER', amount: 300000, type: 'CREDIT', remarks: 'Coin distribution' },
  ];

  for (let i = 0; i < txns.length; i++) {
    const t = txns[i];
    const txnId = `TXN${Date.now()}${i}`;
    await connection.execute(
      `INSERT INTO transactions (txn_id, from_user_id, to_user_id, from_role, to_role, amount, type, balance_before, balance_after, receiver_balance_before, receiver_balance_after, status, remarks, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [txnId, t.fromId, t.toId, t.fromRole, t.toRole, t.amount, t.type, 0, 0, 0, t.amount, 'SUCCESS', t.remarks, t.fromId]
    );
  }
  console.log('✅ Sample transactions created');

  // 9. Create game settings
  const settings = [
    ['game_enabled', 'true'],
    ['game_provider', 'demo'],
    ['min_bet', '100'],
    ['max_bet', '100000'],
    ['round_duration', '30'],
    ['dragon_payout', '2'],
    ['tiger_payout', '2'],
    ['tie_payout', '12'],
  ];

  for (const [key, value] of settings) {
    await connection.execute(
      `INSERT INTO game_settings (setting_key, setting_value, updated_by) VALUES (?, ?, ?)`,
      [key, value, supremeId]
    );
  }
  console.log('✅ Game settings created');

  // 10. Create audit logs
  await connection.execute(
    `INSERT INTO audit_logs (actor_id, actor_role, action, target_id, target_type, details, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [supremeId, 'SUPREME', 'SEED_DATA', null, null, JSON.stringify({ message: 'Database seeded with initial data' }), 'SUCCESS']
  );
  console.log('✅ Audit log created');

  await connection.end();
  console.log('\n🎉 Seeding complete!\n');
  console.log('   Login credentials:');
  console.log('   ─────────────────────────────────────');
  console.log('   Supreme:      supreme / Supreme@123');
  console.log('   Super Admin:  superadmin_a / Admin@123');
  console.log('   Super Admin:  superadmin_b / Admin@123');
  console.log('   Master:       master_a / Master@123');
  console.log('   Master:       master_b / Master@123');
  console.log('   Master:       master_c / Master@123');
  console.log('   User:         user_a / User@123');
  console.log('   User:         user_b / User@123');
  console.log('   User:         user_c / User@123');
  console.log('   User:         user_d / User@123');
  console.log('   User:         user_e / User@123');
  console.log('   ─────────────────────────────────────\n');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
