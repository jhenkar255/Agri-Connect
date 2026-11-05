import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
  },
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'seller', 'admin'],
    default: 'farmer'
  },
  state: {
    type: String,
    default: 'Karnataka'
  },
  district: {
    type: String,
    default: 'Shivamogga'
  },
  taluk: {
    type: String,
    default: 'Thirthahalli'
  },
  village: {
    type: String,
    default: 'Kudumallige'
  },
  landAcres: {
    type: Number,
    default: 2.5
  },
  mainCrop: {
    type: String,
    default: 'Tomato (Hybrid Vaishali)'
  },
  companyName: {
    type: String,
    default: ''
  },
  gstin: {
    type: String,
    default: ''
  },
  verificationStatus: {
    type: String,
    default: 'Verified Citizen Farmer'
  },
  kycBadge: {
    type: String,
    default: 'Aadhaar & Land RTC Verified'
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 1
  },
  registeredDate: {
    type: String,
    default: () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }
}, {
  timestamps: true
});

// Helper index for faster lookups
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });

const User = mongoose.model('User', UserSchema);

export default User;

