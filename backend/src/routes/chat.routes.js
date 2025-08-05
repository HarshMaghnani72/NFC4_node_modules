const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getFile, uploadFile } = require('../handlers/chat.handlers');
const fileUpload = require('express-fileupload');

router.use(fileUpload());
router.post('/send', sendMessage);
router.get('/:groupId', getMessages);
router.get('/file/:fileId', getFile);
router.post('/upload', uploadFile);

module.exports = router;