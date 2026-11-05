import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';
import authRoutes from './routes/authRoutes.js';
import appRoutes from './routes/appRoutes.js';
import User from './models/User.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', appRoutes);
app.use('/api', authRoutes); // alias /api/health

// API health & status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    project: 'Agri-Connect Backend API',
    status: 'Running',
    database: 'MongoDB Atlas',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/users',
      'GET /api/health',
      'GET /api/stats'
    ]
  });
});

// Serve static frontend assets from production build
app.use(express.static(distPath));

// Client-side SPA fallback for all web routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.json({
        project: 'Agri-Connect Backend API',
        status: 'Running',
        database: 'MongoDB Atlas',
        message: 'Frontend not built yet. Run npm run build.'
      });
    }
  });
});

// Start Server and connect to MongoDB Atlas
async function startServer() {
  console.log('Connecting to MongoDB Atlas Cluster0...');
  const conn = await connectDB();

  if (conn) {
    try {
      // Auto seed default demo accounts if database is brand new
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('Database empty. Seeding initial Agri-Connect demo users...');
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
        await User.insertMany(SEED_USERS);
        console.log('✓ Successfully seeded demo accounts into MongoDB Atlas.');
      }
    } catch (e) {
      console.warn('Seed warning:', e.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Agri-Connect Backend API Server listening on http://localhost:${PORT}`);
  });
}

startServer();
