// Abstract Game Provider interface

export class GameProvider {
  async connect() {
    throw new Error('connect() not implemented');
  }

  async disconnect() {
    throw new Error('disconnect() not implemented');
  }

  async getCurrentRound() {
    throw new Error('getCurrentRound() not implemented');
  }

  calculatePayout(betType, result, amount, payouts) {
    throw new Error('calculatePayout() not implemented');
  }
}

export default GameProvider;
