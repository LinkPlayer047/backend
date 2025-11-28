import mongoose from "mongoose";

let isConnected = global.mongoose ? global.mongoose.isConnected : false;

async function connectDB() {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "linkplayer047_db_user", // actual DB name
    });

    isConnected = db.connections[0].readyState;
    if (!global.mongoose) global.mongoose = {};
    global.mongoose.isConnected = isConnected;

    console.log("✅ MongoDB Connected (Next.js)");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw new Error(error);
  }
}

export default connectDB; // default export
