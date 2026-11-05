import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import LoginLog from '../models/LoginLog.js';

const router = express.Router();

// Default accounts to seed if collection is fresh
const SEED_USERS = [
  {
    id: 'user_farmer_001',
    name: 'Ravi Kumar',
    role: 'farmer',
    email: 'ravi.kumar@agriconnect.org',
    phone: '+91 98451 22891',
    password: 'FarmerPass@2026',
    state: 'Karnataka',
    district: 'Shivamogga',
    taluk: 'Thirthahalli',
    village: 'Kudumallige',
    landAcres: 2.5,
    mainCrop: 'Tomato (Hybrid Vaishali)',
    verificationStatus: 'Verified Citizen Farmer',
    kycBadge: 'Aadhaar & Land RTC Verified',
    registeredDate: '14 Jan 2025'
  },
  {
    id: 'user_buyer_002',
    name: 'Ananya Sharma',
    role: 'buyer',
    email: 'ananya.s@metrofresh.in',
    phone: '+91 98860 44521',
    password: 'BuyerPass@2026',
    companyName: 'Metro Fresh Foods Private Ltd.',
    gstin: '29ABCDE1234F1Z5',
    state: 'Karnataka',
    district: 'Bengaluru',
    verificationStatus: 'Verified Commercial Buyer',
    registeredDate: '20 Feb 2025'
  },
  {
    id: 'user_seller_003',
    name: 'Manoj Patel',
    role: 'seller',
    email: 'manoj@krishimitra.org',
    phone: '+91 94480 99812',
    password: 'SellerPass@2026',
    companyName: 'KrishiMitra Agri Solutions Ltd.',
    state: 'Karnataka',
    district: 'Shivamogga',
    verificationStatus: 'Licensed Agri-Dealer',
    registeredDate: '05 Mar 2025'
  },
  {
    id: 'user_admin_000',
    name: 'Dr. Srinivas Rao',
    role: 'admin',
    email: 'admin@agriconnect.in',
    phone: '+91 80 2345 6789',
    password: 'ChangeThisImmediately@2026',
    state: 'Karnataka',
    district: 'Bengaluru',
    verificationStatus: 'Platform SuperAdmin',
    registeredDate: '01 Jan 2025'
  }
];

/**
 * Health check & MongoDB Atlas status
 */
router.get('/health', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const userCount = isConnected ? await User.countDocuments().catch(() => 0) : 0;
  const logCount = isConnected ? await LoginLog.countDocuments().catch(() => 0) : 0;
  
  res.json({
    status: isConnected ? 'online' : 'connecting_or_offline',
    database: 'MongoDB Atlas',
    cluster: 'cluster0.zvmhp4v.mongodb.net',
    connected: isConnected,
    totalRegisteredUsers: userCount,
    totalLoginLogs: logCount,
    timestamp: new Date().toISOString()
  });
});

/**
 * Auto-seed initial users if collection is empty
 */
router.post('/seed', async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Database already has registered users.', count });
    }
    const inserted = await User.insertMany(SEED_USERS);
    res.json({ message: 'Seeded initial Agri-Connect users into MongoDB Atlas.', count: inserted.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * User Registration -> Save to MongoDB Atlas
 */
router.post('/register', async (req, res) => {
  try {
    const { 
      name, phone, email, password, role, 
      state, district, taluk, village, landAcres, mainCrop, companyName, gstin 
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Mobile number is required.' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    // Check duplicate phone in MongoDB Atlas
    const phoneExists = await User.findOne({ 
      phone: { $regex: new RegExp(cleanPhone.slice(-10) + '$', 'i') } 
    });
    if (phoneExists) {
      return res.status(409).json({ error: `An account with mobile number "${phone}" already exists. Please sign in.` });
    }

    // Check duplicate email if provided
    if (cleanEmail) {
      const emailExists = await User.findOne({ email: cleanEmail });
      if (emailExists) {
        return res.status(409).json({ error: `An account with email "${cleanEmail}" already exists. Please sign in instead.` });
      }
    }

    // Create & save new user
    const newUser = new User({
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      phone: phone.trim(),
      email: cleanEmail,
      password: password,
      role: role || 'farmer',
      state: state || 'Karnataka',
      district: district || 'Shivamogga',
      taluk: taluk || '',
      village: village || '',
      landAcres: landAcres ? parseFloat(landAcres) : 2.5,
      mainCrop: mainCrop || 'Paddy / General Harvest',
      companyName: companyName || '',
      gstin: gstin || '',
      verificationStatus: role === 'buyer' ? 'Verified Commercial Buyer' : role === 'seller' ? 'Licensed Agri-Dealer' : 'Verified Citizen Farmer',
      kycBadge: 'Aadhaar & Land RTC Verified',
      registeredDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });

    await newUser.save();
    console.log(`[MongoDB Atlas] Successfully registered user: ${newUser.name} (${newUser.phone})`);

    // Record Registration Audit Event in MongoDB Atlas
    try {
      await LoginLog.create({
        userId: newUser.id,
        identifier: cleanEmail || cleanPhone,
        userName: newUser.name,
        role: newUser.role,
        action: 'REGISTER',
        status: 'SUCCESS',
        ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Agri-Connect Web Client'
      });
    } catch (logErr) {
      console.warn('Could not record registration log:', logErr.message);
    }

    // Return sanitized user without password
    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'Account created successfully in MongoDB Atlas!',
      user: userObj
    });
  } catch (err) {
    console.error('[MongoDB Atlas] Registration error:', err);
    res.status(500).json({ error: err.message || 'Server error during registration.' });
  }
});

/**
 * User Login -> Verify credentials from MongoDB Atlas
 */
router.post('/login', async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !identifier.trim() || !password) {
      return res.status(400).json({ error: 'Please enter both your credentials and password.' });
    }

    const cleanIdent = identifier.trim();
    const isEmail = cleanIdent.includes('@');

    let query = {};
    if (isEmail) {
      query.email = cleanIdent.toLowerCase();
    } else {
      const cleanDigits = cleanIdent.replace(/[\s-]/g, '').slice(-10);
      query.phone = { $regex: new RegExp(cleanDigits + '$', 'i') };
    }

    const user = await User.findOne(query);

    if (!user) {
      // Record failed login attempt in MongoDB Atlas
      try {
        await LoginLog.create({
          identifier: cleanIdent,
          userName: 'Unknown',
          role: role || 'farmer',
          action: 'LOGIN_PASSWORD',
          status: 'FAILED',
          failureReason: 'User not found',
          ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
          userAgent: req.headers['user-agent'] || 'Agri-Connect Web Client'
        });
      } catch (e) {}

      return res.status(404).json({
        error: `No registered account found for "${identifier}". Please check your details or register a new account.`
      });
    }

    if (user.password !== password) {
      // Record failed password attempt in MongoDB Atlas
      try {
        await LoginLog.create({
          userId: user.id,
          identifier: cleanIdent,
          userName: user.name,
          role: user.role,
          action: 'LOGIN_PASSWORD',
          status: 'FAILED',
          failureReason: 'Incorrect password',
          ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
          userAgent: req.headers['user-agent'] || 'Agri-Connect Web Client'
        });
      } catch (e) {}

      return res.status(401).json({
        error: `Incorrect password for ${identifier}. Please try again or click "Forgot Password?".`
      });
    }

    // Update user login statistics in MongoDB Atlas
    user.lastLoginAt = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save().catch(() => {});

    // Record successful login audit in MongoDB Atlas
    try {
      await LoginLog.create({
        userId: user.id,
        identifier: cleanIdent,
        userName: user.name,
        role: user.role,
        action: 'LOGIN_PASSWORD',
        status: 'SUCCESS',
        ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Agri-Connect Web Client'
      });
    } catch (e) {}

    const userObj = user.toObject();
    delete userObj.password;

    console.log(`[MongoDB Atlas] Successful login: ${user.name} (${user.role})`);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: userObj
    });
  } catch (err) {
    console.error('[MongoDB Atlas] Login error:', err);
    res.status(500).json({ error: err.message || 'Server error during login.' });
  }
});

/**
 * Universal Activity & Audit Logger (for OTP, Social Logins, Logouts, Password Resets)
 */
router.post('/log-activity', async (req, res) => {
  try {
    const { userId, identifier, userName, role, action, status, failureReason } = req.body;
    
    const log = await LoginLog.create({
      userId: userId || '',
      identifier: identifier || 'anonymous',
      userName: userName || 'Anonymous',
      role: role || 'farmer',
      action: action || 'LOGIN_PASSWORD',
      status: status || 'SUCCESS',
      failureReason: failureReason || '',
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Agri-Connect Web Client'
    });

    res.status(201).json({ success: true, logId: log._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Retrieve recent login & activity logs from MongoDB Atlas
 */
router.get('/activity-logs', async (req, res) => {
  try {
    const logs = await LoginLog.find({}).sort({ timestamp: -1 }).limit(100);
    res.json({ count: logs.length, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * List all registered users (for directory / administration)
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

