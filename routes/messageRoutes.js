const { Router } = require('express');
const messageController = require('../controllers/messageController');

const router = Router();

router.get('/', messageController.getMessages);
router.post('/send', messageController.sendMessage);

module.exports = router;
