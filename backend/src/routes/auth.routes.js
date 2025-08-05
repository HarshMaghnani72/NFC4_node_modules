const express = require('express');
const router = express.Router();
const { register, login, logout, googleLogin } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google', googleLogin);

module.exports = router;