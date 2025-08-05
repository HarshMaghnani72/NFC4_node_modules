const User = require('../models/user.model');
const Report = require('../models/report.model');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.session.userId, updates, { new: true });
        res.json({ message: 'Profile updated', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.reportUser = async (req, res) => {
    try {
        const { reportedUserId, reason } = req.body;
        const report = new Report({
            reporterId: req.session.userId,
            reportedUserId,
            reason
        });
        await report.save();
        res.json({ message: 'User reported successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.togglePrivacy = async (req, res) => {
    try {
        const { acceptInvites } = req.body;
        await User.findByIdAndUpdate(req.session.userId, { acceptInvites });
        res.json({ message: 'Privacy settings updated' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};