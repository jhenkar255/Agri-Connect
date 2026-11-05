import express from 'express';
import Order from '../models/Order.js';
import MachineryBooking from '../models/MachineryBooking.js';
import CropAdvisory from '../models/CropAdvisory.js';
import User from '../models/User.js';
import LoginLog from '../models/LoginLog.js';

const router = express.Router();

/**
 * =========================================================
 * 1. ORDERS & CHECKOUT (Cart / Marketplace Purchases)
 * =========================================================
 */
router.post('/orders', async (req, res) => {
  try {
    const { 
      orderId, userId, customerName, customerPhone, 
      shippingAddress, items, subtotal, deliveryFee, 
      totalPayable, paymentMethod 
    } = req.body;

    const newOrder = new Order({
      orderId: orderId || `AGRI-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: userId || 'farmer_user',
      customerName: customerName || 'Ananya Sharma',
      customerPhone: customerPhone || '+91 98860 44521',
      shippingAddress: shippingAddress || {},
      items: items || [],
      subtotal: subtotal || 0,
      deliveryFee: deliveryFee || 0,
      totalPayable: totalPayable || 0,
      paymentMethod: paymentMethod || 'upi',
      status: 'CONFIRMED'
    });

    await newOrder.save();
    console.log(`[MongoDB Atlas] New Order Saved: ${newOrder.orderId} (₹${newOrder.totalPayable})`);

    res.status(201).json({
      success: true,
      message: 'Order recorded in MongoDB Atlas successfully!',
      order: newOrder
    });
  } catch (err) {
    console.error('[MongoDB Atlas] Order creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ placedAt: -1 }).limit(100);
    res.json({ count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================================================
 * 2. MACHINERY BOOKING (Tractor, Rotavator, Harvester)
 * =========================================================
 */
router.post('/machinery/book', async (req, res) => {
  try {
    const { 
      machineryTitle, machineryOwner, hourlyRate, 
      bookedHours, farmerName, farmerPhone, farmerVillage, slotDate 
    } = req.body;

    const hours = bookedHours ? parseInt(bookedHours) : 4;
    const rate = hourlyRate ? parseFloat(hourlyRate) : 800;

    const newBooking = new MachineryBooking({
      bookingId: `BKG-MCH-${Date.now().toString().slice(-6)}`,
      machineryTitle: machineryTitle || 'Mahindra 475 DI 42 HP Tractor with Multi-Speed Rotavator',
      machineryOwner: machineryOwner || 'Gowda Agri Machinery Rentals',
      hourlyRate: rate,
      bookedHours: hours,
      totalAmount: rate * hours,
      farmerName: farmerName || 'Ravi Kumar',
      farmerPhone: farmerPhone || '+91 98451 22891',
      farmerVillage: farmerVillage || 'Kudumallige, Shivamogga',
      slotDate: slotDate || new Date().toISOString().split('T')[0],
      status: 'CONFIRMED'
    });

    await newBooking.save();
    console.log(`[MongoDB Atlas] New Machinery Booking Saved: ${newBooking.bookingId} (${newBooking.machineryTitle})`);

    res.status(201).json({
      success: true,
      message: 'Machinery slot booking saved in MongoDB Atlas!',
      booking: newBooking
    });
  } catch (err) {
    console.error('[MongoDB Atlas] Machinery booking error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/machinery/bookings', async (req, res) => {
  try {
    const bookings = await MachineryBooking.find({}).sort({ createdAt: -1 }).limit(100);
    res.json({ count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================================================
 * 3. AI CROP ADVISORY & PATHOLOGY SCANS
 * =========================================================
 */
router.post('/advisory', async (req, res) => {
  try {
    const { 
      userId, userName, type, crop, userQuery, aiResponse, 
      diseaseDetected, scientificName, confidenceScore, severity, 
      organicTreatment, chemicalTreatment, language 
    } = req.body;

    const advisory = new CropAdvisory({
      userId: userId || 'farmer_user',
      userName: userName || 'Farmer',
      type: type || 'QUERY',
      crop: crop || 'Potato',
      userQuery: userQuery || '',
      aiResponse: aiResponse || '',
      diseaseDetected: diseaseDetected || '',
      scientificName: scientificName || '',
      confidenceScore: confidenceScore || 0,
      severity: severity || 'Moderate',
      organicTreatment: organicTreatment || '',
      chemicalTreatment: chemicalTreatment || '',
      language: language || 'en'
    });

    await advisory.save();
    console.log(`[MongoDB Atlas] Crop Advisory Logged: ${advisory.crop} - ${advisory.type}`);

    res.status(201).json({
      success: true,
      message: 'Consultation saved to MongoDB Atlas',
      advisory
    });
  } catch (err) {
    console.error('[MongoDB Atlas] Advisory logging error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/advisory', async (req, res) => {
  try {
    const advisories = await CropAdvisory.find({}).sort({ timestamp: -1 }).limit(100);
    res.json({ count: advisories.length, advisories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================================================
 * 4. OVERALL DATABASE METRICS & STATS
 * =========================================================
 */
router.get('/stats', async (req, res) => {
  try {
    const [users, loginLogs, orders, bookings, advisories] = await Promise.all([
      User.countDocuments(),
      LoginLog.countDocuments(),
      Order.countDocuments(),
      MachineryBooking.countDocuments(),
      CropAdvisory.countDocuments()
    ]);

    res.json({
      database: 'MongoDB Atlas',
      cluster: 'cluster0.zvmhp4v.mongodb.net',
      collections: {
        users,
        login_logs: loginLogs,
        orders,
        machinery_bookings: bookings,
        crop_advisories: advisories
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

