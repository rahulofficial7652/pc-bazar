/**
 * @file Products API Route Handler
 * @description Handles POST and GET requests for products
 * - POST: Create a new product with validation
 * - GET: Fetch products with optional category filtering
 */

import { NextResponse } from "next/server";
import { Product } from "@/models/product";
import { Category } from "@/models/category";
import { connectDB } from "@/lib/db";
import { logger } from "@/lib/logger";
import { AppError } from "@/lib/errors/AppError";
import { ERROR_CODES } from "@/lib/errors/errorCodes";
import { handleRouteError } from "@/lib/errors/handleRouteError";

/**
 * POST /api/v1/products
 * Creates a new product in the database
 * 
 * @param {Request} req - The HTTP request object containing product data
 * @returns {Response} JSON response with created product or error
 */
export async function POST(req: Request) {
  try {
    // Establish connection to MongoDB database
    await connectDB();
    
    // Parse request body as JSON
    const body = await req.json();
    
    // Destructure product data from request body
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

    // Validate required fields for product creation
    if (!name || !price || !stock || !categorySlug) {
      throw new AppError({
        statusCode: 400,
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Name, price, stock and category are required",
        meta: { body },
      });
    }

    // Verify that the provided category exists in the database
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      throw new AppError({
        statusCode: 404,
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: "Category not found",
        meta: { categorySlug },
      });
    }

    // Create new product document in database with validated category reference
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
    
    // Return created product with 201 Created status
    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    // Handle errors and return appropriate error response
    return handleRouteError(error, "POST /api/v1/products");
  }
}

/**
 * GET /api/v1/products
 * Retrieves products from the database with optional filtering
 * 
 * @param {Request} req - The HTTP request object containing query parameters
 * @query {string} category - (Optional) Filter products by category slug
 * @query {string} showAll - (Optional) Set to "true" to include inactive products
 * @returns {Response} JSON response with array of products
 */
// ================= receive (read) the products ==================
export async function GET(req: Request) {
  try {
    // Establish connection to MongoDB database
    await connectDB();
    
    // Extract and parse query parameters from request URL
    const { searchParams } = new URL(req.url);  
    const categorySlug = searchParams.get("category");
    const showAll = searchParams.get("showAll") === "true";

    // Initialize filter to show only active products by default
    let filter: any = { isActive: true };
    
    // If showAll is true, remove the isActive filter to include all products
    if (showAll) {
      delete filter.isActive;
    }

    // Add category filter if provided
    if (categorySlug) {
      // Look up category by slug to get its ID for filtering
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        // Filter products by the category's database ID
        filter.category = category._id;
      } else {
        // Return empty array if the requested category doesn't exist
        return NextResponse.json({ success: true, data: [] });
      }
    }

    // Query products matching all filters and populate category details
    const products = await Product.find(filter).populate("category");
    logger.info("Fetched products", { count: products.length, categorySlug });
    
    // Return fetched products
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    // Handle errors and return appropriate error response
    return handleRouteError(error, "GET /api/v1/products");
  }
}
