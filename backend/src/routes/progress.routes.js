const express = require('express');
const router = express.Router();
const { updateProgress, getProgress, getLeaderboard } = require('../handlers/progress.handlers');

router.get('/', getProgress);
router.put('/', updateProgress);
router.get('/leaderboard', getLeaderboard);

module.exports = router;