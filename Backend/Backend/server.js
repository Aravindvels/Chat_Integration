const express = require("express");
const http = require("http");
const setupWebSocket = require("./config/websocket");
require("dotenv").config();
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const DBConnection = require("./config/db.js");

const app = express();
const server = http.createServer(app);
DBConnection();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

setupWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
