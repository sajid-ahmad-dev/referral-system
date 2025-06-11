const express = require("express");
const { PORT } = require("./config/server-config");
const { DBconnect } = require("./config/db-config");
const app = express();

DBconnect();
app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
