import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log('Testing connection to MongoDB Atlas...');
console.log('URI:', uri.replace(/:([^:@]+)@/, ':****@'));

async function testConnection() {
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log('✓ SUCCESS: Successfully connected to MongoDB Atlas!');
    console.log('  Cluster Host:', conn.connection.host);
    console.log('  Database Name:', conn.connection.name);
    console.log('  Ready State:', conn.connection.readyState === 1 ? 'Connected (1)' : conn.connection.readyState);

    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('  Existing Collections in database:', collections.map(c => c.name));

    await mongoose.disconnect();
    console.log('✓ Disconnected cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('✗ Connection Test Failed:', err.message);
    process.exit(1);
  }
}

testConnection();

