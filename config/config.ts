import mongoose from 'mongoose';

export const connectDB = async () => {
  if (process.env.MONGODB_URI) {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB is Connected`);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  } else {
    console.log('Unable to connect to datasbase');
  }
};
