const { Router } = require('express');
const postController = require('../controllers/postController');
const upload = require('../middleware/uploadMiddleware');

const router = Router();

router.get('/', postController.getFeed);
router.post('/post', upload.single('image'), postController.createPost);
router.post('/like/:id', postController.likePost);
router.post('/comment/:id', postController.commentPost);
router.delete('/:id', postController.deletePost);

module.exports = router;
