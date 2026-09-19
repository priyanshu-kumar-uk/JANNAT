import mongoose from 'mongoose';

const betSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
      index: true,
    },
    period: {
      type: Number,
      required: true,
      index: true,
    },
    contractMoney: {
      type: Number,
      required: true,
      default: 10,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    amount: {
      type: Number,
      required: true,
    },
    choice: {
      type: String,
      required: true,
    },
    betType: {
      type: String,
      enum: ['color', 'number'],
      required: true,
    },
    result: {
      type: String,
      enum: ['PENDING', 'WIN', 'LOSE'],
      default: 'PENDING',
      index: true,
    },
    winAmount: {
      type: Number,
      default: 0,
    },
    isResultSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Bet = mongoose.model('Bet', betSchema);

export default Bet;