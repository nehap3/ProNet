const { Router } = require('express');
const jobController = require('../controllers/jobController');

const router = Router();

router.get('/', jobController.getJobs);
router.get('/post', jobController.renderPostJob);
router.post('/post', jobController.createJob);
router.get('/:id', jobController.getJobDetail);
router.post('/apply/:id', jobController.applyJob);
router.post('/save/:id', jobController.saveJob);

module.exports = router;
