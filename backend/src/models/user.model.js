import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    bankAccounts: [
      {
        type: {
          type: String,
          enum: ['BANK', 'UPI'],
          default: 'BANK',
        },
        bankName: {
          type: String,
          required: true,
          trim: true,
        },
        accountNumber: {
          type: String,
          required: true,
          trim: true,
        },
        holderName: {
          type: String,
          required: true,
          trim: true,
        },
        ifsc: {
          type: String,
          trim: true,
          default: '',
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    checkInStreak: {
      type: Number,
      default: 0,
    },
    lastCheckInDate: {
      type: Date,
      default: null,
    },
    totalRecharged: {
      type: Number,
      default: 0,
    },
    totalWithdrawn: {
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


// Hash password before saving to database and generate referralCode if needed
userSchema.pre('save', async function () {
  if (!this.referralCode) {
    this.referralCode = 'JNT' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Exclude password from transformed JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const userModel = mongoose.model('User', userSchema);

export default userModel;
