import mongoose from "mongoose";
import { logger } from "./logger";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection error: %o", error);
    process.exit(1);
  }
};
