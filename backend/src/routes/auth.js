import express from 'express';
import { queryOne, query } from '../lib/db.js';
import { verifyPassword, createToken, getCookieName, getSessionFromReq } from '../lib/auth.js';
import { getRoleRoutePrefix } from '../lib/rbac.js';

const router = express.Router();

function getIP(req) {
  return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip || 'unknown';
}

router.post('/login', async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await queryOne(
      'SELECT id, username, email, full_name, mobile, role, parent_id, password, status FROM users WHERE username = ? AND deleted_at IS NULL',
      [username.trim()]
    );

    if (!user) {
      try {
        await query(
          'INSERT INTO audit_logs (actor_id, actor_role, action, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?)',
          [null, null, 'LOGIN_FAILED', JSON.stringify({ username, reason: 'User not found' }), getIP(req), 'FAILURE']
        );
      } catch {}
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    if (user.status !== 'ACTIVE') {
      try {
        await query(
          'INSERT INTO audit_logs (actor_id, actor_role, action, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?)',
          [user.id, user.role, 'LOGIN_FAILED', JSON.stringify({ reason: 'Account inactive/suspended' }), getIP(req), 'FAILURE']
        );
      } catch {}
      return res.status(403).json({ error: `Account is ${user.status.toLowerCase()}` });
    }

    const validPassword = await verifyPassword(password, user.password);
    if (!validPassword) {
      try {
        await query(
          'INSERT INTO audit_logs (actor_id, actor_role, action, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?)',
          [user.id, user.role, 'LOGIN_FAILED', JSON.stringify({ reason: 'Invalid password' }), getIP(req), 'FAILURE']
        );
      } catch {}
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Fetch wallet balance
    const wallet = await queryOne('SELECT balance, total_received, total_distributed FROM wallets WHERE user_id = ?', [user.id]);
    const balance = wallet ? Number(wallet.balance) : 0;

    const token = await createToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    }, rememberMe);

    // Audit log successful login
    try {
      await query(
        'INSERT INTO audit_logs (actor_id, actor_role, action, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?)',
        [user.id, user.role, 'LOGIN', JSON.stringify({ username: user.username }), getIP(req), 'SUCCESS']
      );
    } catch {}

    const maxAge = (rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24) * 1000;
    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge,
      path: '/',
    };

    // Set both game_token and admin_token so both frontend apps authenticate seamlessly
    res.cookie(getCookieName(), token, cookieOptions);
    res.cookie('admin_token', token, cookieOptions);

    const redirectPath = `${getRoleRoutePrefix(user.role)}/dashboard`;

    return res.json({
      success: true,
      token,
      redirectPath,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        parentId: user.parent_id,
        status: user.status,
        balance,
      },
      wallet: wallet ? {
        balance: user.role === 'SUPREME' ? -1 : Number(wallet.balance),
        total_received: Number(wallet.total_received),
        total_distributed: Number(wallet.total_distributed),
      } : { balance: 0, total_received: 0, total_distributed: 0 },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    if (session) {
      try {
        await query(
          'INSERT INTO audit_logs (actor_id, actor_role, action, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?)',
          [session.id, session.role, 'LOGOUT', JSON.stringify({ username: session.username }), getIP(req), 'SUCCESS']
        );
      } catch {}
    }
  } catch {}

  res.clearCookie(getCookieName(), { path: '/' });
  res.clearCookie('admin_token', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/me', async (req, res) => {
  try {
    const user = await getSessionFromReq(req);
    if (!user) {
      return res.json({ authenticated: false });
    }

    const wallet = await queryOne(
      'SELECT balance, total_received, total_distributed FROM wallets WHERE user_id = ?',
      [user.id]
    );
    const balance = wallet ? Number(wallet.balance) : 0;

    return res.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        mobile: user.mobile,
        role: user.role,
        parentId: user.parent_id,
        status: user.status,
        balance,
      },
      wallet: wallet ? {
        balance: user.role === 'SUPREME' ? -1 : Number(wallet.balance),
        total_received: Number(wallet.total_received),
        total_distributed: Number(wallet.total_distributed),
      } : { balance: 0, total_received: 0, total_distributed: 0 },
    });
  } catch (err) {
    console.error('Session error:', err);
    return res.json({ authenticated: false });
  }
});

export default router;
