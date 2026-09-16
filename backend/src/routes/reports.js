import express from 'express';
import { getSessionFromReq } from '../lib/auth.js';
import { query, queryOne } from '../lib/db.js';

const router = express.Router();

router.get('/overview', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    let stats = {};

    if (session.role === 'SUPREME') {
      const [superAdmins] = await query("SELECT COUNT(*) as c FROM users WHERE role='SUPER_ADMIN' AND deleted_at IS NULL");
      const [masters] = await query("SELECT COUNT(*) as c FROM users WHERE role='MASTER' AND deleted_at IS NULL");
      const [users] = await query("SELECT COUNT(*) as c FROM users WHERE role='USER' AND deleted_at IS NULL");
      const [totalDist] = await query("SELECT COALESCE(SUM(amount),0) as c FROM transactions WHERE type='CREDIT' AND status='SUCCESS'");
      const [todayTxns] = await query("SELECT COUNT(*) as c FROM transactions WHERE DATE(created_at)=CURDATE()");
      const [activeUsers] = await query("SELECT COUNT(*) as c FROM users WHERE status='ACTIVE' AND deleted_at IS NULL AND role='USER'");

      stats = {
        totalSuperAdmins: superAdmins?.c || 0,
        totalMasters: masters?.c || 0,
        totalUsers: users?.c || 0,
        totalCoinsDistributed: Number(totalDist?.c || 0),
        todayTransactions: todayTxns?.c || 0,
        activeUsers: activeUsers?.c || 0,
      };
    } else if (session.role === 'SUPER_ADMIN') {
      const [masters] = await query("SELECT COUNT(*) as c FROM users WHERE role='MASTER' AND parent_id=? AND deleted_at IS NULL", [session.id]);
      const [users] = await query("SELECT COUNT(*) as c FROM users WHERE role='USER' AND parent_id IN (SELECT id FROM users WHERE parent_id=? AND role='MASTER') AND deleted_at IS NULL", [session.id]);
      const wallet = await queryOne('SELECT * FROM wallets WHERE user_id=?', [session.id]);

      stats = {
        totalMasters: masters?.c || 0,
        totalUsers: users?.c || 0,
        coinsReceived: Number(wallet?.total_received || 0),
        coinsDistributed: Number(wallet?.total_distributed || 0),
        availableCoins: Number(wallet?.balance || 0),
      };
    } else if (session.role === 'MASTER') {
      const [users] = await query("SELECT COUNT(*) as c FROM users WHERE role='USER' AND parent_id=? AND deleted_at IS NULL", [session.id]);
      const wallet = await queryOne('SELECT * FROM wallets WHERE user_id=?', [session.id]);

      stats = {
        totalUsers: users?.c || 0,
        coinsReceived: Number(wallet?.total_received || 0),
        coinsDistributed: Number(wallet?.total_distributed || 0),
        availableCoins: Number(wallet?.balance || 0),
      };
    }

    // Recent transactions
    let recentTxnWhere = '';
    const recentParams = [];
    if (session.role !== 'SUPREME') {
      recentTxnWhere = 'WHERE (t.from_user_id = ? OR t.to_user_id = ?)';
      recentParams.push(session.id, session.id);
    }

    const recentTxns = await query(
      `SELECT t.txn_id, t.amount, t.type, t.status, t.created_at,
              fu.username as from_username, fu.role as from_role,
              tu.username as to_username, tu.role as to_role
       FROM transactions t
       LEFT JOIN users fu ON fu.id = t.from_user_id
       LEFT JOIN users tu ON tu.id = t.to_user_id
       ${recentTxnWhere}
       ORDER BY t.created_at DESC LIMIT 10`,
      recentParams
    );

    return res.json({ stats, recentTransactions: recentTxns });
  } catch (error) {
    console.error('Reports overview error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
