const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getFile, uploadFile } = require('../handlers/chat.handlers');
const fileUpload = require('express-fileupload');

router.use(fileUpload());
router.post('/:groupId/message', sendMessage);
router.get('/:groupId/messages', getMessages);
router.get('/file/:fileId', getFile);
router.post('/:groupId/upload', uploadFile);

module.exports = router;