const express = require('express');
const router = express.Router();
const { updateProfile, getProfile, reportUser, togglePrivacy } = require('../handlers/user.handlers');

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/report', reportUser);
router.put('/privacy', togglePrivacy);

module.exports = router;