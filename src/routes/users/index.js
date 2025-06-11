const express = require("express");
const { userSignUp } = require("../../controllers/userController");
const userRouter = express.Router();

userRouter.post("/register", userSignUp);

module.exports = { userRouter };
