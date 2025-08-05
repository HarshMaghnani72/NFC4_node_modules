const express = require('express');
const router = express.Router();
const { register, login, logout, googleLogin } = require('../handlers/auth.handlers');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google', googleLogin);

module.exports = router;