import { NextResponse } from "next/server";
import { Product } from "@/models/product";
import { connectDB } from "@/lib/db";
import { logger } from "@/lib/logger";
import { Category } from "@/models/category";
import { AppError } from "@/lib/errors/AppError";
import { ERROR_CODES } from "@/lib/errors/errorCodes";
import { handleRouteError } from "@/lib/errors/handleRouteError";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id).populate("category");

    if (!product) {
      throw new AppError({
        statusCode: 404,
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: "Product not found",
        meta: { id },
      });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleRouteError(error, `GET /api/v1/products/${(await params).id}`);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { category: categorySlug, ...updateData } = body;

    logger.info("Attempting to update product", { id, updateData });

    // resolving category slug to ID if provided
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (!category) {
        throw new AppError({
          statusCode: 400,
          code: ERROR_CODES.VALIDATION_ERROR,
          message: "Invalid Category",
          meta: { categorySlug },
        });
      }
      // @ts-ignore
      updateData.category = category._id;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new AppError({
        statusCode: 404,
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: "Product to update not found",
        meta: { id },
      });
    }

    logger.info("Product updated successfully", { id });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleRouteError(error, `PUT /api/v1/products/${(await params).id}`);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    logger.info("Attempting to delete product", { id });

    // Soft delete: set isActive to false
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      throw new AppError({
        statusCode: 404,
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: "Product to delete not found",
        meta: { id },
      });
    }

    logger.info("Product soft deleted successfully", { id });
    return NextResponse.json({ success: true, message: "Product soft deleted", data: { deleted: true } });
  } catch (error) {
    return handleRouteError(error, `DELETE /api/v1/products/${(await params).id}`);
  }
}
