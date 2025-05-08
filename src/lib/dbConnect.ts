import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log('Already connected to the database');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    // Instead of throwing, return a more graceful error
    connection.isConnected = 0; // Mark as not connected
    return;
  }

  try {
    console.log('Connecting to MongoDB...');

    // Set mongoose options to handle deprecation warnings
    const mongooseOptions = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const db = await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

    connection.isConnected = db.connections[0].readyState;

    console.log(`Database connected successfully. Connection state: ${connection.isConnected}`);
    console.log(`Connected to database: ${db.connection.name}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    connection.isConnected = 0; // Mark as not connected

    // Instead of throwing, return and let the API route handle the error
    return;
  }
}

export default dbConnect;