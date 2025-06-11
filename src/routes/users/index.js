const express = require("express");
const { userSignUp, userLogin } = require("../../controllers/userController");
const userRouter = express.Router();

userRouter.post("/register", userSignUp);
userRouter.post("/login", userLogin);

module.exports = { userRouter };
