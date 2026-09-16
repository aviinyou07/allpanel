import express from 'express';
import { getSessionFromReq } from '../lib/auth.js';
import { query, queryOne } from '../lib/db.js';
import { getCurrentRoundState, placeUserBet, getGameSettings } from '../lib/gameEngine.js';

const router = express.Router();

function getIP(req) {
  return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip || 'unknown';
}

router.get('/rounds/current', async (req, res) => {
  try {
    const roundState = await getCurrentRoundState();
    return res.json(roundState);
  } catch (err) {
    console.error('Error fetching current round:', err);
    return res.status(500).json({ error: 'Failed to fetch current round' });
  }
});

router.get('/rounds', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const pageSize = parseInt(req.query.pageSize || '20', 10);
    const rows = await query(
      'SELECT * FROM game_rounds ORDER BY started_at DESC LIMIT ?',
      [pageSize]
    );

    return res.json({ data: rows });
  } catch (error) {
    console.error('Game rounds error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/bet', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    let userId = session ? session.id : null;

    const { roundId, betType, amount, idempotencyKey } = req.body || {};

    if (!userId) {
      const demoUser = await queryOne('SELECT id FROM users WHERE username = "user_a" AND deleted_at IS NULL');
      if (demoUser) {
        userId = demoUser.id;
      } else {
        return res.status(401).json({ error: 'Please log in to place bets' });
      }
    }

    const result = await placeUserBet({
      userId,
      roundId,
      betType,
      amount,
      idempotencyKey,
    });

    return res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error('Bet error:', err.message);
    return res.status(400).json({ error: err.message || 'Failed to place bet' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const rounds = await query(
      `SELECT round_id, dragon_card, tiger_card, result, started_at, completed_at 
       FROM game_rounds 
       WHERE status = "COMPLETED" 
       ORDER BY id DESC LIMIT 20`
    );

    return res.json({ rounds });
  } catch (err) {
    console.error('Error fetching game history:', err);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.get('/config', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    // If called from admin panel, return raw settings array
    if (session && session.role !== 'USER') {
      const settings = await query('SELECT setting_key, setting_value, updated_at FROM game_settings ORDER BY id');
      return res.json({ settings });
    }

    // Default player game config format
    const settings = await getGameSettings();
    return res.json({
      provider: settings.provider || 'demo',
      gameEnabled: settings.game_enabled !== 'false',
      minBet: parseInt(settings.min_bet || 10, 10),
      maxBet: parseInt(settings.max_bet || 100000, 10),
      roundDuration: parseInt(settings.round_duration || 25, 10),
      payouts: {
        dragon: parseFloat(settings.dragon_payout || 2.0),
        tiger: parseFloat(settings.tiger_payout || 2.0),
        tie: parseFloat(settings.tie_payout || 12.0),
      },
    });
  } catch (err) {
    console.error('Error fetching game config:', err);
    return res.status(500).json({ error: 'Failed to fetch config' });
  }
});

router.put('/config', async (req, res) => {
  try {
    const session = await getSessionFromReq(req);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    if (session.role !== 'SUPREME') {
      return res.status(403).json({ error: 'Only Supreme can modify game settings' });
    }

    const { settings } = req.body || {};
    if (!settings) {
      return res.status(400).json({ error: 'Settings object required' });
    }

    for (const [key, value] of Object.entries(settings)) {
      await query(
        'INSERT INTO game_settings (setting_key, setting_value, updated_by) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = ?, updated_by = ?',
        [key, String(value), session.id, String(value), session.id]
      );
    }

    await query(
      'INSERT INTO audit_logs (actor_id, actor_role, action, details, ip_address, status) VALUES (?, ?, ?, ?, ?, ?)',
      [session.id, session.role, 'UPDATE_GAME_SETTINGS', JSON.stringify(settings),
       getIP(req), 'SUCCESS']
    );

    return res.json({ success: true });
  } catch (error) {
    console.error('Game config PUT error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
