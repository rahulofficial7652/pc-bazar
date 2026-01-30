import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing in .env file");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Enhanced connectDB with detailed logging and error tracking
 */
export async function connectDB() {
  // 1. Agar connection pehle se hai, toh wahi return karo
  if (cached.conn) {
    return cached.conn;
  }

  // 2. Naya connection shuru karne ki logic
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 seconds mein fail ho jaye agar DB nahi mil raha
      heartbeatFrequencyMS: 10000, // Har 10s mein connection check kare
    };

    console.log("⏳ Connecting to MongoDB...");
    const startTime = Date.now();

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        const duration = Date.now() - startTime;

        // 🐢 Slow DB connect signal
        const connectionDuration = Date.now() - startTime;
        if (connectionDuration > 2000) {
          console.warn("🐢 SLOW_DB_CONNECTION", {
            connectionDuration,
            threshold: "2000ms",
          });
        }

        console.log(`✅ MongoDB Connected Successfully (${duration}ms)`);

        // Connection events for deeper monitoring
        mongoose.connection.on("error", (err) => {
          console.error("❌ MongoDB Runtime Error:", err);
        });

        mongoose.connection.on("disconnected", () => {
          console.warn("⚠️ MongoDB Disconnected! Attempting to reconnect...");
        });

        return mongooseInstance;
      })
      .catch((error) => {
        const duration = Date.now() - startTime;
        console.error(`❌ MongoDB Connection Failed after ${duration}ms`);

        // Promise ko null karein taaki next request phir se koshish kar sake
        cached.promise = null;

        // Error object ko enrich karein taaki Centralized Handler ko details milein
        error.customMessage = "Database Connection Error";
        error.timestamp = new Date().toISOString();

        throw error; // Central handler ise pakad lega
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Performance Monitoring: Slow queries ko terminal mein dikhane ke liye
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", (collectionName, method, query, doc) => {
    console.log(
      `🔍 Mongoose: ${collectionName}.${method}`,
      JSON.stringify(query),
    );
  });
}
