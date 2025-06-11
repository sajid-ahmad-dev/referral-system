const express = require("express");
const { PORT } = require("./config/server-config");
const { DBconnect } = require("./config/db-config");
const { apiRouter } = require("./routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);

DBconnect();

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
