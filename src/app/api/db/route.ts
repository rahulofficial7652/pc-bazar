import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { ApiResponse } from "@/lib/utils/apiResponse";
import { handleRouteError } from "@/lib/errors/handleRouteError";

export async function GET() {
  try {
    await connectDB();

    return ApiResponse.success({
      state: mongoose.connection.readyState,
    }, "Database connected successfully");

  } catch (error) {
    return handleRouteError(error, "DBConnectionTest");
  }
}
