const { StatusCodes } = require("http-status-codes");
const User = require("../Model/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../config/server-config");
const ReferralService = require("../Services/ReferralServices");

const userSignUp = async (req, res) => {
  try {
    const { username, email, password, referralCode } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Please provide username, email, and password.",
      });
    }

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

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "please provide with the email and password" });
    }

    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "user does not found" });
    }
    const decodePassword = await bcrypt.compare(password, user.password);
    if (!decodePassword) {
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ error: "wrong credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    return res.status(StatusCodes.OK).json(
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          referralCode: user.referralCode,
        },
      },
      { token: token }
    );
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userData = await ReferralService.getUserReferralStats(req.user._id);
    res.json(userData);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  userSignUp,
  userLogin,
  getProfile,
};
