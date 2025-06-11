const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    referralCode: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
      },
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    directReferrals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    totalEarnings: {
      type: Number,
      default: 0,
    },
    level1Earnings: {
      type: Number,
      default: 0,
    },
    level2Earnings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Ensure direct referrals don't exceed 8
UserSchema.pre("save", function (next) {
  if (this.directReferrals.length > 8) {
    next(new Error("Maximum direct referrals limit exceeded"));
  }
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
