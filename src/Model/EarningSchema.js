const mongoose = require("mongoose");

const EarningSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    profit: {
      type: Number,
      required: true,
      default: function () {
        if (this.type === "PURCHASE") {
          if (this.amount < 1000) {
            return 0; // No profit for purchases less than 1000
          }
          return this.amount * 0.2; // 20% profit for purchases > = 1000
        }
        return 0;
      },
    },
    type: {
      type: String,
      enum: ["PURCHASE", "EARNING"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    referralEarnings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        amount: Number,
        level: {
          type: Number,
          enum: [1, 2],
        },
        percentage: Number,
      },
    ],
  },
  { timestamps: true }
);

const Earning = mongoose.model("Earning", EarningSchema);

module.exports = Earning;
