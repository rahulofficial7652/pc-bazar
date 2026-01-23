import { NextResponse } from "next/server";
import { Category } from "@/models/category";
import { connectDB } from "@/lib/db";
import { ApiResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return ApiResponse.error("Name and slug are required", { body }, 400);
    }

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return ApiResponse.error("Category with this slug already exists", { slug }, 409);
    }

    const category = await Category.create({ name, slug });
    return ApiResponse.success(category, "Category created successfully", 201);
  } catch (error) {
    return ApiResponse.error("Internal Server Error creating category", error);
  }
}

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find();
    return ApiResponse.success(categories);
  } catch (error) {
    return ApiResponse.error("Internal Server Error fetching categories", error);
  }
}
