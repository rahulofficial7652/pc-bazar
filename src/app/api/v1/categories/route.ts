import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Category } from "@/lib/db/models/category";
import { connectDB } from "@/lib/db";
import { ApiResponse } from "@/lib/utils/apiResponse";
import { AppError } from "@/lib/errors/AppError";
import { ERROR_CODES } from "@/lib/errors/errorCodes";
import { handleRouteError } from "@/lib/errors/handleRouteError";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Auth Check
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session.user?.role !== "ADMIN") {
        throw new AppError({
            code: ERROR_CODES.UNAUTHORIZED,
            message: "Unauthorized access",
            statusCode: 401
        });
    }

    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
        throw new AppError({
            code: ERROR_CODES.INVALID_INPUT,
            message: "Name and slug are required",
            statusCode: 400
        });
    }

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
        throw new AppError({
            code: ERROR_CODES.DUPLICATE_RESOURCE,
            message: "Category with this slug already exists",
            statusCode: 409
        });
    }

    const category = await Category.create({ name, slug, isActive: true });
    return ApiResponse.success(category, "Category created successfully", 201);
  } catch (error) {
    return handleRouteError(error, "CreateCategory");
  }
}

export async function GET() {
  try {
    await connectDB();
    // Only return active categories for public list
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    return ApiResponse.success(categories);
  } catch (error) {
    return handleRouteError(error, "GetCategories");
  }
}
