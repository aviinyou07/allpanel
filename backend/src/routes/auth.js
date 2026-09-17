import express from 'express';
import { queryOne, query } from '../lib/db.js';
import { verifyPassword, hashPassword, createToken, getCookieName, getSessionFromReq } from '../lib/auth.js';
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
      'SELECT id, username, email, full_name, mobile, role, parent_id, password, status, must_change_password FROM users WHERE username = ? AND deleted_at IS NULL',
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

    // If logging into admin panel, reject regular player accounts
    if (req.body?.adminOnly && user.role === 'USER') {
      try {
        await query(
          'INSERT INTO audit_logs (actor_id, actor_role, action, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?)',
          [user.id, user.role, 'LOGIN_FAILED', JSON.stringify({ reason: 'Player account attempted admin login' }), getIP(req), 'FAILURE']
        );
      } catch {}
      return res.status(403).json({ error: 'Access denied: Player accounts cannot access the admin panel' });
    }

    // Demo user check: demo users never change password and always have coins
    const isDemo = (user.username === 'user_a' || user.username === 'demo' || user.username.startsWith('demo_'));
    const mustChangePassword = isDemo ? false : Boolean(user.must_change_password);

    // Fetch wallet balance & exposure
    const wallet = await queryOne('SELECT balance, exposure, total_received, total_distributed FROM wallets WHERE user_id = ?', [user.id]);
    let balance = wallet ? Number(wallet.balance) : 0;
    let exposure = wallet ? Number(wallet.exposure || 0) : 0;

    // Auto-topup demo coins if low so tester can play uninterrupted
    if (isDemo && balance < 1000) {
      await query('UPDATE wallets SET balance = 50000, exposure = 0 WHERE user_id = ?', [user.id]);
      balance = 50000;
      exposure = 0;
    }

    const token = await createToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      mustChangePassword,
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
        mustChangePassword,
        balance,
        exposure,
      },
      wallet: wallet ? {
        balance: user.role === 'SUPREME' ? -1 : Number(wallet.balance),
        exposure: user.role === 'SUPREME' ? 0 : Number(wallet.exposure || 0),
        available: user.role === 'SUPREME' ? -1 : Number(wallet.balance) + Number(wallet.exposure || 0),
        total_received: Number(wallet.total_received),
        total_distributed: Number(wallet.total_distributed),
      } : { balance: 0, exposure: 0, available: 0, total_received: 0, total_distributed: 0 },
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
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const session = await getSessionFromReq(req);
    if (!session) {
      return res.json({ authenticated: false });
    }

    const user = await queryOne(
      'SELECT id, username, email, full_name, mobile, role, parent_id, status, must_change_password FROM users WHERE id = ? AND deleted_at IS NULL',
      [session.id]
    );
    if (!user) {
      return res.json({ authenticated: false });
    }

    const isDemo = (user.username === 'user_a' || user.username === 'demo' || user.username.startsWith('demo_'));
    const mustChangePassword = isDemo ? false : Boolean(user.must_change_password);

    const wallet = await queryOne(
      'SELECT balance, exposure, total_received, total_distributed FROM wallets WHERE user_id = ?',
      [user.id]
    );
    let balance = wallet ? Number(wallet.balance) : 0;
    let exposure = wallet ? Number(wallet.exposure || 0) : 0;

    if (isDemo && balance < 1000) {
      await query('UPDATE wallets SET balance = 50000, exposure = 0 WHERE user_id = ?', [user.id]);
      balance = 50000;
      exposure = 0;
    }

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
        mustChangePassword,
        balance,
        exposure,
      },
      wallet: wallet ? {
        balance: user.role === 'SUPREME' ? -1 : balance,
        exposure: user.role === 'SUPREME' ? 0 : exposure,
        available: user.role === 'SUPREME' ? -1 : balance + exposure,
        total_received: Number(wallet.total_received),
        total_distributed: Number(wallet.total_distributed),
      } : { balance: 0, exposure: 0, available: 0, total_received: 0, total_distributed: 0 },
    });
  } catch (err) {
    console.error('Session error:', err);
    return res.json({ authenticated: false });
  }
});

router.post('/change-password', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const { oldPassword, newPassword, confirmPassword } = req.body || {};

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New password and confirmation do not match' });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ error: 'New password must be different from current password' });
    }

    const user = await queryOne('SELECT id, password, username, role FROM users WHERE id = ? AND deleted_at IS NULL', [session.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await verifyPassword(oldPassword, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await hashPassword(newPassword);
    await query('UPDATE users SET password = ?, must_change_password = FALSE WHERE id = ?', [hashedPassword, session.id]);

    try {
      await query(
        'INSERT INTO audit_logs (actor_id, actor_role, action, target_id, target_type, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [session.id, session.role, 'PASSWORD_CHANGE', session.id, 'USER', JSON.stringify({ username: session.username }), getIP(req), 'SUCCESS']
      );
    } catch {}

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
