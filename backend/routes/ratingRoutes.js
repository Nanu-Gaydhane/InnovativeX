const express = require('express');
const router = express.Router();
const { addRating, getWorkerRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');

router.post('/', protect, roleCheck(['customer']), addRating);
router.get('/worker/:id', getWorkerRatings);

module.exports = router;
