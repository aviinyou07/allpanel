'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

const casinoFilterTabs = [
  'ALL CASINO',
  'ROULETTE',
  'TEENPATTI',
  'POKER',
  'BACCARAT',
  'DRAGON TIGER',
  '32 CARDS',
  'ANDAR BAHAR',
  'LUCKY 7',
  '3 CARD JUDGEMENT',
  'CASINO WAR',
  'WORLI',
  'SPORTS',
  'BOLLYWOOD',
  'LOTTERY',
  'QUEEN',
  'RACE',
  'OTHERS',
];

const allCasinoGames = [
  { title: 'ROULETTE', src: '/roulette.png', type: 'ROULETTE' },
  { title: 'OPEN TEENPATTI', src: '/teen8.png', type: 'TEENPATTI' },
  { title: 'ROULETTE', src: '/roulette.png', type: 'ROULETTE' },
  { title: 'OPEN TEENPATTI', src: '/teen8.png', type: 'TEENPATTI' },
  { title: 'OPEN TEENPATTI', src: '/teen8.png', type: 'TEENPATTI' },
  { title: 'ROULETTE', src: '/roulette.png', type: 'ROULETTE' },
  { title: 'OPEN TEENPATTI', src: '/teen8.png', type: 'TEENPATTI' },
  { title: 'ROULETTE', src: '/roulette.png', type: 'ROULETTE' },
  { title: 'ROULETTE', src: '/roulette.png', type: 'ROULETTE' },
  { title: 'OPEN TEENPATTI', src: '/teen8.png', type: 'TEENPATTI' },
  { title: 'ROULETTE', src: '/roulette.png', type: 'ROULETTE' },
  { title: 'OPEN TEENPATTI', src: '/teen8.png', type: 'TEENPATTI' },
  { title: 'OPEN TEENPATTI', src: '/teen8.png', type: 'TEENPATTI' },
  { title: 'ROULETTE', src: '/roulette.png', type: 'ROULETTE' },
  { title: 'OPEN TEENPATTI', src: '/teen8.png', type: 'TEENPATTI' },
  { title: 'ROULETTE', src: '/roulette.png', type: 'ROULETTE' },
  { title: 'ROULETTE', src: '/roulette.png', type: 'ROULETTE' },
  { title: 'OPEN TEENPATTI', src: '/teen8.png', type: 'TEENPATTI' },
  { title: 'ROULETTE', src: '/roulette.png', type: 'ROULETTE' },
  { title: 'OPEN TEENPATTI', src: '/teen8.png', type: 'TEENPATTI' },
];

const dragonTigerGames = [
  { title: '20-20 DRAGON TIGER', src: '/dt20.jpg', type: 'DRAGON TIGER' },
  { title: '20-20 DRAGON TIGER', src: '/dt20.jpg', type: 'DRAGON TIGER' },
  { title: '20-20 DRAGON TIGER', src: '/dt20.jpg', type: 'DRAGON TIGER' },
  { title: '20-20 DRAGON TIGER', src: '/dt20.jpg', type: 'DRAGON TIGER' },
];

function MiniCard({ rank, selected, locked, onClick }) {
  return (
    <button
      type="button"
      disabled={locked}
      onClick={onClick}
      className={`w-[26px] h-[36px] bg-white border ${
        selected ? 'border-[#3982b8] ring-2 ring-blue-400' : 'border-[#fbbf24]'
      } rounded-[2px] p-0 cursor-pointer hover:opacity-95 active:scale-95 transition-all shadow-xs shrink-0 select-none relative overflow-hidden flex items-center justify-center`}
    >
      <Image
        src={`/cards/mini/${rank}.png`}
        alt={`Card ${rank}`}
        width={64}
        height={88}
        unoptimized
        className="w-full h-full object-fill block select-none pointer-events-none"
      />
      {locked && (
        <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
        </div>
      )}
    </button>
  );
}

const sportMatchesData = {
  CRICKET: [
    {
      title: 'Royal Challengers Bengaluru (e) - Delhi Capitals (e)',
      time: '17/09/2026 14:42:00',
      hasBM: false,
      hasE: true,
      boxes: ['1.85', '1.87', '3.40', '3.50', '2.10', '2.14'],
    },
    {
      title: 'Punjab Kings (e) - Rajasthan Royals (e)',
      time: '17/09/2026 18:30:00',
      hasBM: false,
      hasE: true,
      boxes: ['1.92', '1.95', '3.20', '3.30', '1.95', '2.00'],
    },
    {
      title: 'Kolkata Knight Riders (e) - Royal Challengers (e)',
      time: '17/09/2026 20:00:00',
      hasBM: true,
      hasE: true,
      boxes: ['1.76', '1.80', '4.00', '4.20', '2.22', '2.28'],
    },
  ],
  FOOTBALL: [
    {
      title: 'Levante v Athletic Bilbao',
      time: '17/09/2026 20:00:00',
      hasBM: true,
      hasE: true,
      boxes: ['2.40', '2.44', '3.10', '3.15', '2.80', '2.86'],
    },
    {
      title: 'Arsenal v Chelsea',
      time: '17/09/2026 21:45:00',
      hasBM: true,
      hasE: true,
      boxes: ['1.75', '1.78', '3.80', '3.90', '4.20', '4.30'],
    },
    {
      title: 'Real Madrid v Barcelona',
      time: '18/09/2026 00:30:00',
      hasBM: true,
      hasE: true,
      boxes: ['2.05', '2.10', '3.50', '3.60', '3.20', '3.30'],
    },
  ],
  TENNIS: [
    {
      title: 'Carlos Alcaraz v Novak Djokovic',
      time: '17/09/2026 16:00:00',
      hasBM: true,
      hasE: false,
      boxes: ['1.68', '1.72', '-', '-', '2.20', '2.26'],
    },
    {
      title: 'Jannik Sinner v Daniil Medvedev',
      time: '17/09/2026 19:30:00',
      hasBM: false,
      hasE: true,
      boxes: ['1.80', '1.84', '-', '-', '2.05', '2.10'],
    },
  ],
  'TABLE TENNIS': [
    {
      title: 'Fan Zhendong v Wang Chuqin',
      time: '17/09/2026 15:00:00',
      hasBM: true,
      hasE: true,
      boxes: ['1.88', '1.92', '-', '-', '1.92', '1.96'],
    },
    {
      title: 'Ma Long v Tomokazu Harimoto',
      time: '17/09/2026 17:15:00',
      hasBM: false,
      hasE: true,
      boxes: ['1.65', '1.70', '-', '-', '2.30', '2.38'],
    },
  ],
  HORSE: [
    {
      title: 'Azerbaijan Grand Cup 14:00',
      time: '17/09/2026 14:00:00',
      hasBM: true,
      hasE: false,
      boxes: ['3.20', '3.35', '4.50', '4.70', '6.00', '6.40'],
    },
    {
      title: 'Ascot 15:30 Sprint Stakes',
      time: '17/09/2026 15:30:00',
      hasBM: true,
      hasE: false,
      boxes: ['2.50', '2.60', '3.75', '3.90', '5.10', '5.40'],
    },
  ],
};

function LiveOddsTable({ sport = 'CRICKET' }) {
  const [selectedBox, setSelectedBox] = useState(null);
  const matches = sportMatchesData[sport] || sportMatchesData.CRICKET;

  return (
    <div className="w-full bg-white flex flex-col divide-y divide-slate-200 select-none text-slate-900">
      {matches.map((m, idx) => (
        <div key={idx} className="flex flex-col px-2.5 py-1.5 bg-white">
          <div className="flex items-center justify-between gap-1 text-[12px] font-bold text-slate-900 leading-tight">
            <span className="truncate">{m.title}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-xs"></span>
              <svg className="w-3.5 h-3.5 fill-slate-800" viewBox="0 0 24 24">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
              </svg>
              {m.hasBM && (
                <div className="flex items-center gap-1">
                  <span className="font-serif italic font-black text-[12px]">f</span>
                  <span className="text-[10.5px] font-black text-slate-900">BM</span>
                </div>
              )}
              {m.hasE && (
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                  e
                </span>
              )}
            </div>
          </div>

          {m.time && (
            <div className="text-[10px] text-slate-600 font-medium -mt-0.5 mb-1">
              {m.time}
            </div>
          )}

          {m.time && (
            <div className="grid grid-cols-6 gap-1 text-center text-[10.5px] font-black text-slate-800 mb-0.5">
              <div className="col-span-2">1</div>
              <div className="col-span-2">X</div>
              <div className="col-span-2">2</div>
            </div>
          )}

          <div className="grid grid-cols-6 gap-1">
            {m.boxes.map((val, bIdx) => {
              const boxId = `${idx}-${bIdx}`;
              const isSelected = selectedBox === boxId;
              const isBack = bIdx % 2 === 0;

              return (
                <div
                  key={bIdx}
                  onClick={() => val !== '-' && setSelectedBox(isSelected ? null : boxId)}
                  className={`h-7 rounded-[2px] flex items-center justify-center font-bold text-[13px] cursor-pointer hover:opacity-90 active:scale-95 transition-all ${
                    isSelected
                      ? 'ring-2 ring-[#3982b8] font-black shadow-md'
                      : ''
                  } ${
                    isBack
                      ? 'bg-[#72bbf6] text-[#0f3d64]'
                      : 'bg-[#f8a9bb] text-[#6b1b2a]'
                  }`}
                >
                  {val}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function parseCard(cardStr) {
  if (!cardStr || typeof cardStr !== 'string') return null;
  const suit = cardStr.slice(-1);
  const rank = cardStr.slice(0, -1);
  const isRed = (suit === '♥' || suit === '♦');
  return { rank, suit, isRed };
}

function getCardImageUrl(cardStr) {
  if (!cardStr || typeof cardStr !== 'string') return '/card_back.png';
  const suitChar = cardStr.slice(-1);
  const rank = cardStr.slice(0, -1);
  const suitMap = {
    '♥': 'H', '♦': 'D', '♠': 'S', '♣': 'C',
    'H': 'H', 'D': 'D', 'S': 'S', 'C': 'C',
  };
  const s = suitMap[suitChar] || 'H';
  return `/cards/${rank}_${s}.png`;
}

function CasinoCard({ cardStr, side, isWinner }) {
  if (!cardStr) {
    return (
      <div className="w-11 h-16 sm:w-12 sm:h-16 rounded-[4px] overflow-hidden border border-[#fbbf24] shadow-md flex items-center justify-center bg-white">
        <Image
          src="/card_back.png"
          alt="Card Back"
          width={66}
          height={80}
          unoptimized
          className="w-full h-full object-fill"
        />
      </div>
    );
  }

  const winnerGlow = isWinner
    ? (side === 'DRAGON'
        ? 'ring-2 ring-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.95)] scale-105'
        : 'ring-2 ring-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.95)] scale-105')
    : 'shadow-md';

  return (
    <div
      className={`w-11 h-16 sm:w-12 sm:h-16 bg-white rounded-[4px] border border-[#fbbf24] ${winnerGlow} select-none transition-all duration-300 transform overflow-hidden`}
    >
      <Image
        src={getCardImageUrl(cardStr)}
        alt={cardStr}
        width={66}
        height={80}
        unoptimized
        className="w-full h-full object-fill"
      />
    </div>
  );
}

function TableStreamCard({ cardStr }) {
  const isRevealed = Boolean(cardStr);
  const imgSrc = isRevealed ? getCardImageUrl(cardStr) : '/card_back.png';

  return (
    <div className="w-[23px] h-[30px] sm:w-[26px] sm:h-[34px] rounded-[2px] overflow-hidden border border-[#fbbf24] shadow-sm shrink-0 select-none bg-white">
      <Image
        src={imgSrc}
        alt={cardStr || 'Card Back'}
        width={66}
        height={80}
        unoptimized
        priority
        className="w-full h-full object-fill block select-none pointer-events-none"
      />
    </div>
  );
}

function DragonTigerScreen({ onBack, user, wallet, onWalletUpdate, onLogout }) {
  const [roundState, setRoundState] = useState({
    roundId: '---',
    status: 'BETTING_OPEN',
    phase: 'BETTING_OPEN',
    timeRemaining: 25,
    bettingOpen: true,
    dragonCard: null,
    tigerCard: null,
    result: null,
    history: [],
  });
  const [betSlip, setBetSlip] = useState(null); // { betType, odds, title }
  const [betAmount, setBetAmount] = useState(100);
  const [betLoading, setBetLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [lastRoundNotice, setLastRoundNotice] = useState(null);
  const prevRoundPhase = useRef(null);
  const prevRoundId = useRef(null);
  const betSlipRef = useRef(null);
  const amountInputRef = useRef(null);

  const showToast = (text, type = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchRound = useCallback(async () => {
    try {
      const res = await fetch('/api/game/rounds/current');
      if (res.ok) {
        const data = await res.json();
        setRoundState(data);

        // Close bet slip immediately if betting is closed
        if (!data.bettingOpen) {
          setBetSlip(null);
        }

        // When a new betting round starts, clear previous notice
        if (data.status === 'BETTING_OPEN' && (prevRoundPhase.current === 'RESULT_HOLD' || prevRoundId.current !== data.roundId)) {
          setLastRoundNotice(null);
        }

        // During RESULT_HOLD (or COMPLETED), settle wallet and show victory celebration
        if ((data.phase === 'RESULT_HOLD' || data.status === 'COMPLETED') && data.result) {
          if (prevRoundPhase.current !== 'RESULT_HOLD') {
            try {
              const wRes = await fetch('/api/wallet');
              if (wRes.ok) {
                const wData = await wRes.json();
                onWalletUpdate?.({
                  balance: Number(wData.balance || 0),
                  exposure: Number(wData.exposure || 0),
                  available: Number(wData.available || 0),
                });
              }
            } catch {}

            setLastRoundNotice({
              winner: data.result,
              dragonCard: data.dragonCard,
              tigerCard: data.tigerCard,
            });
          }
        }

        prevRoundPhase.current = data.phase || data.status;
        prevRoundId.current = data.roundId;
      }
    } catch {}
  }, [onWalletUpdate]);

  useEffect(() => {
    fetchRound();
    const interval = setInterval(fetchRound, 1000);
    return () => clearInterval(interval);
  }, [fetchRound]);

  // Smooth local 1-second countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setRoundState((prev) => {
        if (!prev || !prev.bettingOpen || prev.timeRemaining <= 0) return prev;
        const nextTime = Math.max(0, prev.timeRemaining - 1);
        if (nextTime === 0) {
          setBetSlip(null); // Auto close bet slip when timer reaches 0
        }
        return {
          ...prev,
          timeRemaining: nextTime,
          bettingOpen: nextTime > 0,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isBettingActive = Boolean(
    roundState.bettingOpen &&
    roundState.timeRemaining > 0 &&
    roundState.status === 'BETTING_OPEN'
  );

  const handleOpenBetSlip = (betType, odds, title = betType) => {
    if (!isBettingActive) return;
    setBetSlip({ betType: betType.toUpperCase(), odds, title });
    setBetAmount(prev => (prev > 0 ? prev : 100));
    setTimeout(() => {
      betSlipRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  const handlePlaceBet = async (betType, amount) => {
    if (!isBettingActive) {
      showToast('Betting is closed for this round!', 'error');
      setBetSlip(null);
      return;
    }
    const currentBal = wallet?.balance ?? 0;
    const currentExp = wallet?.exposure ?? 0;
    const available = wallet?.available ?? (currentBal + currentExp);

    if (available < amount) {
      showToast(`Insufficient balance! Available: ₹${available}, Required: ₹${amount}`, 'error');
      return;
    }

    setBetLoading(true);
    try {
      const res = await fetch('/api/game/bet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roundId: roundState.roundId,
          betType: betType.toUpperCase(),
          amount,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to place bet', 'error');
        setBetLoading(false);
        return;
      }

      onWalletUpdate?.({
        ...wallet,
        balance: data.balance,
        exposure: data.exposure,
        available: data.available,
      });

      showToast(`✅ Bet Placed: ₹${amount} on ${betType.toUpperCase()}! (Balance: ₹${data.balance}, EXP: ${data.exposure})`, 'success');
      setBetLoading(false);
      setBetSlip(null);
    } catch {
      showToast('Network error placing bet', 'error');
      setBetLoading(false);
    }
  };

  const cardsRow1 = ['A', '2', '3', '4', '5', '6', '7', '8', '9'];
  const cardsRow2 = ['10', 'J', 'Q', 'K'];

  const lastResults = roundState.history && roundState.history.length > 0
    ? roundState.history.map(h => h.result)
    : ['D', 'T', 'T', 'T', 'T', 'D', 'T', 'T', 'T', 'D'];

  const timeRemaining = isBettingActive ? (roundState.timeRemaining || 0) : 0;
  const tensDigit = Math.floor(timeRemaining / 10);
  const onesDigit = timeRemaining % 10;

  return (
    <div className="w-full min-h-screen bg-[#07131e] flex flex-col items-center select-none text-slate-900">
      <div className="w-full max-w-full md:max-w-2xl lg:max-w-3xl min-h-screen bg-[#f0f3f6] flex flex-col relative shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-x border-slate-700/30 pb-16">
      {/* Toast Banner */}
      {toastMessage && (
        <div className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-xs font-bold shadow-lg transition-all animate-bounce ${
          toastMessage.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          {toastMessage.text}
        </div>
      )}

      {/* Round Settled Victory Notice */}
      {lastRoundNotice && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#19354d] border-2 border-amber-400 text-white px-5 py-2.5 rounded-xl text-center shadow-2xl animate-scaleUp flex flex-col items-center">
          <p className="font-extrabold text-[13px] uppercase tracking-wider text-amber-300">
            🎉 Round Result: {lastRoundNotice.winner} WON!
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[11px] font-bold text-slate-300">Dragon</span>
            <div className="w-[22px] h-[28px] rounded-[2px] overflow-hidden border border-[#fbbf24] bg-white">
              <Image
                src={getCardImageUrl(lastRoundNotice.dragonCard)}
                alt={lastRoundNotice.dragonCard || 'Dragon'}
                width={66}
                height={80}
                unoptimized
                className="w-full h-full object-fill"
              />
            </div>
            <span className="text-[10px] text-slate-400 font-bold">vs</span>
            <div className="w-[22px] h-[28px] rounded-[2px] overflow-hidden border border-[#fbbf24] bg-white">
              <Image
                src={getCardImageUrl(lastRoundNotice.tigerCard)}
                alt={lastRoundNotice.tigerCard || 'Tiger'}
                width={66}
                height={80}
                unoptimized
                className="w-full h-full object-fill"
              />
            </div>
            <span className="text-[11px] font-bold text-slate-300">Tiger</span>
          </div>
        </div>
      )}

      {/* 1. Header Bar */}
      <header className="bg-[#3982b8] text-white px-3 pt-2.5 pb-2 flex items-center justify-between border-b border-black/20">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="w-7 h-7 flex items-center justify-center text-white hover:text-blue-200 transition-colors cursor-pointer"
            aria-label="Back to Lobby"
            title="Back to Lobby"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </button>
          <span className="font-['Bebas_Neue',sans-serif] text-[32px] tracking-[0.03em] leading-none text-white uppercase font-normal pt-0.5">
            ALLPANEL<span className="text-amber-300">8</span>
          </span>
        </div>

        <div className="flex flex-col items-end leading-tight text-right">
          <div className="text-[12.5px] font-bold text-white tracking-tight">
            Balance:{wallet?.balance ?? 0}
          </div>
          <div
            onClick={onLogout}
            title="Click to Logout"
            className="text-[12.5px] text-white font-bold flex items-center gap-1 cursor-pointer mt-0.5 hover:text-blue-100"
          >
            <span>Exp:{wallet?.exposure ?? 0}</span>
            <span className="ml-1">{user?.username || 'Demo'}</span>
            <svg className="w-3 h-3 text-white inline" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </header>

      {/* 2. Marquee / Search Bar */}
      <div className="bg-[#296894] text-white px-2.5 py-1 flex items-center gap-2 text-[12px] border-b border-black/20">
        <div className="flex items-center justify-center w-5 h-5 rounded bg-[#1e4e70] text-white shrink-0">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z" />
          </svg>
        </div>
        <div className="italic text-slate-100 font-medium truncate tracking-tight text-[12px]">
          Newly Launched Matka Market In Our Exchange
        </div>
      </div>

      {/* 3. Sub-bar 1: 20-20 DRAGON TIGER Rules */}
      <div className="bg-[#3982b8] text-white px-3 py-1.5 flex items-center justify-between font-bold text-[13px] tracking-tight">
        <span className="font-extrabold tracking-wide uppercase">20-20 DRAGON TIGER</span>
        <button type="button" className="underline cursor-pointer hover:text-blue-100 font-medium text-[12px]">
          Rules
        </button>
      </div>

      {/* 4. Sub-bar 2: GAME | PLACED BET (0) | Round ID */}
      <div className="bg-[#19354d] text-white px-3 py-1.5 flex items-center justify-between text-[11px] font-bold border-b border-black/30">
        <div className="flex items-center gap-1.5">
          <span className="tracking-wide">GAME</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-200">PLACED BET (0)</span>
          <span className="text-slate-500">|</span>
        </div>
        <div className="text-slate-300 font-medium tracking-tight">
          Round ID: {roundState.roundId}
        </div>
      </div>

      {/* 4.5 Place Bet Slip - EXACT MATCH TO USER SCREENSHOT (Image 2) */}
      {betSlip && isBettingActive && (
        <div
          ref={betSlipRef}
          className="w-full max-w-[500px] mx-auto bg-[#82baeb] border-b-2 border-[#1e4e70] shadow-xl select-none animate-slideDown transition-all"
        >
          {/* Header bar */}
          <div className="bg-[#0088cc] text-white px-3 py-1.5 flex items-center justify-between font-bold text-[14px]">
            <span className="font-extrabold tracking-wide">Place Bet</span>
            <button
              type="button"
              onClick={() => setBetSlip(null)}
              className="text-white hover:text-blue-200 text-[18px] leading-none font-bold cursor-pointer px-1"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Form body */}
          <div className="p-3">
            {/* Bet Title & Profit */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-slate-900 text-[13.5px] uppercase tracking-wide">
                {betSlip.title}
              </span>
              <div className="text-slate-800 font-bold text-[13px]">
                Profit:{' '}
                <span className="font-black text-slate-950">
                  {Math.max(0, Math.floor((Number(betAmount) || 0) * (parseFloat(betSlip.odds || 1) - 1)))}
                </span>
              </div>
            </div>

            {/* Odds & Amount Inputs */}
            <div className="grid grid-cols-2 gap-3 mb-2.5">
              <div>
                <label className="block text-slate-900 font-bold text-[11px] mb-0.5">Odds</label>
                <input
                  type="text"
                  readOnly
                  value={betSlip.odds}
                  className="w-full bg-white border border-[#6ea4cf] rounded-[2px] h-[32px] px-2 text-slate-900 font-black text-[13px] outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-900 font-bold text-[11px] mb-0.5">Amount</label>
                <input
                  type="number"
                  ref={amountInputRef}
                  value={betAmount || ''}
                  onChange={(e) => setBetAmount(Math.max(0, parseInt(e.target.value || '0', 10)))}
                  placeholder="Amount"
                  className="w-full bg-white border border-[#6ea4cf] rounded-[2px] h-[32px] px-2 text-slate-900 font-black text-[13px] outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Quick Add Chips (2 rows of 3 columns) */}
            <div className="grid grid-cols-3 gap-1.5 mb-2.5">
              {[25, 50, 100, 200, 500, 1000].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setBetAmount((prev) => (Number(prev) || 0) + chip)}
                  className="bg-[#1e4e70] hover:bg-[#163c57] active:scale-95 text-white font-extrabold text-[12px] py-1.5 rounded-[2px] cursor-pointer shadow-xs transition-all text-center"
                >
                  +{chip}
                </button>
              ))}
            </div>

            {/* Action Buttons: Clear, Edit, Reset, Place Bet */}
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => setBetAmount(0)}
                className="bg-white/40 hover:bg-white/70 text-[#0066aa] font-bold text-[12px] py-1.5 rounded-[2px] cursor-pointer transition-all text-center"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => amountInputRef.current?.focus()}
                className="bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-[12px] py-1.5 rounded-[2px] cursor-pointer transition-all text-center"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setBetAmount(100)}
                className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-[12px] py-1.5 rounded-[2px] cursor-pointer transition-all text-center"
              >
                Reset
              </button>
              <button
                type="button"
                disabled={betLoading || !isBettingActive || betAmount < 10}
                onClick={() => handlePlaceBet(betSlip.betType, betAmount)}
                className="bg-[#28a745] hover:bg-[#218838] active:scale-95 text-white font-black text-[12.5px] py-1.5 rounded-[2px] cursor-pointer transition-all text-center shadow disabled:opacity-50"
              >
                {betLoading ? 'Placing...' : 'Place Bet'}
              </button>
            </div>

            {/* Footer info: Range */}
            <div className="text-[11px] text-slate-800 font-semibold tracking-tight">
              Range: 100 to 3L
            </div>
          </div>
        </div>
      )}

      {/* 5. Live Stream Card Table Area - EXACT MATCH TO ATTACHED SCREENSHOT */}
      <div className="w-full h-[210px] sm:h-[250px] md:h-[290px] bg-black relative overflow-hidden select-none">
        {/* Top-Left: Two Cards (Dragon on left, Tiger on right) */}
        <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
          <TableStreamCard cardStr={roundState.dragonCard} />
          <TableStreamCard cardStr={roundState.tigerCard} />
        </div>

        {/* Status Badge in stream overlay */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
          {roundState.phase === 'DRAGON_REVEAL' && (
            <span className="bg-amber-500 text-black text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded shadow animate-pulse">
              DEALING: DRAGON CARD
            </span>
          )}
          {roundState.phase === 'TIGER_REVEAL' && (
            <span className="bg-amber-500 text-black text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded shadow animate-pulse">
              DEALING: TIGER CARD
            </span>
          )}
          {roundState.phase === 'RESULT_HOLD' && (
            <span className="bg-emerald-500 text-white text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded shadow animate-bounce">
              ROUND SETTLED
            </span>
          )}
          {roundState.bettingOpen && (
            <span className="bg-[#1e8f82] text-white text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded shadow">
              BETTING OPEN
            </span>
          )}
        </div>

        {/* Bottom-Right: Countdown Timer Badges */}
        <div className="absolute bottom-2 right-2 flex items-center gap-[3px] z-10">
          {roundState.bettingOpen ? (
            <>
              <div className="w-[21px] h-[26px] sm:w-[23px] sm:h-[28px] rounded-[5px] bg-[#1e8f82] border-t border-[#3fc4b4]/50 shadow-[0_2px_4px_rgba(0,0,0,0.6)] text-white font-extrabold text-[16px] sm:text-[18px] flex items-center justify-center leading-none select-none tracking-tight">
                {tensDigit}
              </div>
              <div className="w-[21px] h-[26px] sm:w-[23px] sm:h-[28px] rounded-[5px] bg-[#1e8f82] border-t border-[#3fc4b4]/50 shadow-[0_2px_4px_rgba(0,0,0,0.6)] text-white font-extrabold text-[16px] sm:text-[18px] flex items-center justify-center leading-none select-none tracking-tight">
                {onesDigit}
              </div>
            </>
          ) : (
            <div className="bg-red-600/90 border border-red-400 text-white font-black text-[10px] sm:text-[11px] px-2 py-1 rounded shadow flex items-center gap-1">
              <span>🔒 SUSPENDED</span>
            </div>
          )}
        </div>
      </div>

      {/* 6. Main Betting Row (Dragon, Tie, Tiger, Pair) */}
      <div className="w-full bg-white px-2 pt-1.5 pb-2 border-b border-slate-200 relative">
        {!isBettingActive && (
          <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[0.5px] z-20 flex items-center justify-center pointer-events-none">
            <span className="bg-red-600 text-white font-black text-[12px] sm:text-[13px] px-3.5 py-1 rounded shadow-lg uppercase tracking-wider animate-pulse">
              BETTING SUSPENDED
            </span>
          </div>
        )}
        <div className="flex items-stretch gap-1">
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-3 text-center font-black text-[13px] text-slate-900 pb-1">
              <div>{isBettingActive ? '2' : '0'}</div>
              <div>{isBettingActive ? '50' : '0'}</div>
              <div>{isBettingActive ? '2' : '0'}</div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { name: 'Dragon', odds: '2' },
                { name: 'Tie', odds: '50' },
                { name: 'Tiger', odds: '2' },
              ].map((bet) => (
                <button
                  key={bet.name}
                  type="button"
                  disabled={!isBettingActive}
                  onClick={() => handleOpenBetSlip(bet.name, bet.odds)}
                  className={`py-2 rounded-[2px] font-extrabold text-[14px] text-white shadow-xs transition-all flex items-center justify-center ${
                    !isBettingActive
                      ? 'bg-[#273843] text-slate-400 cursor-not-allowed'
                      : betSlip?.betType === bet.name.toUpperCase()
                      ? 'bg-[#247c73] ring-2 ring-teal-400 scale-[1.02] cursor-pointer'
                      : 'bg-[#207068] hover:bg-[#1b615a] active:scale-95 cursor-pointer'
                  }`}
                >
                  {isBettingActive ? bet.name : (
                    <span className="flex items-center justify-center gap-1">
                      <span className="opacity-40 text-[13px]">{bet.name}</span>
                      <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="w-[2px] bg-[#207068]/30 mx-0.5 rounded-full my-1"></div>

          <div className="w-[84px] flex flex-col">
            <div className="text-center font-black text-[13px] text-slate-900 pb-1">
              {isBettingActive ? '12' : '0'}
            </div>
            <button
              type="button"
              disabled={!isBettingActive}
              onClick={() => handleOpenBetSlip('Pair', '12')}
              className={`py-2 rounded-[2px] font-extrabold text-[14px] text-white shadow-xs transition-all flex items-center justify-center ${
                !isBettingActive
                  ? 'bg-[#273843] text-slate-400 cursor-not-allowed'
                  : betSlip?.betType === 'PAIR'
                  ? 'bg-[#247c73] ring-2 ring-teal-400 scale-[1.02] cursor-pointer'
                  : 'bg-[#207068] hover:bg-[#1b615a] active:scale-95 cursor-pointer'
              }`}
            >
              {isBettingActive ? 'Pair' : (
                <span className="flex items-center justify-center gap-1">
                  <span className="opacity-40 text-[13px]">Pair</span>
                  <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 7. DRAGON Bets (Even, Odd, Suits) */}
      <div className="w-full bg-[#f8f9fa] px-2 py-2 border-b border-slate-200">
        <div className="text-center font-black text-[13.5px] text-slate-900 tracking-wider mb-1">
          DRAGON
        </div>
        <div className="grid grid-cols-4 text-center font-bold text-[12.5px] text-slate-800 pb-1">
          <div>{isBettingActive ? '2.1' : '0'}</div>
          <div>{isBettingActive ? '1.79' : '0'}</div>
          <div>{isBettingActive ? '1.95' : '0'}</div>
          <div>{isBettingActive ? '1.95' : '0'}</div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: 'Dragon-Even', label: 'Even', odds: '2.1' },
            { id: 'Dragon-Odd', label: 'Odd', odds: '1.79' },
            { id: 'Dragon-Red', label: '♥ ♦', isRed: true, odds: '1.95' },
            { id: 'Dragon-Black', label: '♠ ♣', odds: '1.95' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={!isBettingActive}
              onClick={() => handleOpenBetSlip(item.id, item.odds, item.label)}
              className={`py-2 rounded-[2px] font-extrabold text-[13.5px] shadow-xs transition-all flex items-center justify-center ${
                !isBettingActive
                  ? 'bg-[#273843] text-slate-400 cursor-not-allowed'
                  : betSlip?.betType === item.id.toUpperCase()
                  ? 'bg-[#247c73] ring-2 ring-teal-400 text-white cursor-pointer'
                  : 'bg-[#207068] hover:bg-[#1b615a] text-white active:scale-95 cursor-pointer'
              }`}
            >
              {isBettingActive ? (
                item.isRed ? (
                  <span className="text-[#ff7b7b] text-[15px] flex items-center gap-1">
                    <span>♥</span><span>♦</span>
                  </span>
                ) : (
                  <span>{item.label}</span>
                )
              ) : (
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 8. TIGER Bets (Even, Odd, Suits) */}
      <div className="w-full bg-[#f8f9fa] px-2 py-2 border-b border-slate-200">
        <div className="text-center font-black text-[13.5px] text-slate-900 tracking-wider mb-1">
          TIGER
        </div>
        <div className="grid grid-cols-4 text-center font-bold text-[12.5px] text-slate-800 pb-1">
          <div>{isBettingActive ? '2.1' : '0'}</div>
          <div>{isBettingActive ? '1.79' : '0'}</div>
          <div>{isBettingActive ? '1.95' : '0'}</div>
          <div>{isBettingActive ? '1.95' : '0'}</div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: 'Tiger-Even', label: 'Even', odds: '2.1' },
            { id: 'Tiger-Odd', label: 'Odd', odds: '1.79' },
            { id: 'Tiger-Red', label: '♥ ♦', isRed: true, odds: '1.95' },
            { id: 'Tiger-Black', label: '♠ ♣', odds: '1.95' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={!isBettingActive}
              onClick={() => handleOpenBetSlip(item.id, item.odds, item.label)}
              className={`py-2 rounded-[2px] font-extrabold text-[13.5px] shadow-xs transition-all flex items-center justify-center ${
                !isBettingActive
                  ? 'bg-[#273843] text-slate-400 cursor-not-allowed'
                  : betSlip?.betType === item.id.toUpperCase()
                  ? 'bg-[#247c73] ring-2 ring-teal-400 text-white cursor-pointer'
                  : 'bg-[#207068] hover:bg-[#1b615a] text-white active:scale-95 cursor-pointer'
              }`}
            >
              {isBettingActive ? (
                item.isRed ? (
                  <span className="text-[#ff7b7b] text-[15px] flex items-center gap-1">
                    <span>♥</span><span>♦</span>
                  </span>
                ) : (
                  <span>{item.label}</span>
                )
              ) : (
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 9. DRAGON 12 Cards Box */}
      <div className="bg-white border border-slate-300 rounded-[2px] p-2.5 mx-2 my-2 shadow-xs">
        <div className="text-center font-extrabold text-[13px] text-slate-800 uppercase tracking-wide mb-2">
          {isBettingActive ? 'DRAGON 12' : 'DRAGON 0'}
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {cardsRow1.map((rank) => (
              <MiniCard
                key={rank}
                rank={rank}
                locked={!isBettingActive}
                selected={betSlip?.betType === `DRAGON12-${rank}`}
                onClick={() => handleOpenBetSlip(`Dragon12-${rank}`, '12', `Dragon ${rank}`)}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-1">
            {cardsRow2.map((rank) => (
              <MiniCard
                key={rank}
                rank={rank}
                locked={!isBettingActive}
                selected={betSlip?.betType === `DRAGON12-${rank}`}
                onClick={() => handleOpenBetSlip(`Dragon12-${rank}`, '12', `Dragon ${rank}`)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 10. TIGER 12 Cards Box */}
      <div className="bg-white border border-slate-300 rounded-[2px] p-2.5 mx-2 my-1 shadow-xs">
        <div className="text-center font-extrabold text-[13px] text-slate-800 uppercase tracking-wide mb-2">
          {isBettingActive ? 'TIGER 12' : 'TIGER 0'}
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {cardsRow1.map((rank) => (
              <MiniCard
                key={rank}
                rank={rank}
                locked={!isBettingActive}
                selected={betSlip?.betType === `TIGER12-${rank}`}
                onClick={() => handleOpenBetSlip(`Tiger12-${rank}`, '12', `Tiger ${rank}`)}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-1">
            {cardsRow2.map((rank) => (
              <MiniCard
                key={rank}
                rank={rank}
                locked={!isBettingActive}
                selected={betSlip?.betType === `TIGER12-${rank}`}
                onClick={() => handleOpenBetSlip(`Tiger12-${rank}`, '12', `Tiger ${rank}`)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 11. Last Result Bar */}
      <div className="w-full mt-2">
        <div className="bg-[#4aaca0] text-white px-3 py-1.5 flex items-center justify-between font-bold text-[12.5px]">
          <span className="tracking-wide">Last Result</span>
          <button type="button" className="underline cursor-pointer hover:text-teal-100 font-medium text-[11.5px]">
            View All
          </button>
        </div>
        <div className="bg-white px-3 py-2 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-200">
          {lastResults.map((res, rIdx) => {
            const letter = res ? String(res)[0].toUpperCase() : '-';
            const isD = letter === 'D';
            const isT = letter === 'T';
            return (
              <div
                key={rIdx}
                className={`w-6 h-6 rounded-full font-black text-[12px] text-white flex items-center justify-center shadow-xs shrink-0 ${
                  isD
                    ? 'bg-[#1f5f38]'
                    : isT
                    ? 'bg-[#355e3b]'
                    : 'bg-[#d97706]'
                }`}
              >
                {letter}
              </div>
            );
          })}
        </div>
      </div>

      {/* 12. Footer Section */}
      <footer className="w-full flex flex-col mt-auto">
        <div className="bg-[#204867] text-white px-5 pt-4 pb-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[13px] font-bold tracking-tight">
            <a href="#" className="underline hover:text-blue-200">
              Terms and Conditions
            </a>
            <a href="#" className="underline hover:text-blue-200">
              Responsible Gaming
            </a>
          </div>
          <div className="text-center font-['Bebas_Neue',sans-serif] text-[26px] tracking-wide text-white uppercase font-normal pt-1">
            24X7 Support
          </div>
        </div>

        <div className="bg-white text-slate-900 px-4 pt-4 pb-3 flex flex-col items-center gap-2.5">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/ssl_badge.png"
              alt="Secure SSL Encryption"
              width={133}
              height={65}
              unoptimized
              className="h-[40px] w-auto shrink-0 block"
            />
            <div className="flex flex-col text-left leading-tight">
              <span className="font-extrabold text-[13px] text-black tracking-tight">
                100% SAFE
              </span>
              <span className="text-[11.5px] text-slate-800 font-medium leading-snug mt-0.5">
                Protected connection and encrypted data.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center my-0.5">
            <Image
              src="/compliance_badges.png"
              alt="18+, GamCare, Gambling Therapy"
              width={135}
              height={45}
              unoptimized
              className="h-[30px] w-auto block"
            />
          </div>

          <p className="text-[11px] font-medium text-slate-900 text-center tracking-tight leading-tight">
            © Copyright 2026. All Rights Reserved. Powered by ALLPANEL8.
          </p>

          <div className="w-10 h-[3px] bg-slate-300 rounded-full mx-auto mt-0.5"></div>
        </div>
      </footer>
      </div>
    </div>
  );
}


export default function Home() {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState({ balance: 0, exposure: 0, available: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Mandatory password change state
  const [mustChangePasswordOpen, setMustChangePasswordOpen] = useState(false);
  const [changePassForm, setChangePassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [changePassError, setChangePassError] = useState('');
  const [changePassLoading, setChangePassLoading] = useState(false);

  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [activeGameView, setActiveGameView] = useState(false);
  const [activeCategory, setActiveCategory] = useState('CRASH'); // 'CRASH' | 'SPORTS' | 'OUR CASINO'
  const [activeSport, setActiveSport] = useState('CRICKET');
  const [activeVipCasinoTab, setActiveVipCasinoTab] = useState('OUR CASINO');
  const [activeCasinoFilter, setActiveCasinoFilter] = useState('ALL CASINO');

  const fetchWallet = useCallback(async () => {
    try {
      const res = await fetch('/api/wallet');
      if (res.ok) {
        const data = await res.json();
        setWallet({
          balance: Number(data.balance || 0),
          exposure: Number(data.exposure || 0),
          available: Number(data.available || 0),
        });
      }
    } catch {}
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          setWallet(data.wallet || { balance: 0, exposure: 0, available: 0 });
          setIsLoggedIn(true);
          if (data.user.mustChangePassword && data.user.username !== 'user_a' && !data.user.username?.startsWith('demo')) {
            setMustChangePasswordOpen(true);
          }
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = async (e, customUser = null, customPass = null) => {
    if (e) e.preventDefault();
    const loginUsername = customUser || username;
    const loginPassword = customPass || password;

    if (!loginUsername || !loginPassword) {
      setAuthError('Please enter username and password');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Login failed');
        setAuthLoading(false);
        return;
      }
      setUser(data.user);
      setWallet(data.wallet || { balance: 0, exposure: 0, available: 0 });
      setIsLoggedIn(true);
      if (data.user.mustChangePassword && data.user.username !== 'user_a' && !data.user.username?.startsWith('demo')) {
        setMustChangePasswordOpen(true);
      }
      setAuthLoading(false);
    } catch {
      setAuthError('Network error connecting to server');
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setIsLoggedIn(false);
    setUser(null);
    setWallet({ balance: 0, exposure: 0, available: 0 });
    setActiveGameView(false);
    setMustChangePasswordOpen(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePassError('');
    if (changePassForm.newPassword !== changePassForm.confirmPassword) {
      setChangePassError('New passwords do not match');
      return;
    }
    if (changePassForm.newPassword.length < 6) {
      setChangePassError('New password must be at least 6 characters');
      return;
    }
    setChangePassLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changePassForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setChangePassError(data.error || 'Failed to update password');
        setChangePassLoading(false);
        return;
      }
      setMustChangePasswordOpen(false);
      setUser(prev => ({ ...prev, mustChangePassword: false }));
      setChangePassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setChangePassLoading(false);
      fetchWallet();
    } catch {
      setChangePassError('Network error');
      setChangePassLoading(false);
    }
  };

  // Filter games based on selected tab: DRAGON TIGER shows ONLY dt20.jpg 4 times
  const displayedGames = (() => {
    if (activeCasinoFilter === 'DRAGON TIGER') {
      return dragonTigerGames;
    }
    if (activeCasinoFilter === 'ALL CASINO') {
      return allCasinoGames;
    }
    if (activeCasinoFilter === 'ROULETTE') {
      return allCasinoGames.filter((g) => g.type === 'ROULETTE');
    }
    if (activeCasinoFilter === 'TEENPATTI' || activeCasinoFilter === 'POKER') {
      return allCasinoGames.filter((g) => g.type === 'TEENPATTI');
    }
    const filtered = allCasinoGames.filter((g) => g.type === activeCasinoFilter);
    return filtered.length > 0 ? filtered : allCasinoGames;
  })();

  const handleDemoLogin = () => {
    handleLogin(null, 'user_a', 'User@123');
  };

  if (isLoggedIn && activeGameView) {
    return (
      <DragonTigerScreen
        onBack={() => setActiveGameView(false)}
        user={user}
        wallet={wallet}
        onWalletUpdate={setWallet}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#07131e] flex justify-center items-start">
      {/* Responsive Viewport */}
      <div className="w-full max-w-[500px] md:max-w-2xl lg:max-w-3xl min-h-screen bg-[#204867] flex flex-col relative shadow-[0_4px_35px_rgba(0,0,0,0.5)] overflow-hidden">

        {!isLoggedIn ? (
          /* ============================================================
             SCREEN 0: Exact Login Page
             ============================================================ */
          <div className="w-full min-h-screen bg-gradient-to-b from-[#204867] via-[#2d6b99] to-[#3982b8] flex flex-col justify-between select-none animate-fadeIn">
            {/* Top Logo & Login Card */}
            <div className="w-full flex flex-col items-center pt-8 px-5">
              {/* ALLPANEL8 Logo */}
              <h1 className="font-['Bebas_Neue',sans-serif] text-[52px] tracking-[0.03em] text-white leading-none mb-6 text-center">
                ALLPANEL<span className="text-amber-300">8</span>
              </h1>

              {/* Login Card */}
              <div className="w-full max-w-[360px] bg-white rounded-md p-4 shadow-[0_6px_25px_rgba(0,0,0,0.22)] flex flex-col gap-3.5">
                {/* Title */}
                <div className="flex items-center justify-center gap-1.5 text-[#3982b8] font-bold text-[17px]">
                  <span>Login</span>
                  <svg className="w-4 h-4 fill-[#3982b8]" viewBox="0 0 24 24">
                    <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                </div>

                {authError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-semibold text-center">
                    {authError}
                  </div>
                )}

                {/* Username Input */}
                <div className="flex items-stretch border border-slate-300 rounded overflow-hidden focus-within:border-[#3982b8]">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 px-3 py-2 text-[14px] text-slate-800 outline-none placeholder:text-slate-400 font-medium"
                  />
                  <div className="bg-[#f0f3f6] px-3 py-2 border-l border-slate-300 text-slate-600 flex items-center justify-center">
                    <svg className="w-4 h-4 fill-slate-700" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>

                {/* Password Input */}
                <div className="flex items-stretch border border-slate-300 rounded overflow-hidden focus-within:border-[#3982b8]">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 px-3 py-2 text-[14px] text-slate-800 outline-none placeholder:text-slate-400 font-medium"
                  />
                  <div className="bg-[#f0f3f6] px-3 py-2 border-l border-slate-300 text-slate-600 flex items-center justify-center">
                    <svg className="w-4 h-4 fill-slate-700" viewBox="0 0 24 24">
                      <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="button"
                  disabled={authLoading}
                  onClick={handleLogin}
                  className="w-full bg-[#3982b8] hover:bg-[#2e6f9b] active:scale-[0.99] text-white font-bold text-[14px] py-2.5 px-4 rounded flex items-center justify-center relative cursor-pointer transition-all shadow-sm disabled:opacity-70"
                >
                  <span>{authLoading ? 'Logging in...' : 'Login'}</span>
                  <svg className="w-4 h-4 fill-white absolute right-3" viewBox="0 0 24 24">
                    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                  </svg>
                </button>

                {/* Login with demo ID Button */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full bg-[#296894] hover:bg-[#24577c] active:scale-[0.99] text-white font-bold text-[14px] py-2.5 px-4 rounded flex items-center justify-center relative cursor-pointer transition-all shadow-sm"
                >
                  <span>Login with Demo ID</span>
                  <svg className="w-4 h-4 fill-white absolute right-3" viewBox="0 0 24 24">
                    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bottom Footer */}
            <footer className="w-full bg-[#204867] text-white px-5 pt-3 pb-3 flex flex-col gap-1.5 mt-auto">
              <div className="flex items-center justify-between text-[12px] font-bold tracking-tight">
                <a href="#" className="underline hover:text-blue-200">
                  Terms and Conditions
                </a>
                <a href="#" className="underline hover:text-blue-200">
                  Responsible Gaming
                </a>
              </div>
              <div className="text-center font-['Bebas_Neue',sans-serif] text-[24px] tracking-wide text-white uppercase font-normal">
                24X7 Support
              </div>
            </footer>
          </div>
        ) : isPromoOpen ? (
          /* ============================================================
             SCREEN 1: Phishing Warning Banner + start_img.png
             ============================================================ */
          <div className="w-full flex flex-col animate-fadeIn">
            {/* Top Phishing Warning Banner */}
            <aside
              role="alert"
              className="w-full bg-[#204867] text-white px-3 py-2 flex items-center justify-between gap-2 text-[13px] leading-tight font-semibold border-b border-black/30 z-30 select-none"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-amber-400 text-sm flex-shrink-0" aria-hidden="true">
                  ⚠️
                </span>
                <p className="text-white tracking-tight leading-snug break-words">
                  Beware Of Phishing Websites Before Login. Enable Security Auth To Secure Your ID.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPromoOpen(false)}
                className="text-slate-300 hover:text-white transition-colors p-1 flex-shrink-0 flex items-center justify-center rounded cursor-pointer"
                aria-label="Close"
                title="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </aside>

            {/* Poster Image */}
            <div className="w-full relative bg-black flex flex-col">
              <Image
                src="/start_img.png"
                alt="WTT Star Contender Astana 2026 Table Tennis"
                width={1080}
                height={1920}
                priority
                unoptimized
                style={{ width: '100%', height: 'auto', display: 'block' }}
                className="w-full h-auto block select-none pointer-events-auto"
              />
            </div>
          </div>
        ) : (
           /* ============================================================
             SCREEN 2: ALL Dashboard
             ============================================================ */
          <div className="w-full flex flex-col bg-[#f0f3f6] text-slate-900 select-none animate-fadeIn">
            
            {/* 1. Top Header Bar using #3982b8 */}
            <header className="bg-[#3982b8] text-white px-3 pt-2.5 pb-2 flex items-center justify-between border-b border-black/20">
              <div className="flex items-center gap-2.5">
                {/* 3-line Hamburger Menu */}
                <button
                  type="button"
                  className="flex flex-col justify-center items-center gap-[3.5px] w-6 h-6 cursor-pointer"
                  aria-label="Menu"
                >
                  <span className="w-[22px] h-[3.5px] bg-white rounded-[2px] block"></span>
                  <span className="w-[22px] h-[3.5px] bg-white rounded-[2px] block"></span>
                  <span className="w-[22px] h-[3.5px] bg-white rounded-[2px] block"></span>
                </button>
                {/* ALLPANEL8 Logo */}
                <span className="font-['Bebas_Neue',sans-serif] text-[34px] tracking-[0.03em] leading-none text-white uppercase font-normal pt-0.5">
                  ALLPANEL<span className="text-amber-300">8</span>
                </span>
              </div>

              {/* User Balance & Mode */}
              <div className="flex flex-col items-end leading-tight text-right">
                <div className="text-[13px] font-bold text-white tracking-tight">
                  Balance:{wallet?.balance ?? 0}
                </div>
                <div
                  onClick={handleLogout}
                  title="Logout / Return to Login"
                  className="text-[13px] text-white font-bold flex items-center gap-1.5 cursor-pointer mt-0.5 hover:text-blue-200 transition-colors"
                >
                  <span>Exp:{wallet?.exposure ?? 0}</span>
                  <span className="ml-1">{user?.username || 'Player'}</span>
                  <svg
                    className="w-3.5 h-3.5 text-white inline"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </header>

            {/* 2. Search Bar & Filter Chips Row using #3982b8 */}
            <div className="bg-[#3982b8] px-3 pb-2 pt-1 flex flex-col gap-1.5">
              {/* Search input with zoom-in (+) icon */}
              <div className="flex items-center gap-2.5 w-full">
                <svg
                  className="w-5 h-5 text-white shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="10" cy="10" r="6.5" />
                  <line x1="21" y1="21" x2="14.8" y2="14.8" strokeLinecap="round" strokeWidth="3" />
                  <line x1="10" y1="7.2" x2="10" y2="12.8" strokeLinecap="round" strokeWidth="2" />
                  <line x1="7.2" y1="10" x2="12.8" y2="10" strokeLinecap="round" strokeWidth="2" />
                </svg>

                <div className="bg-[#296894] rounded-[2px] h-[30px] flex items-center px-2.5 w-full text-[12.5px] italic text-[#e5edf1] tracking-tight">
                  <span>Newly Launched Matka Market In Our Exchange</span>
                </div>
              </div>

              {/* Filter Chips: using #24587d */}
              <div className="flex items-stretch gap-1.5 pt-0.5">
                {/* Chip 1: AZERBAIJAN GRAND ... */}
                <div className="bg-[#24587d] hover:bg-[#1f4a6b] text-white px-2.5 py-1.5 rounded-[2px] text-[12px] font-bold flex items-center gap-2 flex-1 min-w-0 cursor-pointer shadow-xs transition-colors">
                  <svg className="w-4 h-4 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="5.5" cy="17.5" r="3.5" />
                    <circle cx="18.5" cy="17.5" r="3.5" />
                    <path d="M15 6h-3l-2.5 5.5H5.5" strokeLinecap="round" />
                    <path d="M12 11.5l3.5 6" strokeLinecap="round" />
                    <path d="M7 17.5l3-6" strokeLinecap="round" />
                    <path d="M18.5 17.5l-3-6" strokeLinecap="round" />
                    <circle cx="16" cy="5" r="1.5" fill="currentColor" />
                  </svg>
                  <span className="truncate tracking-tight uppercase font-extrabold">AZERBAIJAN GRAND ...</span>
                </div>

                {/* Chip 2: Levante v Athletic Bil... */}
                <div className="bg-[#24587d] hover:bg-[#1f4a6b] text-white px-2.5 py-1.5 rounded-[2px] text-[12px] font-bold flex items-center gap-2 flex-1 min-w-0 cursor-pointer shadow-xs transition-colors">
                  <svg className="w-4 h-4 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="9" />
                    <polygon points="12,8 15,10 14,14 10,14 9,10" fill="currentColor" />
                    <line x1="12" y1="8" x2="12" y2="3" />
                    <line x1="15" y1="10" x2="20" y2="8" />
                    <line x1="14" y1="14" x2="18" y2="18" />
                    <line x1="10" y1="14" x2="6" y2="18" />
                    <line x1="9" y1="10" x2="4" y2="8" />
                  </svg>
                  <span className="truncate tracking-tight font-extrabold">Levante v Athletic Bil...</span>
                </div>
              </div>

              {/* Bottom indicator border line */}
              <div className="w-full flex justify-center pt-0.5">
                <div className="w-14 h-[2px] bg-white/70 rounded-full"></div>
              </div>
            </div>

            {/* 3. Main Game Categories Bar using #19354d & #3982b8 */}
            <nav className="bg-[#19354d] text-white flex items-stretch overflow-x-auto no-scrollbar border-b border-black/30 text-[12px] font-bold uppercase tracking-tight select-none">
              {/* CRASH */}
              <div
                onClick={() => setActiveCategory('CRASH')}
                className={`flex items-center gap-1.5 px-3 py-2 border-r border-slate-600/40 shrink-0 cursor-pointer hover:bg-white/5 relative ${
                  activeCategory === 'CRASH' ? 'bg-[#3982b8]' : ''
                }`}
              >
                {activeCategory === 'CRASH' && (
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white"></div>
                )}
                <svg className="w-5 h-4 text-[#e52538] fill-current" viewBox="0 0 28 16">
                  <path d="M26 10.5h-1.5L20 7V2.5c0-.8-.7-1.5-1.5-1.5S17 1.7 17 2.5V7l-8 2.5V5.5l1.5-1V3l-3.5 1-3.5-1v1.5l1.5 1V10L1 11v1.5l4-.8v1.8l-1.5 1.5V16l3-1 3 1v-1.2l-1.5-1.5v-2.5l9-2v3.5l-1.5 1.5V16l3-1 3 1v-1.2l-1.5-1.5v-4l5.5-1.2h2v-1.6z" />
                </svg>
                <span className="text-white">CRASH</span>
              </div>

              {/* LOTTERY */}
              <div
                onClick={() => setActiveCategory('LOTTERY')}
                className={`flex items-center px-3 py-2 border-r border-slate-600/40 shrink-0 cursor-pointer hover:bg-white/5 relative ${
                  activeCategory === 'LOTTERY' ? 'bg-[#3982b8]' : ''
                }`}
              >
                {activeCategory === 'LOTTERY' && (
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white"></div>
                )}
                LOTTERY
              </div>

              {/* SPORTS */}
              <div
                onClick={() => setActiveCategory('SPORTS')}
                className={`flex items-center px-3 py-2 border-r border-slate-600/40 shrink-0 cursor-pointer hover:bg-white/5 relative ${
                  activeCategory === 'SPORTS' ? 'bg-[#3982b8]' : ''
                }`}
              >
                {activeCategory === 'SPORTS' && (
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white"></div>
                )}
                SPORTS
              </div>

              {/* OUR CASINO */}
              <div
                onClick={() => setActiveCategory('OUR CASINO')}
                className={`flex flex-col justify-center items-center px-2.5 py-1 border-r border-slate-600/40 shrink-0 cursor-pointer leading-[1.15] text-center relative ${
                  activeCategory === 'OUR CASINO' ? 'bg-[#3982b8]' : 'hover:bg-white/5'
                } text-[10.5px]`}
              >
                {activeCategory === 'OUR CASINO' && (
                  <div className="absolute top-0 left-2 right-2 h-[2.5px] bg-white"></div>
                )}
                <span>OUR</span>
                <span>CASINO</span>
              </div>

              {/* LIVE CASINO */}
              <div
                onClick={() => setActiveCategory('LIVE CASINO')}
                className={`flex flex-col justify-center items-center px-2.5 py-1 border-r border-slate-600/40 shrink-0 cursor-pointer leading-[1.15] text-center relative ${
                  activeCategory === 'LIVE CASINO' ? 'bg-[#3982b8]' : 'hover:bg-white/5'
                } text-[10.5px]`}
              >
                {activeCategory === 'LIVE CASINO' && (
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white"></div>
                )}
                <span>LIVE</span>
                <span>CASINO</span>
              </div>

              {/* SLOTS */}
              <div
                onClick={() => setActiveCategory('SLOTS')}
                className={`flex items-center px-3 py-2 border-r border-slate-600/40 shrink-0 cursor-pointer hover:bg-white/5 relative ${
                  activeCategory === 'SLOTS' ? 'bg-[#3982b8]' : ''
                }`}
              >
                {activeCategory === 'SLOTS' && (
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white"></div>
                )}
                SLOTS
              </div>

              {/* FANTASY */}
              <div
                onClick={() => setActiveCategory('FANTASY')}
                className={`flex items-center px-3 py-2 shrink-0 cursor-pointer hover:bg-white/5 relative ${
                  activeCategory === 'FANTASY' ? 'bg-[#3982b8]' : ''
                }`}
              >
                {activeCategory === 'FANTASY' && (
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white"></div>
                )}
                FANTASY
              </div>
            </nav>

            {/* ============================================================
               WHEN 'OUR CASINO' IS ACTIVE: 2 SUB-BARS (#3982b8 & #204867)
               ============================================================ */}
            {activeCategory === 'OUR CASINO' ? (
              <div className="flex flex-col w-full animate-fadeIn">
                {/* 1. Sub-bar 1: using #3982b8 */}
                <div className="bg-[#3982b8] text-white flex items-center gap-5 px-3 py-2.5 overflow-x-auto no-scrollbar font-bold text-[12.5px] tracking-tight select-none border-t border-blue-400/30">
                  <span
                    onClick={() => setActiveVipCasinoTab('OUR CASINO')}
                    className={`cursor-pointer shrink-0 uppercase transition-opacity ${
                      activeVipCasinoTab === 'OUR CASINO' ? 'opacity-100 font-extrabold' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    OUR CASINO
                  </span>
                  <span
                    onClick={() => setActiveVipCasinoTab('OUR VIP CASINO')}
                    className={`cursor-pointer shrink-0 uppercase transition-opacity ${
                      activeVipCasinoTab === 'OUR VIP CASINO' ? 'opacity-100 font-extrabold' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    OUR VIP CASINO
                  </span>
                  <span
                    onClick={() => setActiveVipCasinoTab('OUR PREMIUM CASINO')}
                    className={`cursor-pointer shrink-0 uppercase transition-opacity ${
                      activeVipCasinoTab === 'OUR PREMIUM CASINO' ? 'opacity-100 font-extrabold' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    OUR PREMIUM CASINO
                  </span>
                  <span
                    onClick={() => setActiveVipCasinoTab('OUR VIRTUAL')}
                    className={`cursor-pointer shrink-0 uppercase transition-opacity ${
                      activeVipCasinoTab === 'OUR VIRTUAL' ? 'opacity-100 font-extrabold' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    OUR VIRTUAL
                  </span>
                </div>

                {/* 2. Sub-bar 2: using #204867 with all 18 scrollable tabs */}
                <div className="bg-[#204867] text-white flex items-center gap-5 px-3 py-2.5 overflow-x-auto no-scrollbar font-bold text-[12.5px] tracking-tight select-none border-b border-black/30 whitespace-nowrap scroll-smooth">
                  {casinoFilterTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveCasinoFilter(tab)}
                      className={`shrink-0 uppercase transition-all cursor-pointer pb-0.5 ${
                        activeCasinoFilter === tab
                          ? 'text-white border-b-2 border-white font-black'
                          : 'text-slate-200 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ============================================================
                 WHEN 'SPORTS' IS ACTIVE: SHOW SPORTS TABS & EXACT ODDS TABLE
                 ============================================================ */
              <>
                {/* Sports Subcategories Navigation Bar: using #3982b8 */}
                <div className="bg-[#3982b8] text-white flex items-center overflow-x-auto no-scrollbar shadow-inner text-[11px] font-bold uppercase tracking-tight select-none border-t border-blue-400/30">
                  {/* CRICKET */}
                  <div
                    onClick={() => setActiveSport('CRICKET')}
                    className={`flex flex-col items-center justify-center pt-2 pb-1.5 px-4 cursor-pointer shrink-0 min-w-[76px] relative ${
                      activeSport === 'CRICKET' ? 'bg-[#296894]' : ''
                    }`}
                  >
                    {activeSport === 'CRICKET' && (
                      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white"></div>
                    )}
                    <svg className="w-4 h-4 mb-0.5 fill-white" viewBox="0 0 24 24">
                      <circle cx="6" cy="6" r="2.2" />
                      <path d="M19.5 4.5l-2.1-2.1c-.6-.6-1.5-.6-2.1 0L6.8 10.9c-.6.6-.6 1.5 0 2.1l1.5 1.5c.6.6 1.5.6 2.1 0l8.5-8.5c.6-.6.6-1.5 0-2.1l.6.6zM6 13.5l-2.8 2.8c-.4.4-.4 1 0 1.4l1.4 1.4c.4.4 1 .4 1.4 0L8.8 16.3 6 13.5z" />
                    </svg>
                    <span>CRICKET</span>
                  </div>

                  {/* FOOTBALL */}
                  <div
                    onClick={() => setActiveSport('FOOTBALL')}
                    className={`flex flex-col items-center justify-center pt-2 pb-1.5 px-3.5 cursor-pointer shrink-0 min-w-[76px] relative ${
                      activeSport === 'FOOTBALL' ? 'bg-[#296894]' : ''
                    }`}
                  >
                    {activeSport === 'FOOTBALL' && (
                      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white"></div>
                    )}
                    <svg className="w-4 h-4 mb-0.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                    <span>FOOTBALL</span>
                  </div>

                  {/* TENNIS */}
                  <div
                    onClick={() => setActiveSport('TENNIS')}
                    className={`flex flex-col items-center justify-center pt-2 pb-1.5 px-3.5 cursor-pointer shrink-0 min-w-[76px] relative ${
                      activeSport === 'TENNIS' ? 'bg-[#296894]' : ''
                    }`}
                  >
                    {activeSport === 'TENNIS' && (
                      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white"></div>
                    )}
                    <svg className="w-4 h-4 mb-0.5 fill-none stroke-white" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M5.5 5.5c4 4 4 9 0 13M18.5 5.5c-4 4-4 9 0 13" />
                    </svg>
                    <span>TENNIS</span>
                  </div>

                  {/* TABLE TENNIS */}
                  <div
                    onClick={() => setActiveSport('TABLE TENNIS')}
                    className={`flex flex-col items-center justify-center pt-2 pb-1.5 px-3 cursor-pointer shrink-0 min-w-[84px] relative ${
                      activeSport === 'TABLE TENNIS' ? 'bg-[#296894]' : ''
                    }`}
                  >
                    {activeSport === 'TABLE TENNIS' && (
                      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white"></div>
                    )}
                    <svg className="w-4 h-4 mb-0.5 fill-white" viewBox="0 0 24 24">
                      <circle cx="9" cy="9" r="6" stroke="white" strokeWidth="1.8" fill="none" />
                      <path d="M13.5 13.5L20 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="17" cy="7" r="2" fill="white" />
                    </svg>
                    <span>TABLE TENNIS</span>
                  </div>

                  {/* HORSE */}
                  <div
                    onClick={() => setActiveSport('HORSE')}
                    className={`flex flex-col items-center justify-center pt-2 pb-1.5 px-3.5 cursor-pointer shrink-0 min-w-[76px] relative ${
                      activeSport === 'HORSE' ? 'bg-[#296894]' : ''
                    }`}
                  >
                    {activeSport === 'HORSE' && (
                      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white"></div>
                    )}
                    <svg className="w-4 h-4 mb-0.5 fill-white" viewBox="0 0 24 24">
                      <path d="M19 8l-4-4h-3L8 8H5v4h3l3 5v3h3v-4l-2-4 4-4h3z" />
                    </svg>
                    <span>HORSE</span>
                  </div>
                </div>

                {/* Exact Odds Table Section - Pure Code */}
                <LiveOddsTable sport={activeSport} />
              </>
            )}

            {/* 6. Casino & Games Section - Filtered to ONLY dt20.jpg on DRAGON TIGER */}
            <div className="w-full bg-[#132738] p-1.5 sm:p-2">
              <div className={`grid gap-2 sm:gap-2.5 ${activeCasinoFilter === 'DRAGON TIGER' ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6' : 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8'}`}>
                {displayedGames.map((game, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveGameView(true)}
                    className="w-full relative overflow-hidden bg-black flex flex-col cursor-pointer group hover:opacity-95 transition-opacity"
                  >
                    <div className="w-full aspect-square relative bg-[#132738]">
                      <Image
                        src={game.src}
                        alt={game.title}
                        width={500}
                        height={500}
                        unoptimized
                        priority={idx < 8}
                        className="w-full h-full object-cover block"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                    {/* Bottom label matching #204867 */}
                    <div className="bg-[#204867] text-[#7ec4f8] text-[9.5px] font-bold py-0.5 text-center uppercase tracking-tight truncate px-0.5">
                      {game.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Footer Section using #204867 */}
            <footer className="w-full flex flex-col">
              {/* Top Block using #204867 */}
              <div className="bg-[#204867] text-white px-5 pt-4 pb-4 flex flex-col gap-3">
                <div className="flex items-center justify-between text-[13.5px] font-bold tracking-tight">
                  <a href="#" className="underline hover:text-blue-200">
                    Terms and Conditions
                  </a>
                  <a href="#" className="underline hover:text-blue-200">
                    Responsible Gaming
                  </a>
                </div>
                <div className="text-center font-['Bebas_Neue',sans-serif] text-[26px] tracking-wide text-white uppercase font-normal pt-1">
                  24X7 Support
                </div>
              </div>

              {/* Bottom White Compliance & Copyright Block */}
              <div className="bg-white text-slate-900 px-4 pt-4 pb-3 flex flex-col items-center gap-2.5">
                {/* 100% SAFE SSL Security Row */}
                <div className="flex items-center justify-center gap-3">
                  <Image
                    src="/ssl_badge.png"
                    alt="Secure SSL Encryption"
                    width={133}
                    height={65}
                    unoptimized
                    className="h-[42px] w-auto shrink-0 block"
                  />
                  <div className="flex flex-col text-left leading-tight">
                    <span className="font-extrabold text-[13.5px] text-black tracking-tight">
                      100% SAFE
                    </span>
                    <span className="text-[12px] text-slate-800 font-medium leading-snug mt-0.5">
                      Protected connection and encrypted data.
                    </span>
                  </div>
                </div>

                {/* Circular Compliance Badges: 18+, GamCare, Gambling Therapy */}
                <div className="flex items-center justify-center my-0.5">
                  <Image
                    src="/compliance_badges.png"
                    alt="18+, GamCare, Gambling Therapy"
                    width={135}
                    height={45}
                    unoptimized
                    className="h-[32px] w-auto block"
                  />
                </div>

                {/* Copyright Line */}
                <p className="text-[11.5px] font-medium text-slate-900 text-center tracking-tight leading-tight">
                  © Copyright 2026. All Rights Reserved. Powered by Allpanel8.
                </p>

                {/* Small home indicator */}
                <div className="w-10 h-[3px] bg-slate-300 rounded-full mx-auto mt-0.5"></div>
              </div>
            </footer>

          </div>
        )}

        {/* MANDATORY FIRST-LOGIN PASSWORD CHANGE MODAL */}
        {mustChangePasswordOpen && (
          <div className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 border border-slate-200 flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-[16px] leading-tight">Change Password</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">First-time login mandatory update</p>
                </div>
              </div>

              <p className="text-[12px] text-slate-600 leading-snug">
                Your account was created with a temporary password. For security, please enter a new password to activate your ID and start playing.
              </p>

              {changePassError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-semibold">
                  {changePassError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 mb-1">Temporary Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter temp password"
                    value={changePassForm.oldPassword}
                    onChange={(e) => setChangePassForm(p => ({ ...p, oldPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-800 outline-none focus:border-[#3982b8]"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 mb-1">New Password (min 6 chars)</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Enter new password"
                    value={changePassForm.newPassword}
                    onChange={(e) => setChangePassForm(p => ({ ...p, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-800 outline-none focus:border-[#3982b8]"
                  />
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Confirm new password"
                    value={changePassForm.confirmPassword}
                    onChange={(e) => setChangePassForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-800 outline-none focus:border-[#3982b8]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changePassLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-[#3982b8] hover:bg-[#2c6994] active:scale-[0.99] text-white font-bold text-sm rounded shadow-sm flex items-center justify-center transition-all disabled:opacity-60 cursor-pointer"
                >
                  {changePassLoading ? 'Updating Password...' : 'Save Password & Enter Lobby'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
