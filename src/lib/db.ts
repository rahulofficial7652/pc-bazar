import mongoose, { Mongoose } from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string

console.log({ MONGODB_URI });

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env")
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

/**
 * Global is used here to maintain a cached connection
 * across hot reloads in development.
 */
let cached: MongooseCache = global.mongoose

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
