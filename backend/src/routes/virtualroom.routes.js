const express = require('express');
const router = express.Router();
const { startSession, endSession } = require('../handlers/virtualroom.handlers');

router.post('/start', startSession);
router.post('/end', endSession);

module.exports = router;