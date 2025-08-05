const express = require('express');
const router = express.Router();
const { updateProgress, getProgress, getLeaderboard } = require('../controllers/progress.controller');

router.get('/', getProgress);
router.put('/', updateProgress);
router.get('/leaderboard', getLeaderboard);

module.exports = router;