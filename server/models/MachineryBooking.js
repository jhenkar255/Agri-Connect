import mongoose from 'mongoose';

const MachineryBookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  machineryTitle: {
    type: String,
    required: true
  },
  machineryOwner: {
    type: String,
    required: true
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  bookedHours: {
    type: Number,
    default: 4
  },
  totalAmount: {
    type: Number,
    required: true
  },
  farmerName: {
    type: String,
    default: 'Ravi Kumar'
  },
  farmerPhone: {
    type: String,
    default: '+91 98451 22891'
  },
  farmerVillage: {
    type: String,
    default: 'Kudumallige, Shivamogga'
  },
  status: {
    type: String,
    enum: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'CONFIRMED'
  },
  slotDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  depositRequired: {
    type: Number,
    default: 0 // Pay after work
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

MachineryBookingSchema.index({ createdAt: -1 });

const MachineryBooking = mongoose.model('MachineryBooking', MachineryBookingSchema);

export default MachineryBooking;
