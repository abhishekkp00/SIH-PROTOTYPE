const mongoose = require('mongoose');

module.exports = async function connectDB(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
  });
  console.log('MongoDB connected');
};