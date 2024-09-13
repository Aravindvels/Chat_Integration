const socketIo = require("socket.io");
const Message = require("../models/Chat");

const setupWebSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    console.log("New client connected");

    socket.on("sendMessage", async (message) => {
      console.log("Received message:", message);
      const newMessage = new Message({
        content: message.message,
        user: message.user,
      });
      await newMessage.save();

      io.emit("receiveMessage", {
        content: message.message,
        user: message.user,
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

module.exports = setupWebSocket;
