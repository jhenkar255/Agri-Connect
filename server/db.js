import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jhenkarms15_db_user:G2cxvcNdmWy2nn5U@cluster0.zvmhp4v.mongodb.net/agri_connect?retryWrites=true&w=majority';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: true
    });

    console.log(`✓ MongoDB Atlas Connected Successfully: ${conn.connection.host} / Database: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error('✗ MongoDB Atlas Connection Error:', err.message);
    // Don't kill process immediately; allow offline/fallback operations
    return null;
  }
}

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established.');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting reconnect...');
});

export default mongoose;

