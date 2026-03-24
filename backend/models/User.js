const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['worker', 'customer'], required: true },
  
  // Worker-specific fields
  skills: [{ type: String }],
  experience: { type: Number },
  availability: { type: Boolean, default: true },
  verified: { type: Boolean, default: false },
  
  // Geo-location for both (worker current loc, customer preferred loc)
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  
  // Stats
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }
}, { timestamps: true });

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
