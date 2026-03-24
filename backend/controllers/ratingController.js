const Rating = require('../models/Rating');
const User = require('../models/User');

// @desc    Add a rating for a worker
// @route   POST /api/ratings
// @access  Private/Customer
const addRating = async (req, res) => {
  try {
    const { job, worker, rating, comment } = req.body;

    if (!job || !worker || !rating) {
      return res.status(400).json({ message: 'Please provide job, worker and rating' });
    }

    // Create the rating
    const newRating = await Rating.create({
      job,
      worker,
      customer: req.user._id,
      rating,
      comment
    });

    // Update worker's average rating
    const ratings = await Rating.find({ worker });
    const numReviews = ratings.length;
    const avgRating = ratings.reduce((acc, item) => item.rating + acc, 0) / numReviews;

    await User.findByIdAndUpdate(worker, {
      rating: parseFloat(avgRating.toFixed(1)),
      numReviews
    });

    res.status(201).json(newRating);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already rated this job/worker' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ratings for a worker
// @route   GET /api/ratings/worker/:id
// @access  Public
const getWorkerRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ worker: req.params.id }).populate('customer', 'name');
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addRating,
  getWorkerRatings
};
