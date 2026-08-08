import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

const autoSeedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@crosslinks.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('No admin accounts found in DB. Auto-seeding default admin...');
      await Admin.create({
        email,
        password,
        name: 'CrossLinks Admin'
      });
      console.log(`Admin auto-seeded successfully with email: ${email}`);
    } else {
      // If the admin exists, check if the password matches the environment variable
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        console.log('Admin password change detected in environment variables. Updating DB...');
        admin.password = password; // Triggers the hashing pre-save hook
        await admin.save();
        console.log('Admin password updated successfully in database.');
      }
    }
  } catch (err) {
    console.error(`Failed to auto-seed or update admin: ${err.message}`);
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
