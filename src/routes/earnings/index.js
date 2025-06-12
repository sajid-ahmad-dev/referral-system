const express = require("express");
const { auth } = require("../../middlewares/auth");
const {
  purchasing,
  summary,
  purchasingHistory,
} = require("../../controllers/earningController");

const earningsRouter = express.Router();

earningsRouter.post("/purchase", auth, purchasing);
earningsRouter.get("/summary", auth, summary);
earningsRouter.get("/history", auth, purchasingHistory);

module.exports = { earningsRouter };
