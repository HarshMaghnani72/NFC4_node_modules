const User = require('../models/user.model');

exports.updateProgress = async (req, res) => {
    try {
        const { studyHours, tasksCompleted, xp } = req.body;
        const user = await User.findById(req.session.userId);
        user.studyHours += studyHours || 0;
        user.tasksCompleted += tasksCompleted || 0;
        user.xp += xp || 0;
        await user.save();
        res.json({ message: 'Progress updated' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        res.json({ studyHours: user.studyHours, tasksCompleted: user.tasksCompleted, xp: user.xp });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find().sort({ xp: -1 }).limit(10);
        res.json(users.map(u => ({ name: u.name, xp: u.xp })));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};