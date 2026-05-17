const { Router } = require('express');
const userController = require('../controllers/userController');
const upload = require('../middleware/uploadMiddleware');

const router = Router();

router.get('/edit', userController.editProfilePage);
router.put('/edit', upload.single('profilePhoto'), userController.updateProfile);

router.post('/experience', userController.addExperience);
router.post('/education', userController.addEducation);

router.get('/:id', userController.viewProfile);

module.exports = router;
