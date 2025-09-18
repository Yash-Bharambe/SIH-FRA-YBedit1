import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  claimId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicantName: {
    type: String,
    required: true,
  },
  claimType: {
    type: String,
    enum: ['IFR', 'CFR', 'CRR'], // Individual Forest Rights, Community Forest Rights, Community Resource Rights
    required: true,
  },
  village: {
    type: String,
    required: true,
  },
  block: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  area: {
    type: Number,
    required: true,
    min: 0,
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  tribalGroup: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending',
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
  }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  approved_at: {
    type: Date,
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  remarks: {
    type: String,
  },
});

// Add a geospatial index for location-based queries
claimSchema.index({ coordinates: '2dsphere' });

// Update the updated_at timestamp on save
claimSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const Claim = mongoose.model('Claim', claimSchema);