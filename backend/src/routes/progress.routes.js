const express = require('express');
const router = express.Router();
const { updateProgress, getProgress, getLeaderboard, addTodo } = require('../handlers/progress.handlers');

router.get('/', getProgress);
router.put('/', updateProgress);
router.get('/leaderboard', getLeaderboard);
router.post('/todo',addTodo)
module.exports = router;