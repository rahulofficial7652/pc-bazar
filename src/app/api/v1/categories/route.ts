import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Category } from "@/models/category";
import { connectDB } from "@/lib/db";
import { ApiResponse } from "@/lib/utils/apiResponse";
import {
  handleRouteError,
  ForbiddenError,
  ValidationError,
  DuplicateResourceError,
  DatabaseError,
} from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Auth check - Admin only
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session.user?.role !== "ADMIN") {
      throw new ForbiddenError("Admin access required to create categories");
    }

    // Parse and validate input
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      throw new ValidationError("Name and slug are required", {
        required: ["name", "slug"],
      });
    }

    // Check for duplicates and create
    try {
      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        throw new DuplicateResourceError("Category with this slug");
      }

      const category = await Category.create({ name, slug, isActive: true });
      return ApiResponse.success(category, "Category created successfully", 201);
    } catch (dbError) {
      if (dbError instanceof DuplicateResourceError) {
        throw dbError;
      }
      throw new DatabaseError("Failed to create category", { originalError: dbError });
    }
  } catch (error) {
    return handleRouteError(error, "POST /api/v1/categories");
  }
}

export async function GET() {
  try {
    await connectDB();

    // Fetch active categories
    try {
      const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
      return ApiResponse.success(categories);
    } catch (dbError) {
      throw new DatabaseError("Failed to fetch categories", { originalError: dbError });
    }
  } catch (error) {
    return handleRouteError(error, "GET /api/v1/categories");
  }
}
