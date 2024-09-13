const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  content: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTest",
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
