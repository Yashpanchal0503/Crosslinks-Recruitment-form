import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

const autoSeedAdmin = async () => {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      console.log('No admin accounts found in DB. Auto-seeding default admin...');
      const email = process.env.ADMIN_EMAIL || 'admin@crosslinks.com';
      const password = process.env.ADMIN_PASSWORD || 'admin123';
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
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await autoSeedAdmin();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
