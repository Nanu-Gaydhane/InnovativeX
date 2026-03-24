const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workerAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'assigned', 'completed', 'cancelled'], default: 'open' },
  urgency: { type: String, enum: ['normal', 'urgent'], default: 'normal' },
  
  // Job location
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
}, { timestamps: true });

JobSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Job', JobSchema);
