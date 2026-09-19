import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    period: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    price: {
      type: Number,
      default: 43850,
    },
    resultNumber: {
      type: Number,
      min: 0,
      max: 9,
      default: null,
    },
    resultColors: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'locked', 'completed'],
      default: 'active',
      index: true,
    },
    isGameClosed: {
      type: Boolean,
      default: false,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
      required: true,
    },
    totalBets: {
      type: Number,
      default: 0,
    },
    totalBetAmount: {
      type: Number,
      default: 0,
    },
    redBets: {
      type: Number,
      default: 0,
    },
    greenBets: {
      type: Number,
      default: 0,
    },
    violetBets: {
      type: Number,
      default: 0,
    },
    numberBets: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model('Game', gameSchema);

export default Game;

