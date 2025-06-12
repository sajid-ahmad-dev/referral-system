const { StatusCodes } = require("http-status-codes");
const Earning = require("../Model/EarningSchema");
const ReferralService = require("../Services/ReferralServices");

const purchasing = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Provide the amount" });
    }

    if (amount < 1000) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Minimum purchase amount is 1000" });
    }

    const purchase = await ReferralService.processPurchase(
      req.user._id,
      amount
    );

    // Emit socket event for real-time updates
    req.app.get("io").emit("newPurchase", {
      userId: req.user._id,
      amount,
      profit: purchase.profit,
    });

    res.status(StatusCodes.CREATED).json(purchase);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Get user's transaction history
const purchasingHistory = async (req, res) => {
  try {
    const transactions = await Earning.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("referralEarnings.user", "username email");

    res.status(StatusCodes.OK).json(transactions);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Get earnings summary
const summary = async (req, res) => {
  try {
    const stats = await ReferralService.getUserReferralStats(req.user._id);

    const earningsSummary = {
      totalEarnings: stats.totalEarnings,
      level1Earnings: stats.level1Earnings,
      level2Earnings: stats.level2Earnings,
      recentTransactions: stats.transactions.slice(0, 10),
    };

    res.status(StatusCodes.OK).json(earningsSummary);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  purchasing,
  purchasingHistory,
  summary,
};
