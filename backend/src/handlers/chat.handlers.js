const Message = require('../models/message.model');
const crypto = require('crypto');
const { uploadFile, getFile } = require('../utils/filestorage');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const IV_LENGTH = 16;

exports.sendMessage = async (req, res) => {
    try {
        const { groupId, content, file } = req.body;
        let encryptedContent = content;
        let fileUrl = file;

        if (content) {
            const iv = crypto.randomBytes(IV_LENGTH);
            const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
            encryptedContent = Buffer.concat([cipher.update(content), cipher.final()]).toString('hex');
            encryptedContent = iv.toString('hex') + ':' + encryptedContent;
        }

        const message = new Message({
            groupId,
            senderId: req.session.userId,
            content: encryptedContent,
            file: fileUrl
        });
        await message.save();
        await require('./notification.controller').sendNotification(
            (await require('../models/group.model').findById(groupId)).members,
            `New message in group`
        );
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

            return { ...msg._doc, content: decryptedContent, file: fileUrl };
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
        const file = req.files?.file; // Assuming multipart/form-data with 'file' field
        if (!file) return res.status(400).json({ error: 'No file provided' });
        const fileId = await uploadFile(file.data, groupId);
        res.json({ message: 'File uploaded successfully', fileId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};