import express from 'express';
import {
  getWalletSummary,
  getTransactions,
  rechargeWallet,
  withdrawWallet,
  claimDailyCheckIn,
  addBankAccount,
  deleteBankAccount,
} from '../controllers/wallet.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All wallet routes are protected
router.use(protect);

router.get('/summary', getWalletSummary);
router.get('/transactions', getTransactions);
router.post('/recharge', rechargeWallet);
router.post('/withdraw', withdrawWallet);
router.post('/checkin', claimDailyCheckIn);
router.post('/bank-accounts', addBankAccount);
router.delete('/bank-accounts/:id', deleteBankAccount);

export default router;
