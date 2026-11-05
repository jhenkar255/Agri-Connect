import mongoose from 'mongoose';

const LoginLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: ''
  },
  identifier: {
    type: String,
    required: true,
    trim: true
  },
  userName: {
    type: String,
    default: 'Anonymous'
  },
  role: {
    type: String,
    default: 'farmer'
  },
  action: {
    type: String,
    enum: [
      'LOGIN_PASSWORD', 
      'LOGIN_OTP', 
      'LOGIN_GOOGLE', 
      'LOGIN_FACEBOOK', 
      'LOGOUT', 
      'REGISTER', 
      'PASSWORD_RESET'
    ],
    default: 'LOGIN_PASSWORD'
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    required: true
  },
  failureReason: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  userAgent: {
    type: String,
    default: 'Web Browser'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

LoginLogSchema.index({ timestamp: -1 });
LoginLogSchema.index({ identifier: 1 });
LoginLogSchema.index({ action: 1 });

const LoginLog = mongoose.model('LoginLog', LoginLogSchema);

export default LoginLog;

