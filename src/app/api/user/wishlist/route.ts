import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { Product } from "@/models/product";
import {
    handleRouteError,
    UnauthorizedError,
    ResourceNotFoundError,
    ValidationError,
    DatabaseError,
    DuplicateResourceError,
} from "@/lib/errors";

export async function GET(req: Request) {
    try {
        // Auth check
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            throw new UnauthorizedError("Please login to view wishlist");
        }

        // DB connection
        await connectDB();

        // Fetch user with populated wishlist
        try {
            const user = await User.findOne({ email: session.user.email }).populate({
                path: "wishlist",
                model: Product,
            });

            if (!user) {
                throw new ResourceNotFoundError("User");
            }

            return Response.json({ wishlist: user.wishlist || [] }, { status: 200 });
        } catch (dbError) {
            throw new DatabaseError("Failed to fetch wishlist", { originalError: dbError });
        }
    } catch (error) {
        return handleRouteError(error, "GET /api/user/wishlist");
    }
}

export async function POST(req: Request) {
    try {
        // Auth check
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            throw new UnauthorizedError("Please login to add to wishlist");
        }

        // Parse and validate input
        const body = await req.json();
        const { productId } = body;

        if (!productId) {
            throw new ValidationError("Product ID is required");
        }

        // DB connection
        await connectDB();

        // Fetch user
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            throw new ResourceNotFoundError("User");
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            throw new ResourceNotFoundError("Product");
        }

        // Check if already in wishlist
        if (user.wishlist.some((id: any) => id.toString() === productId)) {
            throw new DuplicateResourceError("Product is already in wishlist");
        }

        // Add to wishlist
        user.wishlist.push(productId);

        // Save with error handling
        try {
            await user.save();
        } catch (dbError) {
            throw new DatabaseError("Failed to add to wishlist", { originalError: dbError });
        }

        return Response.json(
            { message: "Added to wishlist", productId },
            { status: 200 }
        );
    } catch (error) {
        return handleRouteError(error, "POST /api/user/wishlist");
    }
}

export async function DELETE(req: Request) {
    try {
        // Auth check
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            throw new UnauthorizedError("Please login to remove from wishlist");
        }

        // Validate input
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            throw new ValidationError("Product ID is required");
        }

        // DB connection
        await connectDB();

        // Fetch user
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            throw new ResourceNotFoundError("User");
        }

        // Remove from wishlist
        const initialLength = user.wishlist.length;
        user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId);

        // Check if product was in wishlist
        if (user.wishlist.length === initialLength) {
            throw new ResourceNotFoundError("Product not found in wishlist");
        }

        // Save with error handling
        try {
            await user.save();
        } catch (dbError) {
            throw new DatabaseError("Failed to remove from wishlist", { originalError: dbError });
        }

        return Response.json(
            { message: "Removed from wishlist" },
            { status: 200 }
        );
    } catch (error) {
        return handleRouteError(error, "DELETE /api/user/wishlist");
    }
}
