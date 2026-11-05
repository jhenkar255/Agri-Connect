import dotenv from 'dotenv';
import { connectDB } from '../server/db.js';
import User from '../server/models/User.js';
import LoginLog from '../server/models/LoginLog.js';
import Order from '../server/models/Order.js';
import MachineryBooking from '../server/models/MachineryBooking.js';
import CropAdvisory from '../server/models/CropAdvisory.js';

dotenv.config();

async function run() {
  console.log('Connecting to MongoDB Atlas for comprehensive entity test...');
  await connectDB();

  console.log('\n--- 1. Testing LoginLog Entry ---');
  const log = await LoginLog.create({
    identifier: 'ravi.kumar@agriconnect.org',
    userName: 'Ravi Kumar',
    role: 'farmer',
    action: 'LOGIN_PASSWORD',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1',
    userAgent: 'Node.js Test Suite'
  });
  console.log('✓ Created LoginLog:', log._id.toString(), 'Action:', log.action, 'Status:', log.status);

  console.log('\n--- 2. Testing Order Entry ---');
  const order = await Order.create({
    orderId: 'AGRI-ORD-2026-TEST',
    userId: 'user_farmer_001',
    customerName: 'Ananya Sharma',
    customerPhone: '+91 98860 44521',
    items: [
      { id: '1', title: 'Hybrid Vaishali Tomato Seeds', price: 420, quantity: 2, unit: 'Pack (100g)' },
      { id: '2', title: 'IFFCO Water Soluble NPK 19-19-19', price: 950, quantity: 1, unit: 'Bag (25kg)' }
    ],
    subtotal: 1790,
    deliveryFee: 0,
    totalPayable: 1790,
    paymentMethod: 'upi',
    status: 'CONFIRMED'
  });
  console.log('✓ Created Order:', order.orderId, 'Total: ₹' + order.totalPayable);

  console.log('\n--- 3. Testing MachineryBooking Entry ---');
  const booking = await MachineryBooking.create({
    bookingId: 'BKG-MCH-TEST',
    machineryTitle: 'Mahindra 475 DI 42 HP Tractor with Multi-Speed Rotavator',
    machineryOwner: 'Gowda Agri Machinery Rentals',
    hourlyRate: 800,
    bookedHours: 4,
    totalAmount: 3200,
    farmerName: 'Ravi Kumar',
    farmerPhone: '+91 98451 22891',
    farmerVillage: 'Kudumallige, Shivamogga',
    status: 'CONFIRMED'
  });
  console.log('✓ Created MachineryBooking:', booking.bookingId, 'Tractor:', booking.machineryTitle);

  console.log('\n--- 4. Testing CropAdvisory Entry ---');
  const advisory = await CropAdvisory.create({
    userId: 'user_farmer_001',
    userName: 'Ravi Kumar',
    type: 'PATHOLOGY_SCAN',
    crop: 'Potato',
    userQuery: 'Scan potato leaf for late blight lesions',
    aiResponse: 'Potato Late Blight (Phytophthora infestans) detected with 98.2% ICAR accuracy.',
    diseaseDetected: 'Potato Late Blight',
    scientificName: 'Phytophthora infestans',
    confidenceScore: 98.2,
    severity: 'Moderate',
    organicTreatment: 'Trichoderma harzianum soil drenching + 1% Bordeaux spray',
    chemicalTreatment: 'Mancozeb 75% WP @ 2.5g/L preventive spray',
    language: 'en'
  });
  console.log('✓ Created CropAdvisory:', advisory._id.toString(), 'Disease:', advisory.diseaseDetected);

  console.log('\n--- Database Collection Summary in MongoDB Atlas ---');
  const [users, loginLogs, orders, bookings, advisories] = await Promise.all([
    User.countDocuments(),
    LoginLog.countDocuments(),
    Order.countDocuments(),
    MachineryBooking.countDocuments(),
    CropAdvisory.countDocuments()
  ]);

  console.log(`- Users in Atlas: ${users}`);
  console.log(`- Login Logs in Atlas: ${loginLogs}`);
  console.log(`- Orders in Atlas: ${orders}`);
  console.log(`- Machinery Bookings in Atlas: ${bookings}`);
  console.log(`- Crop Advisories in Atlas: ${advisories}`);

  process.exit(0);
}

run().catch(err => {
  console.error('Error testing entities:', err);
  process.exit(1);
});

