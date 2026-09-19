import Game from '../models/game.model.js';
import Bet from '../models/bet.model.js';
import User from '../models/user.model.js';

const ROUND_DURATION_MS = 30000; // 30 seconds per issue
const LOCK_THRESHOLD_SECONDS = 5; // Last 5 seconds locked

class GameService {
  constructor() {
    this.currentGame = null;
    this.timer = null;
    this.isResolving = false;
  }

  /**
   * Determine color(s) for a winning number
   */
  getResultColors(num) {
    if (num === 0) return ['red', 'violet'];
    if (num === 5) return ['green', 'violet'];
    if ([1, 3, 7, 9].includes(num)) return ['green'];
    if ([2, 4, 6, 8].includes(num)) return ['red'];
    return [];
  }

  /**
   * Calculate winnings for a given bet
   */
  calculateBetPayout(bet, resultNumber) {
    const { betType, choice, amount } = bet;
    let won = false;
    let multiplier = 0;

    if (betType === 'color') {
      const color = choice.toLowerCase();
      if (color === 'green') {
        if ([1, 3, 7, 9].includes(resultNumber)) {
          won = true;
          multiplier = 2;
        } else if (resultNumber === 5) {
          won = true;
          multiplier = 1.5;
        }
      } else if (color === 'red') {
        if ([2, 4, 6, 8].includes(resultNumber)) {
          won = true;
          multiplier = 2;
        } else if (resultNumber === 0) {
          won = true;
          multiplier = 1.5;
        }
      } else if (color === 'violet') {
        if ([0, 5].includes(resultNumber)) {
          won = true;
          multiplier = 4.5;
        }
      }
    } else if (betType === 'number') {
      if (Number(choice) === resultNumber) {
        won = true;
        multiplier = 9;
      }
    }

    if (won) {
      // 2% contract fee rule: (amount * multiplier * 0.98)
      const winAmount = Math.floor(amount * multiplier * 0.98);
      return { won: true, winAmount };
    }

    return { won: false, winAmount: 0 };
  }

  /**
   * Initialize history if database is fresh
   */
  async seedInitialHistoryIfNeeded() {
    try {
      const count = await Game.countDocuments({ status: 'completed' });
      if (count >= 20) return;

      console.log('Seeding initial completed games for Parity...');
      const basePeriod = 2108231850;
      const initialGames = [];

      for (let i = 0; i < 22; i++) {
        const period = basePeriod + i;
        const resultNumber = Math.floor(Math.random() * 10);
        const resultColors = this.getResultColors(resultNumber);
        const price = 41200 + Math.floor(Math.random() * 2000);
        const time = new Date(Date.now() - (22 - i) * ROUND_DURATION_MS);

        initialGames.push({
          period,
          price,
          resultNumber,
          resultColors,
          status: 'completed',
          isGameClosed: true,
          startTime: time,
          endTime: new Date(time.getTime() + ROUND_DURATION_MS),
        });
      }

      await Game.insertMany(initialGames);
      console.log('Seeded 22 initial completed games.');
    } catch (error) {
      console.error('Error seeding initial games:', error.message);
    }
  }

  /**
   * Start or resume the active game
   */
  async initActiveGame() {
    await this.seedInitialHistoryIfNeeded();

    let activeGame = await Game.findOne({
      status: { $in: ['active', 'locked'] },
    }).sort({ createdAt: -1 });

    const now = Date.now();

    if (activeGame) {
      if (new Date(activeGame.endTime).getTime() <= now) {
        // Expired active game -> resolve immediately
        await this.resolveRound(activeGame);
        return;
      }
      this.currentGame = activeGame;
    } else {
      // No active game -> find last game to get period
      const lastGame = await Game.findOne().sort({ period: -1 });
      const nextPeriod = lastGame ? lastGame.period + 1 : 2108231873;
      const startTime = new Date();
      const endTime = new Date(now + ROUND_DURATION_MS);

      this.currentGame = await Game.create({
        period: nextPeriod,
        startTime,
        endTime,
        status: 'active',
        isGameClosed: false,
        price: 42000 + Math.floor(Math.random() * 2500),
      });
    }

    console.log(`Active Game Period: ${this.currentGame.period}, ends at ${this.currentGame.endTime.toISOString()}`);
  }

  /**
   * Resolve round when countdown hits 0
   */
  async resolveRound(gameToResolve) {
    if (this.isResolving) return;
    this.isResolving = true;

    try {
      const game = gameToResolve || this.currentGame;
      if (!game) {
        this.isResolving = false;
        return;
      }

      // 1. Generate lottery result (0-9)
      const resultNumber = Math.floor(Math.random() * 10);
      const resultColors = this.getResultColors(resultNumber);
      const price = 41500 + Math.floor(Math.random() * 2800);

      // 2. Fetch all pending bets for this round
      const pendingBets = await Bet.find({
        gameId: game._id,
        result: 'PENDING',
      });

      // 3. Settle each bet
      for (const bet of pendingBets) {
        const { won, winAmount } = this.calculateBetPayout(bet, resultNumber);

        if (won && winAmount > 0) {
          bet.result = 'WIN';
          bet.winAmount = winAmount;
          // Credit winnings to user balance
          await User.findByIdAndUpdate(bet.userId, {
            $inc: { walletBalance: winAmount },
          });
        } else {
          bet.result = 'LOSE';
          bet.winAmount = 0;
        }

        bet.isResultSeen = false;
        await bet.save();
      }

      // 4. Update Game document to completed
      game.resultNumber = resultNumber;
      game.resultColors = resultColors;
      game.price = price;
      game.status = 'completed';
      game.isGameClosed = true;
      await game.save();

      console.log(`Resolved Game Period ${game.period}: Number ${resultNumber} (${resultColors.join('+')}), settled ${pendingBets.length} bets.`);

      // 5. Create next active game
      const nextPeriod = game.period + 1;
      const startTime = new Date();
      const endTime = new Date(Date.now() + ROUND_DURATION_MS);

      this.currentGame = await Game.create({
        period: nextPeriod,
        startTime,
        endTime,
        status: 'active',
        isGameClosed: false,
        price: 42000 + Math.floor(Math.random() * 2500),
      });

    } catch (error) {
      console.error('Error resolving game round:', error);
    } finally {
      this.isResolving = false;
    }
  }

  /**
   * Main ticker running every 1 second
   */
  async tick() {
    try {
      if (!this.currentGame) {
        await this.initActiveGame();
        return;
      }

      const now = Date.now();
      const endTimeMs = new Date(this.currentGame.endTime).getTime();
      const remainingMs = endTimeMs - now;
      const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

      // Lock state when remaining seconds <= 5
      if (remainingSeconds <= LOCK_THRESHOLD_SECONDS && this.currentGame.status === 'active') {
        this.currentGame.status = 'locked';
        await Game.findByIdAndUpdate(this.currentGame._id, { status: 'locked' });
      }

      // Expired -> Resolve round
      if (remainingMs <= 0) {
        await this.resolveRound(this.currentGame);
      }
    } catch (err) {
      console.error('Error in GameService tick:', err.message);
    }
  }

  /**
   * Start the continuous game runner
   */
  async start() {
    await this.initActiveGame();
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.tick(), 1000);
    console.log('Parity Game Engine loop started (30s cycle).');
  }

  /**
   * Get current game state payload
   */
  getCurrentGameState() {
    if (!this.currentGame) {
      return null;
    }

    const now = Date.now();
    const endTimeMs = new Date(this.currentGame.endTime).getTime();
    const countdown = Math.max(0, Math.ceil((endTimeMs - now) / 1000));
    const isLocked = countdown <= LOCK_THRESHOLD_SECONDS;

    return {
      id: this.currentGame._id,
      period: this.currentGame.period,
      countdown,
      isLocked,
      startTime: this.currentGame.startTime,
      endTime: this.currentGame.endTime,
      serverTime: new Date(),
    };
  }
}

const gameService = new GameService();
export default gameService;
