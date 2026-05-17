const { Router } = require('express');
const jobController = require('../controllers/jobController');

const router = Router();

router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobDetail);
router.post('/apply/:id', jobController.applyJob);
router.post('/save/:id', jobController.saveJob);

module.exports = router;
