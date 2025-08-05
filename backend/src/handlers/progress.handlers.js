const User = require('../models/user.model');
const Todo = require('../models/todo.model');

exports.updateProgress = async (req, res) => {
    try {
        const { studyHours, tasksCompleted, xp } = req.body;
        const user = await User.findById(req.session.userId);
        user.studyHours += studyHours || 0;
        user.tasksCompleted += tasksCompleted || 0;
        user.xp += xp || 0;

        // Award badges based on milestones
        if (user.studyHours >= 100 && !user.badges.includes('StudyMaster')) {
            user.badges.push('StudyMaster');
        }
        if (user.tasksCompleted >= 50 && !user.badges.includes('TaskChampion')) {
            user.badges.push('TaskChampion');
        }
        if (user.xp >= 1000 && !user.badges.includes('XPLeader')) {
            user.badges.push('XPLeader');
        }

        await user.save();
        res.json({ message: 'Progress updated', badges: user.badges });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        const todos = await Todo.find({ userId: req.session.userId });
        res.json({ studyHours: user.studyHours, tasksCompleted: user.tasksCompleted, xp: user.xp, badges: user.badges, todos });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find().sort({ xp: -1 }).limit(10);
        res.json(users.map(u => ({ name: u.name, xp: u.xp, badges: u.badges })));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.ratePeer = async (req, res) => {
    try {
        const { peerId, rating } = req.body;
        if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        const peer = await User.findById(peerId);
        if (!peer) return res.status(404).json({ error: 'User not found' });
        peer.ratings.push({ raterId: req.session.userId, score: rating });
        await peer.save();
        res.json({ message: 'Peer rated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.addTodo = async (req, res) => {
    try {
        const { groupId, task } = req.body;
        const todo = new Todo({
            groupId,
            userId: req.session.userId,
            task,
            completed: false
        });
        await todo.save();
        await require('./notification.handlers').sendNotification(
            (await Group.findById(groupId)).members,
            `New todo added: ${task}`
        );
        res.status(201).json({ message: 'Todo added' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.completeTodo = async (req, res) => {
    try {
        const { todoId } = req.body;
        const todo = await Todo.findById(todoId);
        if (!todo) return res.status(404).json({ error: 'Todo not found' });
        todo.completed = true;
        await todo.save();
        await require('./notification.handlers').sendNotification(
            (await Group.findById(todo.groupId)).members,
            `Todo completed: ${todo.task}`
        );
        await User.findByIdAndUpdate(req.session.userId, { $inc: { tasksCompleted: 1, xp: 10 } });
        res.json({ message: 'Todo completed' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};