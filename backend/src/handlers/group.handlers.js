const Group = require('../models/group.model');
const User = require('../models/user.model');

exports.getMatches = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const groups = await Group.find({
            subjects: { $in: user.subjects },
            'availability.start': { $gte: user.availability.start },
            'availability.end': { $lte: user.availability.end },
            learningStyle: user.learningStyle
        });
        res.json(groups);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.joinGroup = async (req, res) => {
    try {
        const { groupId } = req.body;
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ error: 'Group not found' });
        if (!group.members.includes(req.session.userId)) {
            group.members.push(req.session.userId);
            await group.save();
        }
        res.json({ message: 'Joined group successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.createGroup = async (req, res) => {
    try {
        const { name, subjects, availability, learningStyle } = req.body;
        const group = new Group({
            name,
            subjects,
            availability,
            learningStyle,
            members: [req.session.userId]
        });
        await group.save();
        res.status(201).json({ message: 'Group created', groupId: group._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getGroupDetails = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate('members', 'name email');
        if (!group) return res.status(404).json({ error: 'Group not found' });
        res.json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};