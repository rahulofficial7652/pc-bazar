import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import mongoose from "mongoose"

export async function GET() {
  try {
    await connectDB()

    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      state: mongoose.connection.readyState, 
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
