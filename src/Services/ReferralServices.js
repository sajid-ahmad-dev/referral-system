const User = require("../Model/UserSchema");

const Earning = require("../Model/EarningSchema");

class ReferralService {
  static async processReferral(referralCode, newUserId) {
    try {
      const referrer = await User.findOne({ referralCode });
      if (!referrer) {
        throw new Error("Invalid referral code provided");
      }

      const newUser = await User.findById(newUserId);
      if (!newUser) {
        throw new Error("User not found");
      }

      if (referrer.directReferrals.length >= 8) {
        throw new Error("Referrer has reached maximum direct referrals limit");
      }

      // Check if user is trying to use their own referral code
      if (referrer._id.toString() === newUserId.toString()) {
        throw new Error("Cannot use your own referral code");
      }

      newUser.referredBy = referrer._id;
      referrer.directReferrals.push(newUser._id);

      await Promise.all([newUser.save(), referrer.save()]);
      return { referrer, newUser };
    } catch (error) {
      throw new Error(`Referral processing failed: ${error.message}`);
    }
  }

  static async processPurchase(userId, amount) {
    try {
      if (amount < 1000) {
        throw new Error("Purchase amount must be at least 1000Rs");
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Create purchase transaction
      const purchase = new Earning({
        user: userId,
        amount,
        type: "PURCHASE",
        status: "COMPLETED",
      });
      await purchase.save();

      // Process Level 1 earnings (direct referral)
      if (user.referredBy) {
        const level1Referrer = await User.findById(user.referredBy);
        const level1Earning = purchase.profit * 0.05; // 5% of profit

        const level1Transaction = new Earning({
          user: level1Referrer._id,
          amount: level1Earning,
          type: "EARNING",
          status: "COMPLETED",
          referralEarnings: [
            {
              user: userId,
              amount: level1Earning,
              level: 1,
              percentage: 5,
            },
          ],
        });

        level1Referrer.totalEarnings += level1Earning;
        level1Referrer.level1Earnings += level1Earning;
        await Promise.all([level1Transaction.save(), level1Referrer.save()]);

        // Process Level 2 earnings (indirect referral)
        if (level1Referrer.referredBy) {
          const level2Referrer = await User.findById(level1Referrer.referredBy);
          const level2Earning = purchase.profit * 0.01; // 1% of profit

          const level2Transaction = new Earning({
            user: level2Referrer._id,
            amount: level2Earning,
            type: "EARNING",
            status: "COMPLETED",
            referralEarnings: [
              {
                user: userId,
                amount: level2Earning,
                level: 2,
                percentage: 1,
              },
            ],
          });

          level2Referrer.totalEarnings += level2Earning;
          level2Referrer.level2Earnings += level2Earning;
          await Promise.all([level2Transaction.save(), level2Referrer.save()]);
        }
      }

      return purchase;
    } catch (error) {
      throw error;
    }
  }

  static async getUserReferralStats(userId) {
    try {
      const user = await User.findById(userId)
        .populate("directReferrals", "username email totalEarnings")
        .populate("referredBy", "username email");

      const transactions = await Earning.find({
        user: userId,
        type: "EARNING",
      }).sort({ createdAt: -1 });

      return {
        user,
        transactions,
        totalEarnings: user.totalEarnings,
        level1Earnings: user.level1Earnings,
        level2Earnings: user.level2Earnings,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ReferralService;
