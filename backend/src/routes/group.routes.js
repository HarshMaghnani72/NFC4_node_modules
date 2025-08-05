const express = require('express');
const router = express.Router();
const { getMatches, joinGroup, createGroup, getGroupDetails } = require('../controllers/group.controller');

router.get('/matches', getMatches);
router.post('/join', joinGroup);
router.post('/create', createGroup);
router.get('/:id', getGroupDetails);

module.exports = router;