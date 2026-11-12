import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import Property from './models/Property.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to genuine MongoDB instance
    await connectDB();

    // Auto-seed if database is fresh
    const propertyCount = await Property.countDocuments();
    if (propertyCount === 0) {
      console.log('[Server] Database is empty. Auto-seeding 11 sample Thapar PG listings...');
      await seedDatabase();
    } else {
      console.log(`[Server] Found ${propertyCount} properties in MongoDB database.`);
    }

    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Thapar PG Finder Server Running on Port: ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📍 Tailored for Thapar Institute (TIET), Patiala`);
      console.log(`====================================================`);
    });

    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();
