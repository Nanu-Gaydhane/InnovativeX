const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getNearbyWorkers, getWorkerById } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/workers', protect, getNearbyWorkers);
router.get('/workers/:id', protect, getWorkerById);

module.exports = router;
