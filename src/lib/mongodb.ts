import mongoose from "mongoose";
import { logger } from "@/lib/logger";

const log = logger("db");

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
  }

  if (cached.conn) {
    log.debug("reusing existing connection");
    return cached.conn;
  }

  if (!cached.promise) {
    log.info("creating new MongoDB connection");
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
