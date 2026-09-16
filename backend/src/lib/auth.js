import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { queryOne } from './db.js';

const SALT_ROUNDS = 12;
const COOKIE_NAME = 'game_token';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || 'fallback_secret_change_me';
  return new TextEncoder().encode(secret);
}

export async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export async function createToken(payload, rememberMe = false) {
  const expiresIn = rememberMe ? '7d' : '24h';
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret());
  return token;
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload;
  } catch {
    return null;
  }
}

export function getCookieName() {
  return COOKIE_NAME;
}

export async function getSessionFromReq(req) {
  let token = null;

  if (req.cookies && typeof req.cookies === 'object') {
    token = req.cookies[COOKIE_NAME] || req.cookies['admin_token'];
  } else if (req.cookies?.get) {
    token = req.cookies.get(COOKIE_NAME)?.value || req.cookies.get('admin_token')?.value;
  }

  // Fallback: parse raw Cookie header directly
  if (!token && req.headers) {
    const rawCookie = typeof req.headers.get === 'function'
      ? req.headers.get('cookie')
      : req.headers['cookie'];
    if (rawCookie && typeof rawCookie === 'string') {
      const match = rawCookie.match(/(?:^|;\s*)(?:game_token|admin_token)=([^;]+)/);
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }
  }

  if (!token && req.headers) {
    const authHeader = typeof req.headers.get === 'function'
      ? req.headers.get('authorization')
      : req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || !payload.userId) return null;

  const user = await queryOne(
    'SELECT id, username, email, full_name, mobile, role, parent_id, status FROM users WHERE id = ? AND deleted_at IS NULL',
    [payload.userId]
  );

  if (!user || user.status !== 'ACTIVE') return null;
  return user;
}
