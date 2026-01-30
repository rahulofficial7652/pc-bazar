import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Already correct
import { connectDB } from "@/lib/db";
import { Product } from "@/models/product";
import { ApiResponse } from "@/lib/utils/apiResponse";
import { handleRouteError } from "@/lib/errors/handleRouteError";
import { AppError } from "@/lib/errors/AppError";
import { ERROR_CODES } from "@/lib/errors/errorCodes";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET a single product by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id).populate("category");
    if (!product || !product.isActive) {
      throw new AppError({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: "Product not found.",
        statusCode: 404,
      });
    }

    return ApiResponse.success(product);
  } catch (error) {
    return handleRouteError(error, "Failed to fetch product");
  }
}

// UPDATE a product by ID
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

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

    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      throw new AppError({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: "Product not found for updating.",
        statusCode: 404,
      });
    }

    return ApiResponse.success(updatedProduct, "Product updated successfully");
  } catch (error) {
    return handleRouteError(error, "Failed to update product");
  }
}

// SOFT DELETE a product by ID
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session.user?.role !== "ADMIN") {
      throw new AppError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: "Unauthorized",
        statusCode: 401,
      });
    }

    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!deletedProduct) {
      throw new AppError({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: "Product not found for deletion.",
        statusCode: 404,
      });
    }

    return ApiResponse.success(
      { deletedProductId: id },
      "Product deleted successfully",
    );
  } catch (error) {
    return handleRouteError(error, "Failed to delete product");
  }
}
