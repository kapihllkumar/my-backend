import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';
import connectDB from './src/config/db';
import { importPropertiesFromCSV } from './src/utils/importProperties';
import User from './src/models/User'; // Default import
import { IUser } from './src/models/User'; // Type import

dotenv.config();

const ADMIN_EMAIL = 'admin@property.com';
const ADMIN_PASSWORD = 'admin123';
const CSV_FILE_PATH = './data.csv';

const runImport = async () => {
  try {
    await connectDB();

    // Find the admin user with correct typing
    let adminUser = await User.findOne({ email: ADMIN_EMAIL }).exec() as IUser | null;

    if (!adminUser) {
      // Create new admin user
      adminUser = await User.create({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        favorites: [],
        recommendationsReceived: [],
      }) as IUser;
      console.log(' Admin user created');
    }

    if (!adminUser || !adminUser._id) {
      throw new Error('Admin user could not be found or created');
    }

    // Pass _id as string
    const adminId: string = adminUser._id.toString();
    await importPropertiesFromCSV(CSV_FILE_PATH, adminId);

    console.log(' Data import completed successfully');
    process.exit(0);
  } catch (error) {
    console.error(' Data import failed:', error);
    process.exit(1);
  }
};

runImport();
