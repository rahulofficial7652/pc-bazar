import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from 'path';

// Current directory se .env ka rasta nikaalein
dotenv.config({ path: path.resolve(process.cwd(), '.env') });


const MONGODB_URL = process.env.MONGODB_URI;

if (!MONGODB_URL) {
    console.error("❌ MONGODB_URL is missing in .env file");
    process.exit(1);
}

async function testConnection() {
    console.log("⏳ Testing MongoDB Connection...");
    const startTime = Date.now();

    try {
        await mongoose.connect(MONGODB_URL, {
            serverSelectionTimeoutMS: 4000,
            heartbeatFrequencyMS: 10000,
        });

        const duration = Date.now() - startTime;
        console.log(`✅ MongoDB Connected Successfully (${duration}ms)`);
        console.log("📍 Connection String:", MONGODB_URL.replace(/:([^:@]+)@/, ':****@'));

        // Test a simple query
        await mongoose.connection.db.admin().ping();
        console.log("✅ Ping successful");

        process.exit(0);
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ MongoDB Connection Failed after ${duration}ms`);
        console.error("Error:", error.message);
        process.exit(1);
    }
}

testConnection();