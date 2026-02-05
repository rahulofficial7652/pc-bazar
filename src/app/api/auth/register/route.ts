import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import {
  handleRouteError,
  ValidationError,
  DuplicateResourceError,
  DatabaseError,
} from "@/lib/errors";

export async function POST(req: Request) {
  try {
    // Parse input
    const body = await req.json();
    const { email, password, name } = body;

    // Validate required fields
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError("Invalid email format");
    }

    // Password strength validation
    if (password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters long");
    }

    // DB connection
    await connectDB();

    // Check if user already exists
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new DuplicateResourceError("User with this email");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const newUser = await User.create({
        email,
        password: hashedPassword,
        name: name || email.split("@")[0], // Default name from email
        role: "USER",
        isActive: true,
      });

      return Response.json(
        {
          success: true,
          message: "User registered successfully",
          user: {
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
          },
        },
        { status: 201 }
      );
    } catch (dbError) {
      // If it's already one of our custom errors, re-throw it
      if (dbError instanceof DuplicateResourceError) {
        throw dbError;
      }
      throw new DatabaseError("Failed to create user account", {
        originalError: dbError,
      });
    }
  } catch (error) {
    return handleRouteError(error, "POST /api/auth/register");
  }
}
