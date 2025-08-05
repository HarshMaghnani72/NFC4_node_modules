const express = require('express');
const router = express.Router();
const { getNotifications, markNotificationRead } = require('../handlers/notification.handlers');

router.get('/', getNotifications);
router.put('/read', markNotificationRead);

module.exports = router;