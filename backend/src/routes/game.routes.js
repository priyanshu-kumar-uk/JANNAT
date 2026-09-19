import express from 'express';
import {
  getCurrentGame,
  getGameHistory,
  placeBet,
  getMyBets,
  getUnseenResults,
  markResultsSeen,
} from '../controllers/game.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/current', getCurrentGame);
router.get('/history', getGameHistory);

// Protected routes (User must be logged in)
router.post('/bet', protect, placeBet);
router.get('/my-bets', protect, getMyBets);
router.get('/unseen-results', protect, getUnseenResults);
router.post('/mark-results-seen', protect, markResultsSeen);

export default router;
