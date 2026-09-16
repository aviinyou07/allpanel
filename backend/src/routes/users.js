import express from 'express';
import { getSessionFromReq, hashPassword } from '../lib/auth.js';
import { query, queryOne, getConnection } from '../lib/db.js';
import { canCreateRole, canManageRole } from '../lib/rbac.js';
import { isInDownline } from '../lib/server-rbac.js';

const router = express.Router();

function getIP(req) {
  return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip || 'unknown';
}

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '10', 10);
    const search = req.query.search || '';
    const role = req.query.role || '';
    const status = req.query.status || '';

    let whereClause = 'WHERE u.deleted_at IS NULL';
    const params = [];

    const manageableRole = canCreateRole(session.role);
    if (role) {
      if (!canManageRole(session.role, role)) {
        return res.status(403).json({ error: 'Unauthorized to view this role' });
      }
      whereClause += ' AND u.role = ?';
      params.push(role);
    } else if (manageableRole) {
      whereClause += ' AND u.role = ?';
      params.push(manageableRole);
    }

    if (session.role !== 'SUPREME') {
      whereClause += ' AND u.parent_id = ?';
      params.push(session.id);
    }

    if (search) {
      whereClause += ' AND (u.username LIKE ? OR u.full_name LIKE ? OR u.email LIKE ? OR u.mobile LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (status) {
      whereClause += ' AND u.status = ?';
      params.push(status);
    }

    const [countResult] = await query(`SELECT COUNT(*) as total FROM users u ${whereClause}`, params);
    const total = countResult?.total || 0;

    const offset = (page - 1) * pageSize;
    const rows = await query(
      `SELECT u.id, u.username, u.email, u.full_name, u.mobile, u.role, u.parent_id, u.status, u.created_at,
              w.balance, w.total_received, w.total_distributed
       FROM users u
       LEFT JOIN wallets w ON w.user_id = u.id
       ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    return res.json({ data: rows, total, page, pageSize });
  } catch (error) {
    console.error('Users GET error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { fullName, username, email, mobile, password, role, status } = req.body || {};

    const allowedRole = canCreateRole(session.role);
    if (!allowedRole || allowedRole !== role) {
      return res.status(403).json({ error: `You cannot create ${role} accounts` });
    }

    if (!fullName || !username || !password) {
      return res.status(400).json({ error: 'Full name, username, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await queryOne('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const conn = await getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.execute(
        'INSERT INTO users (username, email, full_name, mobile, password, role, parent_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [username, email || null, fullName, mobile || null, hashedPassword, role, session.id, status || 'ACTIVE']
      );
      const userId = result.insertId;

      await conn.execute(
        'INSERT INTO wallets (user_id, balance, total_received, total_distributed) VALUES (?, 0, 0, 0)',
        [userId]
      );

      await conn.execute(
        'INSERT INTO audit_logs (actor_id, actor_role, action, target_id, target_type, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [session.id, session.role, 'CREATE_ACCOUNT', userId, role, JSON.stringify({ username, fullName }),
         getIP(req), 'SUCCESS']
      );

      await conn.commit();

      return res.status(201).json({ success: true, userId });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Users POST error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id;
    const user = await queryOne(
      `SELECT u.*, w.balance, w.total_received, w.total_distributed
       FROM users u LEFT JOIN wallets w ON w.user_id = u.id
       WHERE u.id = ? AND u.deleted_at IS NULL`,
      [id]
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (session.role !== 'SUPREME' && user.parent_id !== session.id) {
      const inDownline = await isInDownline(session.id, parseInt(id, 10));
      if (!inDownline) return res.status(403).json({ error: 'Unauthorized' });
    }

    delete user.password;
    return res.json(user);
  } catch (error) {
    console.error('User GET error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id;
    const body = req.body || {};

    const user = await queryOne('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!canManageRole(session.role, user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (session.role !== 'SUPREME' && user.parent_id !== session.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { fullName, email, mobile, status } = body;
    await query(
      'UPDATE users SET full_name = COALESCE(?, full_name), email = COALESCE(?, email), mobile = COALESCE(?, mobile), status = COALESCE(?, status) WHERE id = ?',
      [fullName, email, mobile, status, id]
    );

    await query(
      'INSERT INTO audit_logs (actor_id, actor_role, action, target_id, target_type, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [session.id, session.role, 'UPDATE_ACCOUNT', id, user.role, JSON.stringify(body),
       getIP(req), 'SUCCESS']
    );

    return res.json({ success: true });
  } catch (error) {
    console.error('User PUT error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id;
    const user = await queryOne('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!canManageRole(session.role, user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (session.role !== 'SUPREME' && user.parent_id !== session.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await query('UPDATE users SET deleted_at = NOW(), status = ? WHERE id = ?', ['INACTIVE', id]);

    await query(
      'INSERT INTO audit_logs (actor_id, actor_role, action, target_id, target_type, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [session.id, session.role, 'DELETE_ACCOUNT', id, user.role, JSON.stringify({ username: user.username }),
       getIP(req), 'SUCCESS']
    );

    return res.json({ success: true });
  } catch (error) {
    console.error('User DELETE error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/users/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id;
    const { status } = req.body || {};

    if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const user = await queryOne('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [id]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!canManageRole(session.role, user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (session.role !== 'SUPREME' && user.parent_id !== session.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await query('UPDATE users SET status = ? WHERE id = ?', [status, id]);

    const action = status === 'ACTIVE' ? 'ACTIVATE_ACCOUNT' : status === 'SUSPENDED' ? 'SUSPEND_ACCOUNT' : 'DEACTIVATE_ACCOUNT';
    await query(
      'INSERT INTO audit_logs (actor_id, actor_role, action, target_id, target_type, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [session.id, session.role, action, id, user.role, JSON.stringify({ previousStatus: user.status, newStatus: status }),
       getIP(req), 'SUCCESS']
    );

    return res.json({ success: true });
  } catch (error) {
    console.error('User status PATCH error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
