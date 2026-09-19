import Game from '../models/game.model.js';
import Bet from '../models/bet.model.js';
import User from '../models/user.model.js';
import gameService from '../services/game.service.js';

/**
 * Get current active game and countdown
 */
export const getCurrentGame = async (req, res) => {
  try {
    let state = gameService.getCurrentGameState();

    if (!state) {
      await gameService.initActiveGame();
      state = gameService.getCurrentGameState();
    } else if (state.countdown <= 0 && gameService.currentGame) {
      await gameService.resolveRound(gameService.currentGame);
      state = gameService.getCurrentGameState();
    }

    res.status(200).json({
      success: true,
      game: state,
    });
  } catch (error) {
    console.error('getCurrentGame error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve current game',
      error: error.message,
    });
  }
};

/**
 * Get past completed games history
 */
export const getGameHistory = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 100);
    const history = await Game.find({ status: 'completed' })
      .sort({ period: -1 })
      .limit(limit)
      .select('period price resultNumber resultColors startTime endTime createdAt');

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('getGameHistory error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch game history',
      error: error.message,
    });
  }
};

/**
 * Place a bet on the current active round
 */
export const placeBet = async (req, res) => {
  try {
    const { choice, contractMoney = 10, quantity = 1 } = req.body;
    const userId = req.user._id;

    // 1. Validate choice
    let normalizedChoice = String(choice).trim().toLowerCase();
    let betType;

    if (['green', 'violet', 'red'].includes(normalizedChoice)) {
      betType = 'color';
    } else if (/^[0-9]$/.test(normalizedChoice)) {
      betType = 'number';
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid bet selection. Must be 'green', 'violet', 'red', or a number 0-9.",
      });
    }

    // 2. Validate contract money & quantity
    const money = Number(contractMoney);
    const qty = Number(quantity);

    if (![1, 10, 100, 1000, 10000].includes(money)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contract money. Allowed values: 1, 10, 100, 1000, 10000.',
      });
    }

    if (isNaN(qty) || qty < 1 || qty > 100) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be between 1 and 100.',
      });
    }

    const totalAmount = money * qty;

    // 3. Verify active game status
    const current = gameService.getCurrentGameState();
    if (!current) {
      return res.status(400).json({
        success: false,
        message: 'No active game session found. Please retry in a moment.',
      });
    }

    if (current.isLocked || current.countdown <= 5) {
      return res.status(400).json({
        success: false,
        message: 'Betting window is locked for this round. Please wait for the next issue.',
      });
    }

    // 4. Verify user balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    if (user.walletBalance < totalAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance! You have ₹${user.walletBalance}, but need ₹${totalAmount}.`,
      });
    }

    // 5. Deduct user balance
    user.walletBalance -= totalAmount;
    await user.save();

    // 6. Create Bet document
    const bet = await Bet.create({
      userId: user._id,
      gameId: current.id,
      period: current.period,
      contractMoney: money,
      quantity: qty,
      amount: totalAmount,
      choice: normalizedChoice,
      betType,
      result: 'PENDING',
    });

    // 7. Update Game aggregates
    const incField =
      betType === 'color'
        ? normalizedChoice === 'green'
          ? 'greenBets'
          : normalizedChoice === 'red'
          ? 'redBets'
          : 'violetBets'
        : null;

    const updateQuery = {
      $inc: {
        totalBets: 1,
        totalBetAmount: totalAmount,
        ...(incField ? { [incField]: 1 } : {}),
      },
    };

    await Game.findByIdAndUpdate(current.id, updateQuery);

    res.status(201).json({
      success: true,
      message: `Bet of ₹${totalAmount} placed on ${normalizedChoice.toUpperCase()}!`,
      bet,
      newBalance: user.walletBalance,
    });
  } catch (error) {
    console.error('placeBet error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to place bet',
      error: error.message,
    });
  }
};

/**
 * Get user's placed bets with pagination, status filtering, and populated game data
 */
export const getMyBets = async (req, res) => {
  try {
    const { period, limit = 10, page = 1, status } = req.query;
    const filter = { userId: req.user._id };

    if (period) {
      filter.period = Number(period);
    }

    if (status && status !== 'all') {
      filter.result = status.toUpperCase();
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const totalBets = await Bet.countDocuments(filter);
    const totalPages = Math.ceil(totalBets / limitNum) || 1;

    const bets = await Bet.find(filter)
      .populate('gameId', 'period price resultNumber resultColors status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      bets,
      totalBets,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    console.error('getMyBets error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your bets',
      error: error.message,
    });
  }
};

/**
 * Get newly resolved bets that user hasn't seen the popup for yet
 */
export const getUnseenResults = async (req, res) => {
  try {
    const unseenBets = await Bet.find({
      userId: req.user._id,
      result: { $in: ['WIN', 'LOSE'] },
      isResultSeen: false,
    })
      .sort({ createdAt: -1 })
      .populate('gameId', 'period price resultNumber resultColors');

    res.status(200).json({
      success: true,
      results: unseenBets,
    });
  } catch (error) {
    console.error('getUnseenResults error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unseen results',
      error: error.message,
    });
  }
};

/**
 * Mark resolved bets as seen so popup doesn't reappear
 */
export const markResultsSeen = async (req, res) => {
  try {
    const { betIds } = req.body;

    if (!Array.isArray(betIds) || betIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'betIds array is required',
      });
    }

    await Bet.updateMany(
      {
        _id: { $in: betIds },
        userId: req.user._id,
      },
      {
        isResultSeen: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Results marked as seen',
    });
  } catch (error) {
    console.error('markResultsSeen error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update result status',
      error: error.message,
    });
  }
};
