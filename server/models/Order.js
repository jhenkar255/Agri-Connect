import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  id: String,
  title: String,
  price: Number,
  quantity: Number,
  unit: String,
  category: String,
  image: String
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    default: 'guest_user'
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  shippingAddress: {
    company: String,
    address: String,
    city: String,
    district: String,
    state: String,
    pincode: String
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  totalPayable: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'cod'],
    default: 'upi'
  },
  status: {
    type: String,
    enum: ['CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'],
    default: 'CONFIRMED'
  },
  mandiCessPercentage: {
    type: Number,
    default: 0 // 0% on Direct Farmer Purchase
  },
  placedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

OrderSchema.index({ customerPhone: 1 });
OrderSchema.index({ placedAt: -1 });

const Order = mongoose.model('Order', OrderSchema);

export default Order;
