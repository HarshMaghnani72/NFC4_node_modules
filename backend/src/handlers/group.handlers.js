const Group = require('../models/group.model');
const User = require('../models/user.model');

exports.getMatches = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const groups = await Group.find({
            subjects: { $in: user.subjects },
            learningStyle: user.learningStyle
        }).populate('members', 'name xp studyHours');

        const scoredGroups = groups.map(group => {
            let compatibilityScore = 0;

            // Subject overlap (weight: 40%)
            const commonSubjects = group.subjects.filter(s => user.subjects.includes(s)).length;
            compatibilityScore += (commonSubjects / user.subjects.length) * 40;

            // Availability overlap (weight: 30%)
            const userStart = new Date(user.availability.start).getTime();
            const userEnd = new Date(user.availability.end).getTime();
            const groupStart = new Date(group.availability.start).getTime();
            const groupEnd = new Date(group.availability.end).getTime();
            const overlap = Math.min(userEnd, groupEnd) - Math.max(userStart, groupStart);
            if (overlap > 0) {
                compatibilityScore += (overlap / (userEnd - userStart)) * 30;
            }

            // Learning style match (weight: 20%)
            if (group.learningStyle === user.learningStyle) {
                compatibilityScore += 20;
            }

            // Group activity level (weight: 10%)
            const avgMemberXP = group.members.reduce((sum, m) => sum + m.xp, 0) / group.members.length;
            compatibilityScore += (Math.min(avgMemberXP / user.xp, 1)) * 10;

            return { ...group._doc, compatibilityScore };
        });

        scoredGroups.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
        res.json(scoredGroups);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.joinGroup = async (req, res) => {
    try {
        const { groupId } = req.body;
        const group = await Group.findById(groupId);
        const user = await User.findById(req.session.userId);
        if (!group) return res.status(404).json({ error: 'Group not found' });
        if (!user.acceptInvites) return res.status(403).json({ error: 'User has disabled group invites' });
        if (!group.members.includes(req.session.userId)) {
            group.members.push(req.session.userId);
            await group.save();
            // Trigger notification
            await require('./notification.handlers').sendNotification(
                group.members.filter(id => id.toString() !== req.session.userId),
                `New member ${user.name} joined group ${group.name}`
            );
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
        const group = await Group.findById(req.params.id).populate('members', 'name email xp');
        if (!group) return res.status(404).json({ error: 'Group not found' });
        res.json(group);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.approveInvite = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ error: 'Group not found' });
        if (!group.pendingInvites.includes(userId)) {
            return res.status(400).json({ error: 'No pending invite for this user' });
        }
        group.pendingInvites = group.pendingInvites.filter(id => id.toString() !== userId);
        group.members.push(userId);
        await group.save();
        await require('./notification.handlers').sendNotification(
            [userId],
            `Your invite to group ${group.name} was approved`
        );
        res.json({ message: 'Invite approved' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.declineInvite = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ error: 'Group not found' });
        group.pendingInvites = group.pendingInvites.filter(id => id.toString() !== userId);
        await group.save();
        await require('./notification.handlers').sendNotification(
            [userId],
            `Your invite to group ${group.name} was declined`
        );
        res.json({ message: 'Invite declined' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};