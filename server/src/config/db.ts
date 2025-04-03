import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/interviewDB";

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI, {
        } as mongoose.ConnectOptions); 

        console.log("MongoDB Connected!");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

mongoose.connection.on("connected", () => console.log("MongoDB Connection Established"));
mongoose.connection.on("error", (err) => console.error("MongoDB Connection Error:", err));
mongoose.connection.on("disconnected", () => console.log("MongoDB Disconnected"));

export default connectDB;
