import { query, queryOne, getConnection } from './db.js';
import { DemoGameProvider } from './game/DemoGameProvider.js';

const provider = new DemoGameProvider();

const BETTING_DURATION_SEC = 25;
const REVEAL_DURATION_SEC = 6;
const TOTAL_CYCLE_SEC = BETTING_DURATION_SEC + REVEAL_DURATION_SEC;

// In-memory idempotency cache for rapid-click duplicate protection
const recentBetsCache = new Map();

function cleanOldCache() {
  const now = Date.now();
  for (const [key, timestamp] of recentBetsCache.entries()) {
    if (now - timestamp > 5000) {
      recentBetsCache.delete(key);
    }
  }
}

export async function getGameSettings() {
  try {
    const rows = await query('SELECT setting_key, setting_value FROM game_settings');
    const settings = {};
    for (const r of rows) {
      settings[r.setting_key] = r.setting_value;
    }
    return settings;
  } catch {
    return {};
  }
}

export async function getCurrentRoundState() {
  cleanOldCache();
  const settings = await getGameSettings();
  const bettingDuration = parseInt(settings.round_duration || BETTING_DURATION_SEC, 10);
  const totalCycle = bettingDuration + REVEAL_DURATION_SEC;

  // Get latest round
  let round = await queryOne('SELECT * FROM game_rounds ORDER BY id DESC LIMIT 1');

  const now = Date.now();
  let elapsed = 0;

  if (round && round.started_at) {
    const startedAtTime = new Date(round.started_at).getTime();
    elapsed = Math.floor((now - startedAtTime) / 1000);
  }

  // Settle any older uncompleted rounds
  try {
    const dangling = await query('SELECT * FROM game_rounds WHERE status = "BETTING_OPEN"');
    for (const old of dangling) {
      if (old.started_at) {
        const oldElapsed = Math.floor((now - new Date(old.started_at).getTime()) / 1000);
        if (oldElapsed >= bettingDuration) {
          const roundData = provider.generateRound();
          await query(
            'UPDATE game_rounds SET status = "COMPLETED", dragon_card = ?, tiger_card = ?, result = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
            [roundData.dragonCard, roundData.tigerCard, roundData.result, old.id]
          );
          old.dragon_card = roundData.dragonCard;
          old.tiger_card = roundData.tigerCard;
          old.result = roundData.result;
          await settleRoundBets(old, settings);
        }
      }
    }
  } catch (err) {
    console.error('Error settling dangling rounds:', err);
  }

  // Refetch latest round
  round = await queryOne('SELECT * FROM game_rounds ORDER BY id DESC LIMIT 1');
  if (round && round.started_at) {
    const startedAtTime = new Date(round.started_at).getTime();
    elapsed = Math.floor((now - startedAtTime) / 1000);
  }

  // Need new round? Only when no round exists or full cycle (betting + reveal) has finished
  if (!round || elapsed >= totalCycle) {
    const datePrefix = new Date().toISOString().replace(/\D/g, '').slice(2, 14);
    const newRoundId = `116${datePrefix}${Math.floor(Math.random() * 90 + 10)}`;

    await query(
      'INSERT INTO game_rounds (round_id, status, started_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      [newRoundId, 'BETTING_OPEN']
    );

    round = await queryOne('SELECT * FROM game_rounds WHERE round_id = ?', [newRoundId]);
    elapsed = 0;
  }

  const timeRemaining = round.status === 'BETTING_OPEN'
    ? Math.max(0, bettingDuration - elapsed)
    : 0;

  const bettingOpen = (round.status === 'BETTING_OPEN' && timeRemaining > 0);

  // Fetch last 10 completed results
  const recentRounds = await query(
    'SELECT round_id, result, dragon_card, tiger_card FROM game_rounds WHERE status = "COMPLETED" ORDER BY id DESC LIMIT 10'
  );

  return {
    roundId: round.round_id,
    status: round.status,
    timeRemaining,
    bettingOpen,
    dragonCard: round.status === 'COMPLETED' ? round.dragon_card : null,
    tigerCard: round.status === 'COMPLETED' ? round.tiger_card : null,
    result: round.status === 'COMPLETED' ? round.result : null,
    history: recentRounds.map(r => ({
      roundId: r.round_id,
      result: r.result === 'DRAGON' ? 'D' : r.result === 'TIGER' ? 'T' : 'Tie',
      rawResult: r.result,
      dragonCard: r.dragon_card,
      tigerCard: r.tiger_card,
    })),
  };
}

async function settleRoundBets(round, settings) {
  const bets = await query(
    'SELECT * FROM game_bets WHERE round_id = ? AND result = "PENDING"',
    [round.round_id]
  );

  for (const bet of bets) {
    const betAmount = Number(bet.amount);
    const payout = provider.calculatePayout(
      bet.bet_type,
      round.result,
      betAmount,
      round.dragon_card,
      round.tiger_card,
      settings
    );

    const conn = await getConnection();
    try {
      await conn.beginTransaction();

      const [walletRows] = await conn.execute(
        'SELECT balance, exposure FROM wallets WHERE user_id = ? FOR UPDATE',
        [bet.user_id]
      );
      if (walletRows.length === 0) {
        await conn.rollback();
        continue;
      }

      const currentBalance = Number(walletRows[0].balance);
      const currentExposure = Number(walletRows[0].exposure || 0);

      // 1. Release exposure for this settled bet (brings negative exposure back towards 0)
      const newExposure = Math.min(0, currentExposure + betAmount);

      let newBalance = currentBalance;
      let netPnl = 0;
      let txnType = 'LOSS';
      let txnRemarks = `Dragon Tiger Bet Settled: ${bet.bet_type}`;

      if (payout > betAmount) {
        // WIN SCENARIO: Stake was not deducted initially. Add net profit to balance.
        netPnl = payout - betAmount;
        newBalance = currentBalance + netPnl;
        txnType = 'WIN';
        txnRemarks = `Dragon Tiger Win (+${netPnl}) on ${bet.bet_type} (Gross Return: ${payout})`;

        await conn.execute(
          'UPDATE wallets SET balance = ?, exposure = ?, total_received = total_received + ? WHERE user_id = ?',
          [newBalance, newExposure, netPnl, bet.user_id]
        );

        await conn.execute(
          'UPDATE game_bets SET result = "WIN", payout = ?, net_pnl = ? WHERE id = ?',
          [payout, netPnl, bet.id]
        );
      } else if (payout === 0) {
        // LOSS SCENARIO: Stake was not deducted initially. Deduct stake from balance now.
        netPnl = -betAmount;
        newBalance = Math.max(0, currentBalance - betAmount);
        txnType = 'LOSS';
        txnRemarks = `Dragon Tiger Loss (-${betAmount}) on ${bet.bet_type}`;

        await conn.execute(
          'UPDATE wallets SET balance = ?, exposure = ?, total_distributed = total_distributed + ? WHERE user_id = ?',
          [newBalance, newExposure, betAmount, bet.user_id]
        );

        await conn.execute(
          'UPDATE game_bets SET result = "LOSS", payout = 0, net_pnl = ? WHERE id = ?',
          [netPnl, bet.id]
        );
      } else if (payout === betAmount) {
        // PUSH / FULL REFUND SCENARIO: Balance unchanged, exposure restored to 0.
        netPnl = 0;
        newBalance = currentBalance;
        txnType = 'REFUND';
        txnRemarks = `Dragon Tiger Push/Refund (0) on ${bet.bet_type}`;

        await conn.execute(
          'UPDATE wallets SET exposure = ? WHERE user_id = ?',
          [newExposure, bet.user_id]
        );

        await conn.execute(
          'UPDATE game_bets SET result = "REFUND", payout = ?, net_pnl = 0 WHERE id = ?',
          [payout, bet.id]
        );
      } else {
        // PARTIAL REFUND SCENARIO (e.g. 50% refund on tie):
        const lostPortion = betAmount - payout;
        netPnl = -lostPortion;
        newBalance = Math.max(0, currentBalance - lostPortion);
        txnType = 'REFUND';
        txnRemarks = `Dragon Tiger Partial Refund (${payout} returned, -${lostPortion}) on ${bet.bet_type}`;

        await conn.execute(
          'UPDATE wallets SET balance = ?, exposure = ?, total_distributed = total_distributed + ? WHERE user_id = ?',
          [newBalance, newExposure, lostPortion, bet.user_id]
        );

        await conn.execute(
          'UPDATE game_bets SET result = "REFUND", payout = ?, net_pnl = ? WHERE id = ?',
          [payout, netPnl, bet.id]
        );
      }

      // Record transaction
      const txnId = `TXN_${txnType}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      await conn.execute(
        `INSERT INTO transactions 
         (txn_id, from_user_id, to_user_id, amount, type, balance_before, balance_after, status, remarks, reference_id) 
         VALUES (?, NULL, ?, ?, ?, ?, ?, 'SUCCESS', ?, ?)`,
        [txnId, bet.user_id, Math.abs(netPnl), txnType, currentBalance, newBalance, txnRemarks, round.round_id]
      );

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      console.error('Error settling bet:', err);
    } finally {
      conn.release();
    }
  }
}

export async function placeUserBet({ userId, roundId, betType, amount, idempotencyKey }) {
  if (!userId) throw new Error('Unauthorized');
  if (!roundId) throw new Error('Round ID is required');
  if (!betType) throw new Error('Bet type is required');

  const betAmount = parseInt(amount, 10);
  if (isNaN(betAmount) || betAmount <= 0) {
    throw new Error('Invalid bet amount');
  }

  // Duplicate click prevention
  const cacheKey = `${userId}_${roundId}_${betType}_${idempotencyKey || betAmount}`;
  const now = Date.now();
  if (recentBetsCache.has(cacheKey) && (now - recentBetsCache.get(cacheKey) < 1500)) {
    throw new Error('Duplicate bet detected. Please wait.');
  }
  recentBetsCache.set(cacheKey, now);

  // Settings for limits
  const settings = await getGameSettings();
  const minBet = parseInt(settings.min_bet || 10, 10);
  const maxBet = parseInt(settings.max_bet || 100000, 10);

  if (betAmount < minBet) {
    throw new Error(`Minimum bet is ${minBet} coins`);
  }
  if (betAmount > maxBet) {
    throw new Error(`Maximum bet is ${maxBet} coins`);
  }

  // Verify round state
  const round = await queryOne('SELECT * FROM game_rounds WHERE round_id = ?', [roundId]);
  if (!round) {
    throw new Error('Round not found');
  }

  const bettingDuration = parseInt(settings.round_duration || BETTING_DURATION_SEC, 10);
  const startedAtTime = new Date(round.started_at).getTime();
  const elapsed = Math.floor((now - startedAtTime) / 1000);

  if (round.status !== 'BETTING_OPEN' || elapsed >= bettingDuration) {
    throw new Error('Betting is closed for this round');
  }

  // Atomic exposure update in MySQL wallet (Balance remains unchanged)
  const conn = await getConnection();
  try {
    await conn.beginTransaction();

    const [wallets] = await conn.execute(
      'SELECT balance, exposure FROM wallets WHERE user_id = ? FOR UPDATE',
      [userId]
    );

    if (wallets.length === 0) {
      await conn.rollback();
      throw new Error('Wallet not found');
    }

    const currentBal = Number(wallets[0].balance);
    const currentExp = Number(wallets[0].exposure || 0);
    const available = currentBal + currentExp;

    if (available < betAmount) {
      await conn.rollback();
      throw new Error(`Insufficient available limit (Balance: ${currentBal}, EXP: ${currentExp}, Available: ${available})`);
    }

    const newExp = currentExp - betAmount;

    // Do NOT change balance. Decrement exposure to capture open risk (negative).
    await conn.execute(
      'UPDATE wallets SET exposure = ? WHERE user_id = ?',
      [newExp, userId]
    );

    // Create transaction tracking open exposure
    const txnId = `TXN_BET_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    await conn.execute(
      `INSERT INTO transactions 
       (txn_id, from_user_id, to_user_id, amount, type, balance_before, balance_after, status, remarks, reference_id) 
       VALUES (?, ?, NULL, ?, 'BET', ?, ?, 'SUCCESS', ?, ?)`,
      [txnId, userId, betAmount, currentBal, currentBal, `Dragon Tiger Bet: ${betType} (EXP: ${newExp})`, roundId]
    );

    // Record bet with PENDING state
    const [betResult] = await conn.execute(
      `INSERT INTO game_bets (round_id, user_id, bet_type, amount, txn_id, result, net_pnl) 
       VALUES (?, ?, ?, ?, ?, 'PENDING', 0)`,
      [roundId, userId, betType, betAmount, txnId]
    );

    await conn.commit();

    return {
      betId: betResult.insertId,
      txnId,
      roundId,
      betType,
      amount: betAmount,
      balance: currentBal,
      exposure: newExp,
      available: currentBal + newExp,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
