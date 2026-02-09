import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/product";
import { Category } from "@/models/category";
import { ApiResponse } from "@/lib/utils/apiResponse";
import {
    handleRouteError,
    ForbiddenError,
    ValidationError,
    DuplicateResourceError,
    DatabaseError,
} from "@/lib/errors";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Auth check - Admin only
        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session || session.user?.role !== "ADMIN") {
            throw new ForbiddenError("Admin access required to create products");
        }

        // Parse and validate input
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
            highlights,
            features,
            warranty,
            returnPolicy,
            shippingInfo,
            manufacturerDetails,
            metaTitle,
            metaDescription,
            tags,
            isFeatured
        } = body;

        if (!name || !slug || !price || !category) {
            throw new ValidationError("Name, slug, price, and category are required", {
                required: ["name", "slug", "price", "category"],
            });
        }

        // Validate and Sanitize Price
        let finalPrice = Number(price);
        let finalDiscountPrice = discountPrice ? Number(discountPrice) : undefined;

        if (isNaN(finalPrice)) {
            throw new ValidationError("Price must be a valid number");
        }

        // If discount price exists, ensure logic is correct
        if (finalDiscountPrice !== undefined) {
            if (isNaN(finalDiscountPrice)) {
                finalDiscountPrice = undefined; // Ignore invalid discount price
            } else if (finalDiscountPrice > finalPrice) {
                // User potentially swapped inputs: 
                // e.g., entered Price: 8000 (selling price), Discount Price: 10000 (MRP)
                // Start Logic: If unexpected input where Discount > Price, assume user meant Price is MRP and Discount is Selling Price
                // But typically: Price field = MRP/Regular Price, Discount Price field = Selling Price
                // Retaining user request: "price and discount calculation... add product me price and discount price add karne par ulta show kr rha hai"
                // Fix: Ensure `price` is the higher value (MRP) and `discountPrice` is the lower value (Selling Price).
                // However, the schema might expect `price` as MRP and `discountPrice` as effective price.
                // Let's swap if discountPrice > price to enable proper "SALE" logic.
                const temp = finalPrice;
                finalPrice = finalDiscountPrice;
                finalDiscountPrice = temp;
            } else if (finalDiscountPrice === finalPrice) {
                finalDiscountPrice = undefined; // No discount if equal
            }
        }

        // Check for duplicate
        try {
            const existingProduct = await Product.findOne({
                $or: [{ name }, { slug }]
            });
            if (existingProduct) {
                throw new DuplicateResourceError("Product with this name or slug already exists");
            }

            // Create product
            const product = await Product.create({
                name,
                slug,
                price: finalPrice,
                stock: stock || 0,
                category,
                description,
                discountPrice: finalDiscountPrice,
                images,
                brand,
                specs,
                highlights,
                features,
                warranty,
                returnPolicy,
                shippingInfo,
                manufacturerDetails,
                metaTitle,
                metaDescription,
                tags,
                isFeatured,
                isActive: true,
            });

            return ApiResponse.success(product, "Product created successfully", 201);
        } catch (dbError) {
            if (dbError instanceof DuplicateResourceError) {
                throw dbError;
            }
            throw new DatabaseError("Failed to create product", { originalError: dbError });
        }
    } catch (error) {
        return handleRouteError(error, "POST /api/v1/products");
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Parse query params
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const category = searchParams.get("category");
        const brand = searchParams.get("brand");
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const order = searchParams.get("order") || "desc";
        const search = searchParams.get("search");
        const isFeatured = searchParams.get("isFeatured");

        // Build query
        const query: any = { isActive: true };

        if (isFeatured === "true") {
            query.isFeatured = true;
        }

        if (category) {
            query.category = category;
        }
        if (brand) {
            query.brand = brand;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Sort options
        const sortOptions: any = { [sortBy]: order === "asc" ? 1 : -1 };

        // Fetch products with error handling
        try {
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
        } catch (dbError) {
            throw new DatabaseError("Failed to fetch products", { originalError: dbError });
        }
    } catch (error) {
        return handleRouteError(error, "GET /api/v1/products");
    }
}
