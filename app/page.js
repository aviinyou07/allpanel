'use client';

import { useState } from 'react';
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

function MiniCard({ rank, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-[26px] h-[36px] bg-white border-[1.5px] ${
        selected ? 'border-teal-600 ring-2 ring-teal-400 bg-teal-50' : 'border-[#fbbf24]'
      } rounded-[2px] flex flex-col items-center justify-between py-0.5 px-0.5 cursor-pointer hover:border-teal-500 active:scale-95 transition-all shadow-xs shrink-0 select-none`}
    >
      <span className="text-[10.5px] font-black text-black leading-none">{rank}</span>
      <div className="grid grid-cols-2 gap-x-[1px] gap-y-0 leading-none text-[7.5px]">
        <span className="text-black font-serif">♠</span>
        <span className="text-[#e53e3e] font-serif">♥</span>
        <span className="text-black font-serif">♣</span>
        <span className="text-[#e53e3e] font-serif">♦</span>
      </div>
    </button>
  );
}

function LiveOddsTable() {
  const matches = [
    {
      title: 'Super Over 2',
      time: '',
      hasBM: true,
      hasE: false,
      boxes: ['-', '-', '-', '-', '-', '-'],
    },
    {
      title: 'Royal Challengers Bengaluru (e) - Delhi Capi...',
      time: '16/09/2026 14:42:00',
      hasBM: false,
      hasE: true,
      boxes: ['-', '-', '-', '-', '-', '-'],
    },
    {
      title: 'Punjab Kings (e) - Rajasthan Royals (e)',
      time: '16/09/2026 14:42:00',
      hasBM: false,
      hasE: true,
      boxes: ['-', '-', '-', '-', '-', '-'],
    },
    {
      title: 'Kolkata Knight Riders (e) - Royal Challenger...',
      time: '16/09/2026 14:45:00',
      hasBM: false,
      hasE: true,
      boxes: ['-', '-', '-', '-', '-', '-'],
    },
  ];

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
            {m.boxes.map((val, bIdx) => (
              <div
                key={bIdx}
                className={`h-7 rounded-[2px] flex items-center justify-center font-bold text-[13px] cursor-pointer hover:opacity-90 active:scale-95 transition-all ${
                  bIdx % 2 === 0
                    ? 'bg-[#72bbf6] text-[#0f3d64]'
                    : 'bg-[#f8a9bb] text-[#6b1b2a]'
                }`}
              >
                {val}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DragonTigerScreen({ onBack }) {
  const [selectedBet, setSelectedBet] = useState(null);

  const cardsRow1 = ['A', '2', '3', '4', '5', '6', '7', '8', '9'];
  const cardsRow2 = ['10', 'J', 'Q', 'K'];
  const lastResults = ['D', 'T', 'T', 'T', 'T', 'D', 'T', 'T', 'T', 'D'];

  return (
    <div className="w-full min-h-screen bg-[#f0f3f6] flex flex-col relative select-none animate-fadeIn text-slate-900">
      {/* 1. Header Bar */}
      <header className="bg-[#264653] text-white px-3 pt-2.5 pb-2 flex items-center justify-between border-b border-black/20">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="w-7 h-7 flex items-center justify-center text-white hover:text-cyan-200 transition-colors cursor-pointer"
            aria-label="Back to Lobby"
            title="Back to Lobby"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </button>
          <span className="font-['Bebas_Neue',sans-serif] text-[34px] tracking-[0.04em] leading-none text-white uppercase font-normal pt-0.5">
            DCKEXCH
          </span>
        </div>

        <div className="flex flex-col items-end leading-tight text-right">
          <div className="text-[12.5px] font-bold text-white tracking-tight">
            Balance:1500
          </div>
          <div className="text-[12.5px] text-white font-bold flex items-center gap-1 cursor-pointer mt-0.5">
            <span>Exp:0</span>
            <span className="ml-1">Demo</span>
            <svg className="w-3 h-3 text-white inline" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </header>

      {/* 2. Marquee / Search Bar */}
      <div className="bg-[#4d6671] text-white px-2.5 py-1 flex items-center gap-2 text-[12px] border-b border-black/20">
        <div className="flex items-center justify-center w-5 h-5 rounded bg-[#3c535d] text-white shrink-0">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z" />
          </svg>
        </div>
        <div className="italic text-slate-100 font-medium truncate tracking-tight text-[12px]">
          Newly Launched Matka Market In Our Exchange
        </div>
      </div>

      {/* 3. Sub-bar 1: 20-20 DRAGON TIGER Rules */}
      <div className="bg-[#2a9d8f] text-white px-3 py-1.5 flex items-center justify-between font-bold text-[13px] tracking-tight">
        <span className="font-extrabold tracking-wide uppercase">20-20 DRAGON TIGER</span>
        <button type="button" className="underline cursor-pointer hover:text-cyan-100 font-medium text-[12px]">
          Rules
        </button>
      </div>

      {/* 4. Sub-bar 2: GAME | PLACED BET (0) Round ID */}
      <div className="bg-[#1c3641] text-white px-3 py-1.5 flex items-center justify-between text-[11px] font-bold border-b border-black/30">
        <div className="flex items-center gap-1.5">
          <span className="tracking-wide">GAME</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-200">PLACED BET (0)</span>
          <span className="text-slate-500">|</span>
        </div>
        <div className="text-slate-300 font-medium tracking-tight">
          Round ID: 116260916155250
        </div>
      </div>

      {/* 5. Live Stream Card Table Area */}
      <div className="w-full h-[210px] bg-black relative flex flex-col justify-between overflow-hidden shadow-inner">
        <div className="flex items-center gap-1.5 p-2.5 z-10">
          <div className="w-6 h-8 bg-blue-600 border border-white rounded-[2px] shadow-sm flex items-center justify-center p-[2px]">
            <div className="w-full h-full border border-white/50 bg-blue-700"></div>
          </div>
          <div className="w-6 h-8 bg-blue-600 border border-white rounded-[2px] shadow-sm flex items-center justify-center p-[2px]">
            <div className="w-full h-full border border-white/50 bg-blue-700"></div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none"></div>

        <div className="flex items-center justify-end gap-1 p-2.5 z-10">
          <div className="w-7 h-7 bg-[#052b24] border border-[#2ec4b6] rounded-[3px] text-[#2ec4b6] font-mono font-black text-[16px] flex items-center justify-center shadow-xs">
            0
          </div>
          <div className="w-7 h-7 bg-[#052b24] border border-[#2ec4b6] rounded-[3px] text-[#2ec4b6] font-mono font-black text-[16px] flex items-center justify-center shadow-xs">
            7
          </div>
        </div>
      </div>

      {/* 6. Main Betting Row (Dragon, Tie, Tiger, Pair) */}
      <div className="w-full bg-white px-2 pt-1.5 pb-2.5 border-b border-slate-200">
        <div className="flex items-stretch gap-1">
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-3 text-center font-black text-[13px] text-slate-900 pb-1">
              <div>2</div>
              <div>50</div>
              <div>2</div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setSelectedBet('Dragon')}
                className={`py-2 rounded-[2px] font-extrabold text-[14px] text-white shadow-xs cursor-pointer transition-all ${
                  selectedBet === 'Dragon'
                    ? 'bg-teal-500 ring-2 ring-teal-300'
                    : 'bg-gradient-to-b from-[#235865] to-[#1c434d] hover:brightness-110 active:scale-95'
                }`}
              >
                Dragon
              </button>
              <button
                type="button"
                onClick={() => setSelectedBet('Tie')}
                className={`py-2 rounded-[2px] font-extrabold text-[14px] text-white shadow-xs cursor-pointer transition-all ${
                  selectedBet === 'Tie'
                    ? 'bg-teal-500 ring-2 ring-teal-300'
                    : 'bg-gradient-to-b from-[#235865] to-[#1c434d] hover:brightness-110 active:scale-95'
                }`}
              >
                Tie
              </button>
              <button
                type="button"
                onClick={() => setSelectedBet('Tiger')}
                className={`py-2 rounded-[2px] font-extrabold text-[14px] text-white shadow-xs cursor-pointer transition-all ${
                  selectedBet === 'Tiger'
                    ? 'bg-teal-500 ring-2 ring-teal-300'
                    : 'bg-gradient-to-b from-[#235865] to-[#1c434d] hover:brightness-110 active:scale-95'
                }`}
              >
                Tiger
              </button>
            </div>
          </div>

          <div className="w-[2px] bg-[#2a9d8f] mx-0.5 rounded-full my-1"></div>

          <div className="w-[84px] flex flex-col">
            <div className="text-center font-black text-[13px] text-slate-900 pb-1">
              12
            </div>
            <button
              type="button"
              onClick={() => setSelectedBet('Pair')}
              className={`py-2 rounded-[2px] font-extrabold text-[14px] text-white shadow-xs cursor-pointer transition-all ${
                selectedBet === 'Pair'
                  ? 'bg-teal-500 ring-2 ring-teal-300'
                  : 'bg-gradient-to-b from-[#235865] to-[#1c434d] hover:brightness-110 active:scale-95'
              }`}
            >
              Pair
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
          <div>2.1</div>
          <div>1.79</div>
          <div>1.95</div>
          <div>1.95</div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => setSelectedBet('Dragon-Even')}
            className={`py-2 rounded-[2px] font-extrabold text-[13.5px] text-white shadow-xs cursor-pointer transition-all ${
              selectedBet === 'Dragon-Even'
                ? 'bg-teal-500 ring-2 ring-teal-300'
                : 'bg-gradient-to-b from-[#235865] to-[#1c434d] hover:brightness-110 active:scale-95'
            }`}
          >
            Even
          </button>
          <button
            type="button"
            onClick={() => setSelectedBet('Dragon-Odd')}
            className={`py-2 rounded-[2px] font-extrabold text-[13.5px] text-white shadow-xs cursor-pointer transition-all ${
              selectedBet === 'Dragon-Odd'
                ? 'bg-teal-500 ring-2 ring-teal-300'
                : 'bg-gradient-to-b from-[#235865] to-[#1c434d] hover:brightness-110 active:scale-95'
            }`}
          >
            Odd
          </button>
          <button
            type="button"
            onClick={() => setSelectedBet('Dragon-Red')}
            className={`py-2 rounded-[2px] font-extrabold text-[15px] text-[#e74c3c] shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 ${
              selectedBet === 'Dragon-Red'
                ? 'bg-teal-500 ring-2 ring-teal-300'
                : 'bg-gradient-to-b from-[#235865] to-[#1c434d] hover:brightness-110 active:scale-95'
            }`}
          >
            <span>♥</span>
            <span>♦</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedBet('Dragon-Black')}
            className={`py-2 rounded-[2px] font-extrabold text-[15px] text-black shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 ${
              selectedBet === 'Dragon-Black'
                ? 'bg-teal-500 ring-2 ring-teal-300'
                : 'bg-gradient-to-b from-[#235865] to-[#1c434d] hover:brightness-110 active:scale-95'
            }`}
          >
            <span>♠</span>
            <span>♣</span>
          </button>
        </div>
      </div>

      {/* 8. TIGER Bets (Even, Odd, Suits) */}
      <div className="w-full bg-[#f8f9fa] px-2 py-2 border-b border-slate-200">
        <div className="text-center font-black text-[13.5px] text-slate-900 tracking-wider mb-1">
          TIGER
        </div>
        <div className="grid grid-cols-4 text-center font-bold text-[12.5px] text-slate-800 pb-1">
          <div>2.1</div>
          <div>1.79</div>
          <div>1.95</div>
          <div>1.95</div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => setSelectedBet('Tiger-Even')}
            className={`py-2 rounded-[2px] font-extrabold text-[13.5px] text-white shadow-xs cursor-pointer transition-all ${
              selectedBet === 'Tiger-Even'
                ? 'bg-teal-500 ring-2 ring-teal-300'
                : 'bg-gradient-to-b from-[#235865] to-[#1c434d] hover:brightness-110 active:scale-95'
            }`}
          >
            Even
          </button>
          <button
            type="button"
            onClick={() => setSelectedBet('Tiger-Odd')}
            className={`py-2 rounded-[2px] font-extrabold text-[13.5px] text-white shadow-xs cursor-pointer transition-all ${
              selectedBet === 'Tiger-Odd'
                ? 'bg-teal-500 ring-2 ring-teal-300'
                : 'bg-gradient-to-b from-[#235865] to-[#1c434d] hover:brightness-110 active:scale-95'
            }`}
          >
            Odd
          </button>
          <button
            type="button"
            onClick={() => setSelectedBet('Tiger-Red')}
            className={`py-2 rounded-[2px] font-extrabold text-[15px] text-[#e74c3c] shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 ${
              selectedBet === 'Tiger-Red'
                ? 'bg-teal-500 ring-2 ring-teal-300'
                : 'bg-gradient-to-b from-[#235865] to-[#1c434d] hover:brightness-110 active:scale-95'
            }`}
          >
            <span>♥</span>
            <span>♦</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedBet('Tiger-Black')}
            className={`py-2 rounded-[2px] font-extrabold text-[15px] text-black shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1 ${
              selectedBet === 'Tiger-Black'
                ? 'bg-teal-500 ring-2 ring-teal-300'
                : 'bg-gradient-to-b from-[#235865] to-[#1c434d] hover:brightness-110 active:scale-95'
            }`}
          >
            <span>♠</span>
            <span>♣</span>
          </button>
        </div>
      </div>

      {/* 9. DRAGON 12 Cards Box */}
      <div className="bg-white border border-slate-300 rounded-[2px] p-2.5 mx-2 my-2 shadow-xs">
        <div className="text-center font-extrabold text-[13px] text-slate-800 uppercase tracking-wide mb-2">
          DRAGON 12
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {cardsRow1.map((rank) => (
              <MiniCard
                key={rank}
                rank={rank}
                selected={selectedBet === `Dragon12-${rank}`}
                onClick={() => setSelectedBet(`Dragon12-${rank}`)}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-1">
            {cardsRow2.map((rank) => (
              <MiniCard
                key={rank}
                rank={rank}
                selected={selectedBet === `Dragon12-${rank}`}
                onClick={() => setSelectedBet(`Dragon12-${rank}`)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 10. TIGER 12 Cards Box */}
      <div className="bg-white border border-slate-300 rounded-[2px] p-2.5 mx-2 my-1 shadow-xs">
        <div className="text-center font-extrabold text-[13px] text-slate-800 uppercase tracking-wide mb-2">
          TIGER 12
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {cardsRow1.map((rank) => (
              <MiniCard
                key={rank}
                rank={rank}
                selected={selectedBet === `Tiger12-${rank}`}
                onClick={() => setSelectedBet(`Tiger12-${rank}`)}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-1">
            {cardsRow2.map((rank) => (
              <MiniCard
                key={rank}
                rank={rank}
                selected={selectedBet === `Tiger12-${rank}`}
                onClick={() => setSelectedBet(`Tiger12-${rank}`)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 11. Last Result Bar */}
      <div className="w-full mt-2">
        <div className="bg-[#2a9d8f] text-white px-3 py-1.5 flex items-center justify-between font-bold text-[12.5px]">
          <span className="tracking-wide">Last Result</span>
          <button type="button" className="underline cursor-pointer hover:text-cyan-100 font-medium text-[11.5px]">
            View All
          </button>
        </div>
        <div className="bg-white px-3 py-2 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-200">
          {lastResults.map((res, rIdx) => (
            <div
              key={rIdx}
              className={`w-6 h-6 rounded-full font-black text-[12px] text-white flex items-center justify-center shadow-xs shrink-0 ${
                res === 'D' ? 'bg-[#9e2a2b]' : 'bg-[#2d6a4f]'
              }`}
            >
              {res}
            </div>
          ))}
        </div>
      </div>

      {/* 12. Footer Section */}
      <footer className="w-full flex flex-col mt-auto">
        <div className="bg-[#264653] text-white px-5 pt-4 pb-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-[13px] font-bold tracking-tight">
            <a href="#" className="underline hover:text-cyan-200">
              Terms and Conditions
            </a>
            <a href="#" className="underline hover:text-cyan-200">
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
            © Copyright 2026. All Rights Reserved. Powered by DCKEXCH.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPromoOpen, setIsPromoOpen] = useState(true);
  const [activeGameView, setActiveGameView] = useState(false);
  const [activeCategory, setActiveCategory] = useState('CRASH'); // 'CRASH' | 'SPORTS' | 'OUR CASINO'
  const [activeSport, setActiveSport] = useState('CRICKET');
  const [activeVipCasinoTab, setActiveVipCasinoTab] = useState('OUR CASINO');
  const [activeCasinoFilter, setActiveCasinoFilter] = useState('ALL CASINO');

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
    setIsLoggedIn(true);
    setIsPromoOpen(true);
    setActiveCategory('CRASH');
  };

  return (
    <main className="min-h-screen w-full bg-[#f0f2f5] flex justify-center items-start">
      {/* 500px Mobile Screen Viewport */}
      <div className="w-full max-w-[500px] min-h-screen bg-[#264653] flex flex-col relative shadow-[0_4px_35px_rgba(0,0,0,0.18)] overflow-hidden">

        {!isLoggedIn ? (
          /* ============================================================
             SCREEN 0: Exact Login Page
             ============================================================ */
          <div className="w-full min-h-screen bg-gradient-to-b from-[#264653] via-[#2a9d8f] to-[#2a9d8f] flex flex-col justify-between select-none animate-fadeIn">
            {/* Top Logo & Login Card */}
            <div className="w-full flex flex-col items-center pt-8 px-5">
              {/* DCKEXCH Logo */}
              <h1 className="font-['Bebas_Neue',sans-serif] text-[52px] tracking-[0.03em] text-white leading-none mb-6 text-center">
                DCKEXCH
              </h1>

              {/* Login Card */}
              <div className="w-full max-w-[360px] bg-white rounded-md p-4 shadow-[0_6px_25px_rgba(0,0,0,0.22)] flex flex-col gap-3.5">
                {/* Title */}
                <div className="flex items-center justify-center gap-1.5 text-[#3a5863] font-bold text-[17px]">
                  <span>Login</span>
                  <svg className="w-4 h-4 fill-[#3a5863]" viewBox="0 0 24 24">
                    <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                </div>

                {/* Username Input */}
                <div className="flex items-stretch border border-slate-300 rounded overflow-hidden focus-within:border-[#264653]">
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
                <div className="flex items-stretch border border-slate-300 rounded overflow-hidden focus-within:border-[#264653]">
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
                  onClick={handleDemoLogin}
                  className="w-full bg-[#264653] hover:bg-[#1f3843] active:scale-[0.99] text-white font-bold text-[14px] py-2.5 px-4 rounded flex items-center justify-center relative cursor-pointer transition-all shadow-sm"
                >
                  <span>Login</span>
                  <svg className="w-4 h-4 fill-white absolute right-3" viewBox="0 0 24 24">
                    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                  </svg>
                </button>

                {/* Login with demo ID Button */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full bg-[#264653] hover:bg-[#1f3843] active:scale-[0.99] text-white font-bold text-[14px] py-2.5 px-4 rounded flex items-center justify-center relative cursor-pointer transition-all shadow-sm"
                >
                  <span>Login with demo ID</span>
                  <svg className="w-4 h-4 fill-white absolute right-3" viewBox="0 0 24 24">
                    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Bottom Footer */}
            <footer className="w-full bg-[#264653] text-white px-5 pt-3 pb-3 flex flex-col gap-1.5 mt-auto">
              <div className="flex items-center justify-between text-[12px] font-bold tracking-tight">
                <a href="#" className="underline hover:text-cyan-200">
                  Terms and Conditions
                </a>
                <a href="#" className="underline hover:text-cyan-200">
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
              className="w-full bg-[#264653] text-white px-3 py-2 flex items-center justify-between gap-2 text-[13px] leading-tight font-semibold border-b border-black/30 z-30 select-none"
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
        ) : activeGameView ? (
          /* ============================================================
             SCREEN 3: 20-20 DRAGON TIGER LIVE GAME TABLE (PURE CODE)
             ============================================================ */
          <DragonTigerScreen onBack={() => setActiveGameView(false)} />
        ) : (
          /* ============================================================
             SCREEN 2: DCKEXCH Dashboard
             ============================================================ */
          <div className="w-full flex flex-col bg-[#f0f3f6] text-slate-900 select-none animate-fadeIn">
            
            {/* 1. Top Header Bar using #264653 */}
            <header className="bg-[#264653] text-white px-3 pt-2.5 pb-2 flex items-center justify-between border-b border-black/20">
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
                {/* DCKEXCH Logo */}
                <span className="font-['Bebas_Neue',sans-serif] text-[35px] tracking-[0.04em] leading-none text-white uppercase font-normal pt-0.5">
                  DCKEXCH
                </span>
              </div>

              {/* User Balance & Mode */}
              <div className="flex flex-col items-end leading-tight text-right">
                <div className="text-[13px] font-bold text-white tracking-tight">
                  Balance:1500
                </div>
                <div
                  onClick={() => setIsLoggedIn(false)}
                  title="Logout / Return to Login"
                  className="text-[13px] text-white font-bold flex items-center gap-1.5 cursor-pointer mt-0.5 hover:text-cyan-200 transition-colors"
                >
                  <span>Exp:0</span>
                  <span className="ml-1">Demo</span>
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

            {/* 2. Search Bar & Filter Chips Row using #264653 & #2a9d8f */}
            <div className="bg-[#264653] px-3 pb-2 pt-1 flex flex-col gap-1.5">
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

                <div className="bg-[#375a68] rounded-[2px] h-[30px] flex items-center px-2.5 w-full text-[12.5px] italic text-[#e5edf1] tracking-tight">
                  <span>Newly Launched Matka Market In Our Exchange</span>
                </div>
              </div>

              {/* Filter Chips: using #2a9d8f */}
              <div className="flex items-stretch gap-1.5 pt-0.5">
                {/* Chip 1: AZERBAIJAN GRAND ... */}
                <div className="bg-[#2a9d8f] text-white px-2.5 py-1.5 rounded-[2px] text-[12px] font-bold flex items-center gap-2 flex-1 min-w-0 cursor-pointer shadow-xs">
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
                <div className="bg-[#2a9d8f] text-white px-2.5 py-1.5 rounded-[2px] text-[12px] font-bold flex items-center gap-2 flex-1 min-w-0 cursor-pointer shadow-xs">
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

            {/* 3. Main Game Categories Bar using #1f3a45 */}
            <nav className="bg-[#1f3a45] text-white flex items-stretch overflow-x-auto no-scrollbar border-b border-black/30 text-[12px] font-bold uppercase tracking-tight select-none">
              {/* CRASH */}
              <div
                onClick={() => setActiveCategory('CRASH')}
                className={`flex items-center gap-1.5 px-3 py-2 border-r border-slate-600/40 shrink-0 cursor-pointer hover:bg-white/5 relative ${
                  activeCategory === 'CRASH' ? 'bg-[#264653]' : ''
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
                  activeCategory === 'LOTTERY' ? 'bg-[#264653]' : ''
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
                  activeCategory === 'SPORTS' ? 'bg-[#264653]' : ''
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
                  activeCategory === 'OUR CASINO' ? 'bg-[#264653]' : 'hover:bg-white/5'
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
                  activeCategory === 'LIVE CASINO' ? 'bg-[#264653]' : 'hover:bg-white/5'
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
                  activeCategory === 'SLOTS' ? 'bg-[#264653]' : ''
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
                  activeCategory === 'FANTASY' ? 'bg-[#264653]' : ''
                }`}
              >
                {activeCategory === 'FANTASY' && (
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white"></div>
                )}
                FANTASY
              </div>
            </nav>

            {/* ============================================================
               WHEN 'OUR CASINO' IS ACTIVE: 2 SUB-BARS (#2a9d8f & #264653)
               ============================================================ */}
            {activeCategory === 'OUR CASINO' ? (
              <div className="flex flex-col w-full animate-fadeIn">
                {/* 1. Sub-bar 1: using #2a9d8f */}
                <div className="bg-[#2a9d8f] text-white flex items-center gap-5 px-3 py-2.5 overflow-x-auto no-scrollbar font-bold text-[12.5px] tracking-tight select-none border-t border-teal-500/30">
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

                {/* 2. Sub-bar 2: using #264653 with all 18 scrollable tabs */}
                <div className="bg-[#264653] text-white flex items-center gap-5 px-3 py-2.5 overflow-x-auto no-scrollbar font-bold text-[12.5px] tracking-tight select-none border-b border-black/30 whitespace-nowrap scroll-smooth">
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
                {/* Sports Subcategories Navigation Bar: using #2a9d8f */}
                <div className="bg-[#2a9d8f] text-white flex items-center overflow-x-auto no-scrollbar shadow-inner text-[11px] font-bold uppercase tracking-tight select-none border-t border-teal-500/30">
                  {/* CRICKET */}
                  <div
                    onClick={() => setActiveSport('CRICKET')}
                    className={`flex flex-col items-center justify-center pt-2 pb-1.5 px-4 cursor-pointer shrink-0 min-w-[76px] relative ${
                      activeSport === 'CRICKET' ? 'bg-[#228277]' : ''
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
                      activeSport === 'FOOTBALL' ? 'bg-[#228277]' : ''
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
                      activeSport === 'TENNIS' ? 'bg-[#228277]' : ''
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
                      activeSport === 'TABLE TENNIS' ? 'bg-[#228277]' : ''
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
                      activeSport === 'HORSE' ? 'bg-[#228277]' : ''
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
                <LiveOddsTable />
              </>
            )}

            {/* 6. Casino & Games Section - Filtered to ONLY dt20.jpg on DRAGON TIGER */}
            <div className="w-full bg-[#1b323c] p-1">
              <div className={`grid gap-2 ${activeCasinoFilter === 'DRAGON TIGER' ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {displayedGames.map((game, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveGameView(true)}
                    className="w-full relative overflow-hidden bg-black flex flex-col cursor-pointer group hover:opacity-95 transition-opacity"
                  >
                    <div className="w-full aspect-square relative bg-[#1b323c]">
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
                    {/* Bottom label matching #264653 */}
                    <div className="bg-[#264653] text-[#4edfd3] text-[9.5px] font-bold py-0.5 text-center uppercase tracking-tight truncate px-0.5">
                      {game.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Footer Section using #264653 */}
            <footer className="w-full flex flex-col">
              {/* Top Block using #264653 */}
              <div className="bg-[#264653] text-white px-5 pt-4 pb-4 flex flex-col gap-3">
                <div className="flex items-center justify-between text-[13.5px] font-bold tracking-tight">
                  <a href="#" className="underline hover:text-cyan-200">
                    Terms and Conditions
                  </a>
                  <a href="#" className="underline hover:text-cyan-200">
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
                  © Copyright 2026. All Rights Reserved. Powered by DCKEXCH.
                </p>

                {/* Small home indicator */}
                <div className="w-10 h-[3px] bg-slate-300 rounded-full mx-auto mt-0.5"></div>
              </div>
            </footer>

          </div>
        )}

      </div>
    </main>
  );
}
