const express = require('express');
const router = express.Router();
const { getMatches, joinGroup, createGroup, getGroupDetails } = require('../handlers/group.handlers');

router.get('/matches', getMatches);
router.post('/join', joinGroup);
router.post('/create', createGroup);
router.get('/:id', getGroupDetails);

module.exports = router;