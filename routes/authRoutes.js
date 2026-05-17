const { Router } = require('express');
const authController = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');

const router = Router();

router.get('/register', authController.register_get);
router.post('/register', upload.single('profilePhoto'), authController.register_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

module.exports = router;
