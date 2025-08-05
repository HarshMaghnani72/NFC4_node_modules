const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chat.controller');

router.post('/send', sendMessage);
router.get('/:groupId', getMessages);

module.exports = router;