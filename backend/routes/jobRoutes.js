const express = require('express');
const router = express.Router();
const { createJob, getNearbyJobs, getMyJobs, updateJobStatus } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');

router.route('/')
  .post(protect, roleCheck(['customer']), createJob);

router.get('/nearby', protect, roleCheck(['worker']), getNearbyJobs);
router.get('/myjobs', protect, roleCheck(['customer']), getMyJobs);
router.put('/:id/status', protect, updateJobStatus);

module.exports = router;
