import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { ApiResponse } from "@/lib/utils/apiResponse";
import { handleRouteError, DatabaseError } from "@/lib/errors";

export async function GET() {
  try {
    // Test DB connection
    try {
      await connectDB();

      return ApiResponse.success(
        {
          state: mongoose.connection.readyState,
          status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        },
        "Database connection test successful"
      );
    } catch (dbError) {
      throw new DatabaseError("Failed to connect to database", {
        originalError: dbError,
      });
    }
  } catch (error) {
    return handleRouteError(error, "GET /api/db");
  }
}
