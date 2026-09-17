import express from 'express';
import { getSessionFromReq } from '../lib/auth.js';
import { query } from '../lib/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    if (session.role !== 'SUPREME') {
      return res.status(403).json({ error: 'Only Supreme can view audit logs' });
    }

    const page = Math.max(1, parseInt(req.query.page || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize || '20', 10) || 20));
    const action = req.query.action || '';
    const search = req.query.search || '';

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (action) {
      whereClause += ' AND a.action = ?';
      params.push(action);
    }

    if (search) {
      whereClause += ' AND (a.action LIKE ? OR a.target_type LIKE ? OR a.ip_address LIKE ? OR u.username LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM audit_logs a 
       LEFT JOIN users u ON u.id = a.actor_id 
       ${whereClause}`, params
    );
    const total = countResult?.total || 0;

    const offset = (page - 1) * pageSize;
    const rows = await query(
      `SELECT a.*, u.username as actor_username, u.full_name as actor_name
       FROM audit_logs a
       LEFT JOIN users u ON u.id = a.actor_id
       ${whereClause}
       ORDER BY a.created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    return res.json({ data: rows, total, page, pageSize });
  } catch (error) {
    console.error('Audit logs error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
