const Message = require('../models/message.model');
const Group = require('../models/group.model');
const crypto = require('crypto');
const { uploadFile, getFile } = require('../utils/filestorage');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const IV_LENGTH = 16;

exports.sendMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content, file } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!group.members.some(member => member._id.toString() === req.session.userId)) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }

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
      file: fileUrl,
    });
    await message.save();

    const notificationHandler = require('./notification.handlers');
    await notificationHandler.sendNotification(
      group.members.filter(id => id.toString() !== req.session.userId),
      `New message in group ${group.name}`
    );

    const wss = require('./websocket.handler').getWebSocketServer();
    const sender = await require('../models/user.model').findById(req.session.userId);
    const messageData = {
      id: message._id,
      groupId,
      sender: sender.name,
      content: content || '',
      file: fileUrl,
      time: message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: fileUrl ? 'file' : 'text',
    };

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
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!group.members.some(member => member._id.toString() === req.session.userId)) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }

    const messages = await Message.find({ groupId }).populate('senderId', 'name');
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
        type: fileUrl ? 'file' : 'text',
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
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!group.members.some(member => member._id.toString() === req.session.userId)) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }

    const file = req.files?.file;
    if (!file) return res.status(400).json({ error: 'No file provided' });
    const fileId = await uploadFile(file.data, groupId);
    res.json({ message: 'File uploaded successfully', fileId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};