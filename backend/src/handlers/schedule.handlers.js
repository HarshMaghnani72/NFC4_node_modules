const User = require('../models/user.model');

exports.getSchedule = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        res.json(user.availability);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateSchedule = async (req, res) => {
    try {
        const { availability } = req.body;
        await User.findByIdAndUpdate(req.session.userId, { availability });
        res.json({ message: 'Schedule updated' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.syncGoogleCalendar = (req, res) => {
    // Placeholder for Google Calendar sync logic
    res.status(501).json({ error: 'Google Calendar sync not implemented' });
};