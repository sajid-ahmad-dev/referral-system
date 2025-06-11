const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/server-config");
const User = require("../Model/UserSchema");
const { StatusCodes } = require("http-status-codes");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const decoded = jwt.verify(JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Wrong Credentials" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Please authenticate" });
  }
};
