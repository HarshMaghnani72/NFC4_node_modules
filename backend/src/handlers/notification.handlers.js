const mongoose = require('mongoose');
const Notification = require('../models/notification.model');
const User = require('../models/user.model');

// Send a notification to a list of user IDs
exports.sendNotification = async (userIds, message) => {
    try {
        // Validate userIds
        if (!Array.isArray(userIds) || userIds.length === 0) {
            throw new Error('Invalid or empty userIds array');
        }

        // Ensure all userIds are valid ObjectIds
        const validUserIds = userIds.filter(id => mongoose.Types.ObjectId.isValid(id));
        if (validUserIds.length === 0) {
            throw new Error('No valid user IDs provided');
        }

        // Verify users exist
        const users = await User.find({ _id: { $in: validUserIds } });
        if (users.length === 0) {
            throw new Error('No valid users found for notifications');
        }

        // Create notifications for each user
        const notifications = validUserIds.map(userId => ({
            userId,
            message,
            read: false,
            createdAt: new Date()
        }));

        // Insert notifications
        await Notification.insertMany(notifications);
        console.log(`Notifications sent to ${validUserIds.length} users: ${message}`);
    } catch (error) {
        console.error('Error in sendNotification:', error);
        throw error; // Let the calling function handle the error
    }
};

// Get notifications for a user (unread by default, or all if specified)
exports.getNotifications = async (req, res) => {
    try {
        console.log('getNotifications session:', req.session);
        const userId = req.session.userId;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ error: 'Invalid or missing user session' });
        }
        const { read } = req.query;
        const query = { userId };
        if (read === 'true') {
            query.read = true;
        } else if (read === 'false') {
            query.read = false;
        }
        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (error) {
        console.error('Error in getNotifications:', error);
        res.status(400).json({ error: error.message });
    }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({ error: 'Invalid notification ID' });
        }

        const userId = req.session.userId;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ error: 'Invalid or missing user session' });
        }

        const notification = await Notification.findOne({ _id: notificationId, userId });
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found or not owned by user' });
        }

        notification.read = true;
        await notification.save();
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error in markNotificationAsRead:', error);
        res.status(400).json({ error: error.message });
    }
};

// Mark all notifications for a user as read
exports.markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ error: 'Invalid or missing user session' });
        }

        await Notification.updateMany(
            { userId, read: false },
            { $set: { read: true } }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error in markAllNotificationsAsRead:', error);
        res.status(400).json({ error: error.message });
    }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({ error: 'Invalid notification ID' });
        }

        const userId = req.session.userId;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ error: 'Invalid or missing user session' });
        }

        const result = await Notification.deleteOne({ _id: notificationId, userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Notification not found or not owned by user' });
        }

        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Error in deleteNotification:', error);
        res.status(400).json({ error: error.message });
    }
};