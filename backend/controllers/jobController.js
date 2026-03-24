const Job = require('../models/Job');

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Customer
const createJob = async (req, res) => {
  try {
    const { title, description, budget, urgency, location } = req.body;

    if (!title || !description || !budget || !location) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const job = await Job.create({
      title,
      description,
      budget,
      urgency,
      location,
      customer: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nearby jobs for worker
// @route   GET /api/jobs/nearby
// @access  Private/Worker
const getNearbyJobs = async (req, res) => {
  try {
    const { lng, lat, distance = 10 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const maxDistanceInMeters = distance * 1000;

    let queryContext = {
      status: 'open',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: maxDistanceInMeters
        }
      }
    };

    const jobs = await Job.find(queryContext).populate('customer', 'name phone').sort({ urgency: -1, createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get jobs created by current customer
// @route   GET /api/jobs/myjobs
// @access  Private/Customer
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job status (e.g., mark completed)
// @route   PUT /api/jobs/:id/status
// @access  Private
const updateJobStatus = async (req, res) => {
  try {
    const { status, workerAssigned } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the user is the customer who created it or the assigned worker
    if (job.customer.toString() !== req.user._id.toString() && req.user.role !== 'worker') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    job.status = status || job.status;
    if (workerAssigned) job.workerAssigned = workerAssigned;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getNearbyJobs,
  getMyJobs,
  updateJobStatus
};
