const Message = require('../models/message.model');

exports.sendMessage = async (req, res) => {
    try {
        const { groupId, content, file } = req.body;
        const message = new Message({
            groupId,
            senderId: req.session.userId,
            content,
            file
        });
        await message.save();
        res.status(201).json({ message: 'Message sent' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ groupId: req.params.groupId }).populate('senderId', 'name');
        res.json(messages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};