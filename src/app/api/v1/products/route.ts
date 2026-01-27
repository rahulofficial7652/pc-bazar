import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/db/models/product";
import { Category } from "@/lib/db/models/category";
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
                statusCode: 401
            });
        }

        const body = await req.json();
        const {
            name, slug, price, stock, category, description,
            discountPrice, images, brand, specs
        } = body;

        if (!name || !slug || !price || !category) {
            throw new AppError({
                code: ERROR_CODES.INVALID_INPUT,
                message: "Name, slug, price, and category are required",
                statusCode: 400
            });
        }

        const existingProduct = await Product.findOne({ name, slug, category });
        if (existingProduct) {
            throw new AppError({
                code: ERROR_CODES.DUPLICATE_RESOURCE,
                message: "This item already exists.",
                statusCode: 409
            });
        }

        const product = await Product.create({
            name, slug, price, stock: stock || 0, 
            category, description, discountPrice, 
            images, brand, specs, isActive: true
        });

        return ApiResponse.success(product, "Product created successfully", 201);

    } catch (error) {
        return handleRouteError(error, "CreateProduct");
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const category = searchParams.get("category");
        const brand = searchParams.get("brand");
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const order = searchParams.get("order") || "desc";

        const query: any = { isActive: true };

        if (category) {
            query.category = category;
        }
        if (brand) {
            query.brand = brand;
        }

        const sortOptions: any = { [sortBy]: order === "asc" ? 1 : -1 };

        const products = await Product.find(query)
            .populate({ path: "category", model: Category })
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        const response = {
            products,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts,
                limit,
            },
        };

        return ApiResponse.success(response);

    } catch (error) {
        return handleRouteError(error, "Failed to fetch products");
    }
}
