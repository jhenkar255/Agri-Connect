import mongoose from 'mongoose';

const CropAdvisorySchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'farmer_session'
  },
  userName: {
    type: String,
    default: 'Farmer'
  },
  type: {
    type: String,
    enum: ['QUERY', 'PATHOLOGY_SCAN'],
    default: 'QUERY'
  },
  crop: {
    type: String,
    default: 'General'
  },
  userQuery: {
    type: String,
    default: ''
  },
  aiResponse: {
    type: String,
    default: ''
  },
  diseaseDetected: {
    type: String,
    default: ''
  },
  scientificName: {
    type: String,
    default: ''
  },
  confidenceScore: {
    type: Number,
    default: 0
  },
  severity: {
    type: String,
    default: ''
  },
  organicTreatment: {
    type: String,
    default: ''
  },
  chemicalTreatment: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'en'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

CropAdvisorySchema.index({ timestamp: -1 });
CropAdvisorySchema.index({ crop: 1 });

const CropAdvisory = mongoose.model('CropAdvisory', CropAdvisorySchema);

export default CropAdvisory;

