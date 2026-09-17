import express from 'express';
import { getSessionFromReq } from '../lib/auth.js';
import { query, queryOne } from '../lib/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    let userId = session ? session.id : null;

    // For player demo mode if not logged in
    if (!userId && (!req.query.role && !req.query.type)) {
      const demoUser = await queryOne('SELECT id FROM users WHERE username = "user_a" AND deleted_at IS NULL');
      if (demoUser) userId = demoUser.id;
    }

    // If user role or simple user request
    if (session?.role === 'USER' || (!session && userId)) {
      const targetId = userId || session?.id;
      const txns = await query(
        `SELECT txn_id, amount, type, balance_before, balance_after, status, remarks, reference_id, created_at 
         FROM transactions 
         WHERE from_user_id = ? OR to_user_id = ? 
         ORDER BY id DESC LIMIT 20`,
        [targetId, targetId]
      );
      return res.json({ transactions: txns, data: txns, total: txns.length });
    }

    // Admin scoping
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const page = Math.max(1, parseInt(req.query.page || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize || '20', 10) || 20));
    const type = req.query.type || '';
    const search = req.query.search || '';

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (session.role === 'SUPER_ADMIN') {
      whereClause += ` AND (t.from_user_id = ? OR t.to_user_id = ? 
        OR t.from_user_id IN (SELECT id FROM users WHERE parent_id = ? OR parent_id IN (SELECT id FROM users WHERE parent_id = ?))
        OR t.to_user_id IN (SELECT id FROM users WHERE parent_id = ? OR parent_id IN (SELECT id FROM users WHERE parent_id = ?)))`;
      params.push(session.id, session.id, session.id, session.id, session.id, session.id);
    } else if (session.role === 'MASTER') {
      whereClause += ` AND (t.from_user_id = ? OR t.to_user_id = ? 
        OR t.from_user_id IN (SELECT id FROM users WHERE parent_id = ?)
        OR t.to_user_id IN (SELECT id FROM users WHERE parent_id = ?))`;
      params.push(session.id, session.id, session.id, session.id);
    }

    if (type) {
      whereClause += ' AND t.type = ?';
      params.push(type);
    }

    if (search) {
      whereClause += ' AND (t.txn_id LIKE ? OR fu.username LIKE ? OR tu.username LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    const countParams = [...params];
    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM transactions t 
       LEFT JOIN users fu ON fu.id = t.from_user_id
       LEFT JOIN users tu ON tu.id = t.to_user_id
       ${whereClause}`, countParams
    );
    const total = countResult?.total || 0;

    const offset = (page - 1) * pageSize;
    const rows = await query(
      `SELECT t.*, 
              fu.username as from_username, fu.full_name as from_name,
              tu.username as to_username, tu.full_name as to_name
       FROM transactions t
       LEFT JOIN users fu ON fu.id = t.from_user_id
       LEFT JOIN users tu ON tu.id = t.to_user_id
       ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    return res.json({ data: rows, transactions: rows, total, page, pageSize });
  } catch (error) {
    console.error('Transactions GET error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
