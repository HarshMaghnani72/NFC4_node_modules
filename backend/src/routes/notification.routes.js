const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} = require('../handlers/notification.handlers');

// GET notifications (with optional read query param)
router.get('/', getNotifications);

// PUT single notification as read
router.put('/read', markNotificationAsRead);

// PUT all notifications as read
router.put('/read/all', markAllNotificationsAsRead);

// DELETE a notification
router.delete('/', deleteNotification);

module.exports = router;
