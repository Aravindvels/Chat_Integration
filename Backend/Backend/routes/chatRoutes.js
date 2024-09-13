const express = require('express');
const { getAllChats } = require('../controllers/chatController');

const router = express.Router();

router.get("/", getAllChats);

module.exports = router;