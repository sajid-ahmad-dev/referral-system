const { StatusCodes } = require("http-status-codes");
const User = require("../Model/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../config/server-config");
const ReferralService = require("../Services/ReferralServices");

const userSignUp = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "provide the details username,email,password" });
    }

    const { username, email, password, referralCode } = req.body;

    const existingUser = await User.findOne({
      username: username,
      email: email,
    });

    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: "User already exists with this email or username" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await user.save();

    if (referralCode) {
      try {
        await ReferralService.processReferral(referralCode, user._id);
      } catch (error) {
        console.error("Referral processing error:", error);
      }
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.status(StatusCodes.CREATED).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        referralCode: user.referralCode,
      },
      token: token,
      message: referralCode
        ? "User registered successfully. Note: Invalid referral code was provided."
        : "User registered successfully.",
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  userSignUp,
};
