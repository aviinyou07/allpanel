import { GameProvider } from './GameProvider.js';

const CARDS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = ['♠', '♥', '♦', '♣'];
const CARD_VALUES = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };

export class DemoGameProvider extends GameProvider {
  constructor() {
    super();
    this.type = 'demo';
  }

  async connect() {
    return true;
  }

  async disconnect() {
    return true;
  }

  generateCard() {
    const rank = CARDS[Math.floor(Math.random() * CARDS.length)];
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    const isRed = (suit === '♥' || suit === '♦');
    const val = CARD_VALUES[rank];
    const isEven = (val % 2 === 0);

    return {
      rank,
      suit,
      value: val,
      display: `${rank}${suit}`,
      isRed,
      isEven,
    };
  }

  determineResult(dragonCard, tigerCard) {
    if (dragonCard.value > tigerCard.value) return 'DRAGON';
    if (tigerCard.value > dragonCard.value) return 'TIGER';
    return 'TIE';
  }

  generateRound() {
    const dragonCard = this.generateCard();
    const tigerCard = this.generateCard();
    const result = this.determineResult(dragonCard, tigerCard);

    return {
      dragonCard: dragonCard.display,
      tigerCard: tigerCard.display,
      result,
      dragonDetails: dragonCard,
      tigerDetails: tigerCard,
    };
  }

  calculatePayout(betType, result, amount, dragonCardDisplay, tigerCardDisplay, payouts = {}) {
    const parsedBet = betType.toUpperCase();
    const dragonMultiplier = parseFloat(payouts.dragon_payout || 2.0);
    const tigerMultiplier = parseFloat(payouts.tiger_payout || 2.0);
    const tieMultiplier = parseFloat(payouts.tie_payout || 12.0);

    // Main Bets
    if (parsedBet === 'DRAGON') {
      if (result === 'DRAGON') return Math.floor(amount * dragonMultiplier);
      if (result === 'TIE') return Math.floor(amount * 0.5); // 50% refund on tie
      return 0;
    }

    if (parsedBet === 'TIGER') {
      if (result === 'TIGER') return Math.floor(amount * tigerMultiplier);
      if (result === 'TIE') return Math.floor(amount * 0.5); // 50% refund on tie
      return 0;
    }

    if (parsedBet === 'TIE') {
      if (result === 'TIE') return Math.floor(amount * tieMultiplier);
      return 0;
    }

    // Side Bets
    const dRank = dragonCardDisplay ? dragonCardDisplay.slice(0, -1) : '';
    const tRank = tigerCardDisplay ? tigerCardDisplay.slice(0, -1) : '';
    const dSuit = dragonCardDisplay ? dragonCardDisplay.slice(-1) : '';
    const tSuit = tigerCardDisplay ? tigerCardDisplay.slice(-1) : '';
    const dVal = CARD_VALUES[dRank] || 0;
    const tVal = CARD_VALUES[tRank] || 0;

    if (parsedBet === 'PAIR') {
      if (dRank && tRank && dRank === tRank) return Math.floor(amount * 12);
      return 0;
    }

    // Dragon Side Bets
    if (parsedBet === 'DRAGON-EVEN' && dVal % 2 === 0) return Math.floor(amount * 2.1);
    if (parsedBet === 'DRAGON-ODD' && dVal % 2 !== 0) return Math.floor(amount * 1.79);
    if (parsedBet === 'DRAGON-RED' && (dSuit === '♥' || dSuit === '♦')) return Math.floor(amount * 1.95);
    if (parsedBet === 'DRAGON-BLACK' && (dSuit === '♠' || dSuit === '♣')) return Math.floor(amount * 1.95);

    // Tiger Side Bets
    if (parsedBet === 'TIGER-EVEN' && tVal % 2 === 0) return Math.floor(amount * 2.1);
    if (parsedBet === 'TIGER-ODD' && tVal % 2 !== 0) return Math.floor(amount * 1.79);
    if (parsedBet === 'TIGER-RED' && (tSuit === '♥' || tSuit === '♦')) return Math.floor(amount * 1.95);
    if (parsedBet === 'TIGER-BLACK' && (tSuit === '♠' || tSuit === '♣')) return Math.floor(amount * 1.95);

    // Exact card bets (e.g. Dragon12-K)
    if (parsedBet.startsWith('DRAGON12-')) {
      const targetRank = parsedBet.replace('DRAGON12-', '');
      if (dRank === targetRank) return Math.floor(amount * 12);
    }
    if (parsedBet.startsWith('TIGER12-')) {
      const targetRank = parsedBet.replace('TIGER12-', '');
      if (tRank === targetRank) return Math.floor(amount * 12);
    }

    return 0;
  }
}

export default DemoGameProvider;
