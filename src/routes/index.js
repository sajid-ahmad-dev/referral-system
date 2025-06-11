const express = require("express");
const { userRouter } = require("./users");
const { earningsRouter } = require("./earnings");

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/earnings", earningsRouter);

module.exports = { apiRouter };
