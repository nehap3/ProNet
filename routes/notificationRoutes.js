const { Router } = require('express');
const notificationController = require('../controllers/notificationController');

const router = Router();

router.get('/', notificationController.getNotifications);

module.exports = router;
