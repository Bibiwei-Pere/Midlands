import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 30000, // Optional: Increase socket timeout to 30 seconds
    });
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
    process.exit(1); // Optional: Exit the process if connection fails
  }
};

export default connectDB;
