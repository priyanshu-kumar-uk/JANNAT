import User from '../models/user.model.js';
import Transaction from '../models/transaction.model.js';
import Bet from '../models/bet.model.js';

/**
 * Helper to check if a date is on the same calendar day (local server time)
 */
const isSameCalendarDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  const a = new Date(d1);
  const b = new Date(d2);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

/**
 * @desc    Get comprehensive wallet summary and user stats
 * @route   GET /api/wallet/summary
 * @access  Private
 */
export const getWalletSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check check-in status
    const now = new Date();
    const claimedToday = isSameCalendarDay(user.lastCheckInDate, now);

    let currentStreak = user.checkInStreak || 0;
    // Check if streak was broken (missed yesterday)
    if (!claimedToday && user.lastCheckInDate) {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = isSameCalendarDay(user.lastCheckInDate, yesterday);
      if (!isYesterday) {
        currentStreak = 0; // Streak broken, resets on next claim
      }
    }

    // Calculate dynamic VIP tier
    const totalBetsCount = await Bet.countDocuments({ userId: user._id });
    const wonBets = await Bet.aggregate([
      { $match: { userId: user._id, result: 'WIN' } },
      { $group: { _id: null, totalWon: { $sum: '$winAmount' } } },
    ]);
    const totalWonAmount = wonBets.length > 0 ? wonBets[0].totalWon : 0;

    let vipLevel = 1;
    const recharges = user.totalRecharged || 0;
    if (recharges >= 50000 || totalBetsCount >= 200) {
      vipLevel = 5;
    } else if (recharges >= 10000 || totalBetsCount >= 100) {
      vipLevel = 4;
    } else if (recharges >= 2000 || totalBetsCount >= 30) {
      vipLevel = 3;
    } else if (recharges >= 500 || totalBetsCount >= 10) {
      vipLevel = 2;
    }

    // Default demo/seed bank account if user has none saved yet
    const bankAccounts = user.bankAccounts || [];

    return res.status(200).json({
      success: true,
      summary: {
        walletBalance: user.walletBalance || 0,
        checkInStreak: currentStreak,
        claimedToday,
        vipLevel,
        totalBetsCount,
        totalWonAmount,
        totalRecharged: user.totalRecharged || 0,
        totalWithdrawn: user.totalWithdrawn || 0,
        referralCode: user.referralCode || `JNT${user.mobileNumber?.slice(-6) || '777777'}`,
        bankAccounts,
      },
    });
  } catch (error) {
    console.error('getWalletSummary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve wallet summary',
      error: error.message,
    });
  }
};

/**
 * @desc    Get user's transaction ledger history (Recharges, Withdrawals, Rewards)
 * @route   GET /api/wallet/transactions
 * @access  Private
 */
export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const filter = { userId: req.user._id };

    if (type && type !== 'ALL') {
      filter.type = type.toUpperCase();
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const totalTransactions = await Transaction.countDocuments(filter);
    const totalPages = Math.ceil(totalTransactions / limitNum) || 1;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      transactions,
      totalTransactions,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    console.error('getTransactions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve transactions',
      error: error.message,
    });
  }
};

/**
 * @desc    Deposit / Recharge wallet balance
 * @route   POST /api/wallet/recharge
 * @access  Private
 */
export const rechargeWallet = async (req, res) => {
  try {
    const { amount, channel = 'UPI-Fast' } = req.body;
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum recharge amount is ₹100',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: {
          walletBalance: numAmount,
          totalRecharged: numAmount,
        },
      },
      { new: true }
    );

    const txn = await Transaction.create({
      userId: req.user._id,
      type: 'RECHARGE',
      title: 'Wallet Recharge',
      method: channel,
      amount: numAmount,
      status: 'SUCCESS',
      isPositive: true,
      details: {
        channel,
        completedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: `Successfully recharged ₹${numAmount}!`,
      newBalance: user.walletBalance,
      transaction: txn,
    });
  } catch (error) {
    console.error('rechargeWallet error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process recharge',
      error: error.message,
    });
  }
};

/**
 * @desc    Withdraw funds to bank or UPI
 * @route   POST /api/wallet/withdraw
 * @access  Private
 */
export const withdrawWallet = async (req, res) => {
  try {
    const { amount, bankAccountId } = req.body;
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount < 200) {
      return res.status(400).json({
        success: false,
        message: 'Minimum withdrawal amount is ₹200',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if ((user.walletBalance || 0) < numAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ₹${(user.walletBalance || 0).toFixed(2)}`,
      });
    }

    // Check linked account
    let selectedAccount = null;
    if (bankAccountId && user.bankAccounts && user.bankAccounts.length > 0) {
      selectedAccount = user.bankAccounts.id(bankAccountId) || user.bankAccounts[0];
    } else if (user.bankAccounts && user.bankAccounts.length > 0) {
      selectedAccount = user.bankAccounts[0];
    }

    const methodLabel = selectedAccount
      ? selectedAccount.type === 'BANK'
        ? `${selectedAccount.bankName} (****${selectedAccount.accountNumber.slice(-4)})`
        : `UPI (${selectedAccount.accountNumber})`
      : 'IMPS Bank Transfer';

    user.walletBalance -= numAmount;
    user.totalWithdrawn = (user.totalWithdrawn || 0) + numAmount;
    await user.save();

    const txn = await Transaction.create({
      userId: user._id,
      type: 'WITHDRAWAL',
      title: 'Cash Withdrawal',
      method: methodLabel,
      amount: numAmount,
      status: 'SUCCESS',
      isPositive: false,
      details: {
        bankAccountId: selectedAccount?._id,
        bankName: selectedAccount?.bankName,
        accountNumber: selectedAccount?.accountNumber,
        processedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: `Withdrawal of ₹${numAmount} successfully processed!`,
      newBalance: user.walletBalance,
      transaction: txn,
    });
  } catch (error) {
    console.error('withdrawWallet error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process withdrawal',
      error: error.message,
    });
  }
};

/**
 * @desc    Claim daily check-in bonus (7-Day Streak)
 * @route   POST /api/wallet/checkin
 * @access  Private
 */
export const claimDailyCheckIn = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const now = new Date();
    if (isSameCalendarDay(user.lastCheckInDate, now)) {
      return res.status(400).json({
        success: false,
        message: "You have already claimed today's check-in bonus.",
      });
    }

    // Determine streak
    let newStreak = 1;
    if (user.lastCheckInDate) {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (isSameCalendarDay(user.lastCheckInDate, yesterday)) {
        newStreak = ((user.checkInStreak || 0) % 7) + 1;
      }
    }

    const bonusAmount = newStreak * 10;

    user.walletBalance = (user.walletBalance || 0) + bonusAmount;
    user.checkInStreak = newStreak;
    user.lastCheckInDate = now;
    await user.save();

    const txn = await Transaction.create({
      userId: user._id,
      type: 'CHECKIN',
      title: `Day ${newStreak} Check-in Streak`,
      method: '7-Day Streak Bonus',
      amount: bonusAmount,
      status: 'SUCCESS',
      isPositive: true,
      details: {
        streakDay: newStreak,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Claimed Day ${newStreak} Bonus: +₹${bonusAmount}!`,
      newStreak,
      bonusAmount,
      newBalance: user.walletBalance,
      transaction: txn,
    });
  } catch (error) {
    console.error('claimDailyCheckIn error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to claim daily bonus',
      error: error.message,
    });
  }
};

/**
 * @desc    Add a linked Bank Account or UPI ID
 * @route   POST /api/wallet/bank-accounts
 * @access  Private
 */
export const addBankAccount = async (req, res) => {
  try {
    const { bankName, accountNumber, holderName, ifsc, type = 'BANK' } = req.body;

    if (!bankName || !accountNumber || !holderName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide holder name, bank/provider name, and account/UPI number.',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isFirst = !user.bankAccounts || user.bankAccounts.length === 0;

    const newAccount = {
      type: type === 'UPI' ? 'UPI' : 'BANK',
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      holderName: holderName.trim(),
      ifsc: ifsc ? ifsc.trim().toUpperCase() : '',
      isPrimary: isFirst,
      createdAt: new Date(),
    };

    user.bankAccounts.push(newAccount);
    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Payout account added successfully!',
      bankAccounts: user.bankAccounts,
    });
  } catch (error) {
    console.error('addBankAccount error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add payout account',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a linked Bank Account or UPI ID
 * @route   DELETE /api/wallet/bank-accounts/:id
 * @access  Private
 */
export const deleteBankAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.bankAccounts = user.bankAccounts.filter(
      (acc) => acc._id.toString() !== id
    );

    // If primary was deleted and other accounts exist, make the first one primary
    if (user.bankAccounts.length > 0 && !user.bankAccounts.some((a) => a.isPrimary)) {
      user.bankAccounts[0].isPrimary = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Account removed successfully',
      bankAccounts: user.bankAccounts,
    });
  } catch (error) {
    console.error('deleteBankAccount error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove account',
      error: error.message,
    });
  }
};
