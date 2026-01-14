import mongoose from "mongoose";
import { mongoURI } from "../env.js";

export const connectDB = async () => {
    try {
        if (!mongoURI) {
            throw new Error("No MongoDB URI configured. Check MONGO_DB_URI_PROD or MONGO_DB_URI_DEV environment variables.");
        }
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
