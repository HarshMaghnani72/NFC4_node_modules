const Message = require('../models/message.model');
const crypto = require('crypto');
const { uploadFile, getFile } = require('../utils/filestorage');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const IV_LENGTH = 16;

exports.sendMessage = async (req, res) => {
    try {
        const { groupId, content, file } = req.body;
        let encryptedContent = content;
        let fileUrl = null;

        if (content) {
            const iv = crypto.randomBytes(IV_LENGTH);
            const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
            encryptedContent = Buffer.concat([cipher.update(content), cipher.final()]).toString('hex');
            encryptedContent = iv.toString('hex') + ':' + encryptedContent;
        }

        if (file) {
            fileUrl = file;
        }

        const message = new Message({
            groupId,
            senderId: req.session.userId,
            content: encryptedContent,
            file: fileUrl
        });
        await message.save();

        // Fetch group members
        const group = await require('../models/group.model').findById(groupId);
        const notificationHandler = require('./notification.handlers');
        await notificationHandler.sendNotification(group.members, `New message in group`);

        // Broadcast message to WebSocket clients in the group
        const wss = require('./websocket.handler').getWebSocketServer();
        const decryptedContent = content || ''; // For broadcasting, use original content
        const sender = await require('../models/user.model').findById(req.session.userId);
        const messageData = {
            id: message._id,
            groupId,
            sender: sender.name,
            content: decryptedContent,
            file: fileUrl,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
        };

        // Broadcast to all connected clients in the group
        wss.clients.forEach(client => {
            if (client.isAlive && client.groups.includes(groupId)) {
                client.send(JSON.stringify({ type: 'message', data: messageData }));
            }
        });

        res.status(201).json({ message: 'Message sent' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ groupId: req.params.groupId }).populate('senderId', 'name');
        const decryptedMessages = messages.map(msg => {
            let decryptedContent = msg.content;
            let fileUrl = msg.file;

            if (msg.content) {
                const [iv, encrypted] = msg.content.split(':');
                const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
                decryptedContent = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]).toString();
            }

            return {
                id: msg._id,
                groupId: msg.groupId,
                sender: msg.senderId.name,
                content: decryptedContent,
                file: fileUrl,
                time: msg.createdAt,
                type: 'text'
            };
        });

        res.json(decryptedMessages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const fileStream = await getFile(fileId);
        fileStream.pipe(res);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.uploadFile = async (req, res) => {
    try {
        const { groupId } = req.body;
        const file = req.files?.file;
        if (!file) return res.status(400).json({ error: 'No file provided' });
        const fileId = await uploadFile(file.data, groupId);
        res.json({ message: 'File uploaded successfully', fileId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};