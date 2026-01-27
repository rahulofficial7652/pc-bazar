import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Category } from "@/lib/db/models/category";
import { connectDB } from "@/lib/db";
import { ApiResponse } from "@/lib/utils/apiResponse";
import { AppError } from "@/lib/errors/AppError";
import { ERROR_CODES } from "@/lib/errors/errorCodes";
import { handleRouteError } from "@/lib/errors/handleRouteError";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

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

    const category = await Category.findById(id);
    if (!category || !category.isActive) {
        throw new AppError({
            code: ERROR_CODES.RESOURCE_NOT_FOUND,
            message: "Category not found",
            statusCode: 404
        });
    }

    // Soft Delete
    category.isActive = false;
    await category.save();

    return ApiResponse.success({ id }, "Category deleted successfully");
  } catch (error) {
    return handleRouteError(error, "DeleteCategory");
  }
}
