const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile (availability, skills, location)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      
      if (user.role === 'worker') {
        if (req.body.skills) user.skills = req.body.skills;
        if (req.body.availability !== undefined) user.availability = req.body.availability;
        if (req.body.location) user.location = req.body.location;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role,
        skills: updatedUser.skills,
        availability: updatedUser.availability,
        location: updatedUser.location,
        rating: updatedUser.rating,
        verified: updatedUser.verified
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nearby workers
// @route   GET /api/users/workers
// @access  Private
const getNearbyWorkers = async (req, res) => {
  try {
    const { lng, lat, distance = 10 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const maxDistanceInMeters = distance * 1000;

    const workers = await User.find({
      role: 'worker',
      availability: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: maxDistanceInMeters
        }
      }
    }).select('-password').sort({ rating: -1 }); // Default sort by rating

    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get worker by ID
// @route   GET /api/users/workers/:id
// @access  Private
const getWorkerById = async (req, res) => {
  try {
    const worker = await User.findById(req.params.id).select('-password');
    if (worker && worker.role === 'worker') {
      res.json(worker);
    } else {
      res.status(404).json({ message: 'Worker not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getNearbyWorkers,
  getWorkerById
};
