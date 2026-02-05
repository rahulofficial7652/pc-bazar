import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/product";
import { ApiResponse } from "@/lib/utils/apiResponse";
import {
  handleRouteError,
  ForbiddenError,
  ResourceNotFoundError,
  DatabaseError,
} from "@/lib/errors";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET a single product by ID or slug
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    try {
      let product;

      // Check if it's a valid MongoDB ObjectId (24 hex characters)
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        // It's an ID
        product = await Product.findById(id).populate("category");
      } else {
        // It's a slug
        product = await Product.findOne({ slug: id, isActive: true }).populate("category");
      }

      if (!product || !product.isActive) {
        throw new ResourceNotFoundError("Product");
      }

      return ApiResponse.success(product);
    } catch (dbError) {
      if (dbError instanceof ResourceNotFoundError) {
        throw dbError;
      }
      throw new DatabaseError("Failed to fetch product", { originalError: dbError });
    }
  } catch (error) {
    return handleRouteError(error, `GET /api/v1/products/${(await params).id}`);
  }
}

// UPDATE a product by ID
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    // Auth check - Admin only
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session.user?.role !== "ADMIN") {
      throw new ForbiddenError("Admin access required to update products");
    }

    // Parse input
    const body = await req.json();

    // Update product with error handling
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      if (!updatedProduct) {
        throw new ResourceNotFoundError("Product");
      }

      return ApiResponse.success(updatedProduct, "Product updated successfully");
    } catch (dbError) {
      if (dbError instanceof ResourceNotFoundError) {
        throw dbError;
      }
      throw new DatabaseError("Failed to update product", { originalError: dbError });
    }
  } catch (error) {
    return handleRouteError(error, `PUT /api/v1/products/${(await params).id}`);
  }
}

// SOFT DELETE a product by ID
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;

    // Auth check - Admin only
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session.user?.role !== "ADMIN") {
      throw new ForbiddenError("Admin access required to delete products");
    }

    // Soft delete with error handling
    try {
      const deletedProduct = await Product.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!deletedProduct) {
        throw new ResourceNotFoundError("Product");
      }

      return ApiResponse.success(
        { deletedProductId: id },
        "Product deleted successfully"
      );
    } catch (dbError) {
      if (dbError instanceof ResourceNotFoundError) {
        throw dbError;
      }
      throw new DatabaseError("Failed to delete product", { originalError: dbError });
    }
  } catch (error) {
    return handleRouteError(error, `DELETE /api/v1/products/${(await params).id}`);
  }
}
