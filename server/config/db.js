const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  const production = process.env.NODE_ENV === 'production';

  if (uri && production) {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
    return;
  }

  if (!uri && production) {
    console.log('MONGO_URI is not set. Starting a temporary database so products can load.');
  }

  try {
    await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/northline', { serverSelectionTimeoutMS: 2500 });
    console.log('MongoDB connected');
    return;
  } catch (error) {
    console.log('Local MongoDB is not running. Starting an in-memory database...');
  }

  const { MongoMemoryServer } = require('mongodb-memory-server');
  const memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri());
  console.log('In-memory MongoDB ready (data resets when the server stops)');
}

module.exports = connectDB;
