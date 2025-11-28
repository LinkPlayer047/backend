import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "linkplayer047_db_user",
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB Connected (Next.js)");
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}

export default connectDB;
