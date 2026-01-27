import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Already correct
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/db/models/product";
import { ApiResponse } from "@/lib/utils/apiResponse";
import { handleRouteError } from "@/lib/errors/handleRouteError";
import { AppError } from "@/lib/errors/AppError";
import { ERROR_CODES } from "@/lib/errors/errorCodes";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (!session || session.user?.role !== "ADMIN") {
      throw new AppError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: "Unauthorized",
        statusCode: 401,
      });
    }

    const body = await req.json();
    const {
      name,
      slug,
      price,
      stock,
      category,
      description,
      discountPrice,
      images,
      brand,
      specs,
      isActive,
    } = body;

    if (!name || !slug || !price || !stock || !category) {
      throw new AppError({
        code: ERROR_CODES.INVALID_INPUT,
        statusCode: 400,
        message: "Missing required product fields",
      });
    }

    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      throw new AppError({
        code: ERROR_CODES.DUPLICATE_RESOURCE,
        statusCode: 400,
        message: "Product with this slug already exists",
      });
    }

    const product = await Product.create({
      name,
      slug,
      price,
      stock,
      category,
      description,
      discountPrice,
      images,
      brand,
      specs,
      isActive,
    });

    return ApiResponse.success(product, "Product created successfully", 201);
  } catch (error) {
    return handleRouteError(error, "Failed to create product");
  }
}
