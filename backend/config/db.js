import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const defaultUri = 'mongodb://127.0.0.1:27017/thapar_pg_finder';
    const mongoUri =
      process.env.MONGO_URI && process.env.MONGO_URI.trim() !== '' && !process.env.MONGO_URI.includes('username:password')
        ? process.env.MONGO_URI
        : defaultUri;

    console.log(`[MongoDB] Connecting to MongoDB instance at: ${mongoUri.split('@').pop()}`);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Primary connection failed: ${error.message}`);
    try {
      console.log('[MongoDB] Attempting fallback to isolated memory daemon...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: { dbName: 'thapar_pg_finder' },
      });
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Connected to fallback memory MongoDB at: ${uri}`);
      return conn;
    } catch (fallbackError) {
      console.error(`[MongoDB] Fatal: Could not establish database connection: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
