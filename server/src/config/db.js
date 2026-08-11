import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Application from '../models/Application.js';

let isConnected = false;

const autoSeedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@crosslinks.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('No admin accounts found in DB. Auto-seeding default admin...');
      await Admin.create({
        email,
        password,
        name: 'CrossLinks Admin'
      });
      console.log(`Admin auto-seeded successfully with email: ${email}`);
    }
  } catch (err) {
    console.error(`Failed to auto-seed admin: ${err.message}`);
  }
};

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crosslinks_recruitment';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    await autoSeedAdmin();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
