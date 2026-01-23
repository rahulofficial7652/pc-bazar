import { NextResponse } from "next/server";
import { Product } from "@/models/product";
import { Category } from "@/models/category";
import { connectDB } from "@/lib/db";
import { logger } from "@/lib/logger";
import { AppError } from "@/lib/errors/AppError";
import { ERROR_CODES } from "@/lib/errors/errorCodes";
import { handleRouteError } from "@/lib/errors/handleRouteError";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      name,
      price,
      stock,
      category: categorySlug,
      specs,
      description,
      discountPrice,
      images,
      brand,
    } = body;

    logger.info("Attempting to create product", { name, categorySlug });

    if (!name || !price || !stock || !categorySlug) {
      throw new AppError({
        statusCode: 400,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Name, price, stock and category are required",
        meta: { body },
      });
    }

    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      throw new AppError({
        statusCode: 404,
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: "Category not found",
        meta: { categorySlug },
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      stock,
      category: category._id,
      images,
      brand,
      specs,
    });

    logger.info("Product created successfully", { productId: product._id });
    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    return handleRouteError(error, "POST /api/v1/products");
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const showAll = searchParams.get("showAll") === "true";

    let filter: any = { isActive: true };
    if (showAll) {
      delete filter.isActive;
    }

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        filter.category = category._id;
      } else {
        return NextResponse.json({ success: true, data: [] });
      }
    }

    const products = await Product.find(filter).populate("category");
    logger.info("Fetched products", { count: products.length, categorySlug });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return handleRouteError(error, "GET /api/v1/products");
  }
}
