const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const { PORT } = require("./config/server-config");
const { DBconnect } = require("./config/db-config");
const { apiRouter } = require("./routes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("New client connected");

  // Join user's personal room for real-time updates
  socket.on("joinUserRoom", (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use("/api", apiRouter);

DBconnect();

// Change this line from app.listen to server.listen
server.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
