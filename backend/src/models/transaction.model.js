import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['RECHARGE', 'WITHDRAWAL', 'BET', 'WIN', 'CHECKIN', 'COMMISSION'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    method: {
      type: String,
      trim: true,
      default: 'Wallet',
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be greater than or equal to 0'],
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'PENDING', 'FAILED'],
      default: 'SUCCESS',
      index: true,
    },
    isPositive: {
      type: Boolean,
      default: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ userId: 1, createdAt: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
