import express from 'express';
import { getSessionFromReq } from '../lib/auth.js';
import { queryOne, getConnection } from '../lib/db.js';
import { canManageRole } from '../lib/rbac.js';

const router = express.Router();

function getIP(req) {
  return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip || 'unknown';
}

router.get('/', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    let userId = session ? session.id : null;

    if (!userId) {
      const demoUser = await queryOne('SELECT id FROM users WHERE username = "user_a" AND deleted_at IS NULL');
      if (demoUser) userId = demoUser.id;
    }

    if (!userId) {
      return res.json({ balance: 0, totalReceived: 0, totalDistributed: 0, isUnlimited: false });
    }

    const wallet = await queryOne(
      'SELECT balance, total_received, total_distributed FROM wallets WHERE user_id = ?',
      [userId]
    );

    const isSupreme = session?.role === 'SUPREME';

    return res.json({
      balance: isSupreme ? -1 : (wallet ? Number(wallet.balance) : 0),
      totalReceived: wallet ? Number(wallet.total_received) : 0,
      totalDistributed: wallet ? Number(wallet.total_distributed) : 0,
      isUnlimited: isSupreme,
      userId,
    });
  } catch (err) {
    console.error('Error fetching wallet:', err);
    return res.status(500).json({ error: 'Failed to fetch wallet' });
  }
});

router.post('/transfer', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    if (session.role === 'USER') {
      return res.status(403).json({ error: 'Users cannot transfer coins' });
    }

    const { receiverId, amount, remarks } = req.body || {};

    if (!receiverId || !amount) {
      return res.status(400).json({ error: 'Receiver and amount are required' });
    }

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const receiver = await queryOne(
      'SELECT id, username, full_name, role, parent_id, status FROM users WHERE id = ? AND deleted_at IS NULL',
      [receiverId]
    );
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    if (!canManageRole(session.role, receiver.role)) {
      return res.status(403).json({ error: 'Unauthorized transfer: invalid hierarchy' });
    }

    if (session.role !== 'SUPREME' && receiver.parent_id !== session.id) {
      return res.status(403).json({ error: 'Receiver is not in your downline' });
    }

    if (receiver.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Receiver account is not active' });
    }

    const conn = await getConnection();
    try {
      await conn.beginTransaction();

      const [senderWalletRows] = await conn.execute(
        'SELECT * FROM wallets WHERE user_id = ? FOR UPDATE',
        [session.id]
      );
      const senderWallet = senderWalletRows[0];

      const [receiverWalletRows] = await conn.execute(
        'SELECT * FROM wallets WHERE user_id = ? FOR UPDATE',
        [receiverId]
      );
      const receiverWallet = receiverWalletRows[0];

      if (!senderWallet || !receiverWallet) {
        await conn.rollback();
        return res.status(400).json({ error: 'Wallet not found' });
      }

      if (session.role !== 'SUPREME' && senderWallet.balance < numAmount) {
        await conn.rollback();
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      const senderBalanceBefore = Number(senderWallet.balance);
      const receiverBalanceBefore = Number(receiverWallet.balance);
      const senderBalanceAfter = session.role === 'SUPREME' ? senderBalanceBefore : senderBalanceBefore - numAmount;
      const receiverBalanceAfter = receiverBalanceBefore + numAmount;

      if (session.role !== 'SUPREME') {
        await conn.execute(
          'UPDATE wallets SET balance = balance - ?, total_distributed = total_distributed + ? WHERE user_id = ?',
          [numAmount, numAmount, session.id]
        );
      } else {
        await conn.execute(
          'UPDATE wallets SET total_distributed = total_distributed + ? WHERE user_id = ?',
          [numAmount, session.id]
        );
      }

      await conn.execute(
        'UPDATE wallets SET balance = balance + ?, total_received = total_received + ? WHERE user_id = ?',
        [numAmount, numAmount, receiverId]
      );

      const txnId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      await conn.execute(
        `INSERT INTO transactions (txn_id, from_user_id, to_user_id, from_role, to_role, amount, type, 
         balance_before, balance_after, receiver_balance_before, receiver_balance_after, status, remarks, created_by)
         VALUES (?, ?, ?, ?, ?, ?, 'CREDIT', ?, ?, ?, ?, 'SUCCESS', ?, ?)`,
        [txnId, session.id, receiverId, session.role, receiver.role, numAmount,
         senderBalanceBefore, senderBalanceAfter, receiverBalanceBefore, receiverBalanceAfter,
         remarks || 'Coin transfer', session.id]
      );

      await conn.execute(
        'INSERT INTO audit_logs (actor_id, actor_role, action, target_id, target_type, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [session.id, session.role, 'COIN_TRANSFER', receiverId, receiver.role,
         JSON.stringify({ amount: numAmount, txnId, receiverUsername: receiver.username }),
         getIP(req), 'SUCCESS']
      );

      await conn.commit();

      return res.json({
        success: true,
        txnId,
        amount: numAmount,
        senderBalance: senderBalanceAfter,
        receiverBalance: receiverBalanceAfter,
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Transfer error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
