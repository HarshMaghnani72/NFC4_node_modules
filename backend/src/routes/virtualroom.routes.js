const express = require('express');
const router = express.Router();
const { startSession, endSession } = require('../controllers/virtualRoom.controller');

router.post('/start', startSession);
router.post('/end', endSession);

module.exports = router;