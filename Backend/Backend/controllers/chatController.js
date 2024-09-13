const Chat = require("../models/Chat");

exports.getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find({})
        .sort({ timestamp: 1 })
        .populate('user', 'username email'); 

        return res.status(200).json({ data: chats });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}