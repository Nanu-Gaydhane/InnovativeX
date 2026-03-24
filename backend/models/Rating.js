const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }
}, { timestamps: true });

// Prevent multiple ratings for same job by same customer
RatingSchema.index({ job: 1, customer: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema);
