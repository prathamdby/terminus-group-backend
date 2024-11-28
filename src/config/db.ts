import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.MONGODB_URI || "";

export const forms_db = mongoose.connection;

export async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connection established successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
}
