const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

UserSchema.pre("save", async function (next) {
  try {
    // Password hashing

    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    // Limit direct referrals

    if (this.directReferrals && this.directReferrals.length > 8) {
      return next(new Error("Maximum direct referrals limit exceeded"));
    }

    // Generate unique referral code

    if (!this.referralCode) {
      let isUnique = false;
      while (!isUnique) {
        const newCode = Math.random().toString(36).slice(2, 8).toUpperCase();
        const existingUser = await mongoose.models.User.findOne({
          referralCode: newCode,
        });
        if (!existingUser) {
          this.referralCode = newCode;
          isUnique = true;
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
