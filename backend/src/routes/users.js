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

    const page = Math.max(1, parseInt(req.query.page || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize || '10', 10) || 10));
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

    const { fullName, username, email, mobile, password, role, status, initialCredit } = req.body || {};

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

    const creditAmount = parseInt(initialCredit || 0, 10);
    if (isNaN(creditAmount) || creditAmount < 0) {
      return res.status(400).json({ error: 'Initial credit must be a non-negative number' });
    }

    const existing = await queryOne('SELECT id FROM users WHERE username = ?', [username.trim()]);
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const mustChangePassword = role === 'USER';

    const conn = await getConnection();
    try {
      await conn.beginTransaction();

      let senderBalanceBefore = 0;
      let senderBalanceAfter = 0;

      if (creditAmount > 0) {
        const [senderWalletRows] = await conn.execute(
          'SELECT * FROM wallets WHERE user_id = ? FOR UPDATE',
          [session.id]
        );
        const senderWallet = senderWalletRows[0];
        if (!senderWallet) {
          await conn.rollback();
          return res.status(400).json({ error: 'Sender wallet not found' });
        }

        senderBalanceBefore = Number(senderWallet.balance);
        if (session.role !== 'SUPREME' && senderBalanceBefore < creditAmount) {
          await conn.rollback();
          return res.status(400).json({ error: `Insufficient balance to credit ₹${creditAmount}. Current balance: ₹${senderBalanceBefore}` });
        }

        senderBalanceAfter = session.role === 'SUPREME' ? senderBalanceBefore : senderBalanceBefore - creditAmount;

        if (session.role !== 'SUPREME') {
          await conn.execute(
            'UPDATE wallets SET balance = balance - ?, total_distributed = total_distributed + ? WHERE user_id = ?',
            [creditAmount, creditAmount, session.id]
          );
        } else {
          await conn.execute(
            'UPDATE wallets SET total_distributed = total_distributed + ? WHERE user_id = ?',
            [creditAmount, session.id]
          );
        }
      }

      const [result] = await conn.execute(
        'INSERT INTO users (username, email, full_name, mobile, password, role, parent_id, status, must_change_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [username.trim(), email || null, fullName, mobile || null, hashedPassword, role, session.id, status || 'ACTIVE', mustChangePassword]
      );
      const userId = result.insertId;

      await conn.execute(
        'INSERT INTO wallets (user_id, balance, exposure, total_received, total_distributed) VALUES (?, ?, 0, ?, 0)',
        [userId, creditAmount, creditAmount]
      );

      if (creditAmount > 0) {
        const txnId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        await conn.execute(
          `INSERT INTO transactions (txn_id, from_user_id, to_user_id, from_role, to_role, amount, type, 
           balance_before, balance_after, receiver_balance_before, receiver_balance_after, status, remarks, created_by)
           VALUES (?, ?, ?, ?, ?, ?, 'CREDIT', ?, ?, 0, ?, 'SUCCESS', ?, ?)`,
          [txnId, session.id, userId, session.role, role, creditAmount,
           senderBalanceBefore, senderBalanceAfter, creditAmount,
           'Initial token allocation upon account creation', session.id]
        );
      }

      await conn.execute(
        'INSERT INTO audit_logs (actor_id, actor_role, action, target_id, target_type, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [session.id, session.role, 'CREATE_ACCOUNT', userId, role, JSON.stringify({ username: username.trim(), fullName, initialCredit: creditAmount }),
         getIP(req), 'SUCCESS']
      );

      await conn.commit();

      return res.status(201).json({
        success: true,
        userId,
        username: username.trim(),
        initialCredit: creditAmount,
        mustChangePassword,
      });
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

    const { fullName, email, mobile, status, password } = body;
    const sanitizedEmail = email !== undefined ? (email ? email.trim() : null) : undefined;
    const sanitizedMobile = mobile !== undefined ? (mobile ? mobile.trim() : null) : undefined;

    let hashedPassword = null;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      hashedPassword = await hashPassword(password);
    }

    if (hashedPassword) {
      await query(
        'UPDATE users SET full_name = COALESCE(?, full_name), email = COALESCE(?, email), mobile = COALESCE(?, mobile), status = COALESCE(?, status), password = ? WHERE id = ?',
        [fullName, sanitizedEmail, sanitizedMobile, status, hashedPassword, id]
      );
    } else {
      await query(
        'UPDATE users SET full_name = COALESCE(?, full_name), email = COALESCE(?, email), mobile = COALESCE(?, mobile), status = COALESCE(?, status) WHERE id = ?',
        [fullName, sanitizedEmail, sanitizedMobile, status, id]
      );
    }

    const auditDetails = { ...body };
    if (auditDetails.password) auditDetails.password = '[REDACTED]';

    await query(
      'INSERT INTO audit_logs (actor_id, actor_role, action, target_id, target_type, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [session.id, session.role, 'UPDATE_ACCOUNT', id, user.role, JSON.stringify(auditDetails),
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
