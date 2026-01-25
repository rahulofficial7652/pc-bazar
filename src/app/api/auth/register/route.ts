import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { AppError } from "@/lib/errors/AppError";
import { ERROR_CODES } from "@/lib/errors/errorCodes";
import { handleRouteError } from "@/lib/errors/handleRouteError";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      throw new AppError({
        message: "Email and password are required",
        statusCode: 400,
        code: ERROR_CODES.BAD_REQUEST,
      });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError({
        message: "User already exists with this email",
        statusCode: 400,
        code: ERROR_CODES.DUPLICATE_RESOURCE,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { 
        success: true,
        message: "User registered successfully", 
        user: { id: newUser._id, email: newUser.email } 
      },
      { status: 201 }
    );
  } catch (error) {
    return handleRouteError(error, "UserRegistrationAPI");
  }
}
