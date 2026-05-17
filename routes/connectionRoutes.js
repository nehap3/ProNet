const { Router } = require('express');
const connectionController = require('../controllers/connectionController');

const router = Router();

router.get('/', connectionController.getNetwork);
router.post('/request/:id', connectionController.sendRequest);
router.post('/accept/:id', connectionController.acceptRequest);
router.post('/reject/:id', connectionController.rejectRequest);
router.post('/remove/:id', connectionController.removeConnection);

module.exports = router;
