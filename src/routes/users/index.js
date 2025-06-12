const express = require("express");
const {
  userSignUp,
  userLogin,
  getProfile,
} = require("../../controllers/userController");
const { auth } = require("../../middlewares/auth");
const userRouter = express.Router();

userRouter.post("/register", userSignUp);
userRouter.post("/login", userLogin);

userRouter.post("/profile", auth, getProfile);

module.exports = { userRouter };
