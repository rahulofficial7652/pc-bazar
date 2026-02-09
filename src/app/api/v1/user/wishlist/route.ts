
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { Product } from "@/models/product";
import { ApiResponse } from "@/lib/utils/apiResponse";
import {
    handleRouteError,
    UnauthorizedError,
    DatabaseError,
    ResourceNotFoundError,
    ValidationError
} from "@/lib/errors";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            throw new UnauthorizedError("Please login to view your wishlist");
        }

        const user = await User.findOne({ email: session.user.email }).populate("wishlist");

        if (!user) {
            // Return empty instead of error to avoid toast on every page
            return ApiResponse.success([], "Wishlist empty (User record pending)");
        }

        return ApiResponse.success(user.wishlist, "Wishlist fetched successfully");

    } catch (error) {
        return handleRouteError(error, "GET /api/v1/user/wishlist");
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            throw new UnauthorizedError("Login required");
        }

        const { productId } = await req.json();

        if (!productId) {
            throw new ValidationError("Product ID is required");
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            throw new UnauthorizedError("User record not found. Please log in again.");
        }

        // Check if item exists in wishlist
        const index = user.wishlist.indexOf(productId);

        let message = "";
        if (index > -1) {
            // Remove if exists (Toggle behavior is common, but let's be explicit: user asked for add option)
            // But if user clicks 'heart' again, it usually removes.
            // Let's implement toggle logic for convenience if no action specified, or explicit add/remove flags.
            // For now, let's assume POST is strictly for ADDING.
            // Or better: Toggle is more user-friendly for a single button.

            // Wait, standard REST: POST = Create. DELETE = Remove.
            // But a "toggle" button is easier for frontend if API handles it.
            // I'll stick to Toggle logic here for simplicity on frontend: "Add/Remove based on existence". 
            // Actually, separate endpoints are cleaner. Let's make POST purely ADD.
            // If already exists, return success message "Already in wishlist" or just ignore.

            // Re-reading User Request: "wishlist me add kar saku". Doesn't explicitly say toggle.
            // I'll implement ADD here. If exists, do nothing.

            if (!user.wishlist.includes(productId)) {
                user.wishlist.push(productId);
                message = "Added to wishlist";
            } else {
                message = "Already in wishlist";
            }
        } else {
            user.wishlist.push(productId);
            message = "Added to wishlist";
        }

        await user.save();

        // Return updated list
        const updatedUser = await User.findOne({ email: session.user.email }).populate("wishlist");

        return ApiResponse.success(updatedUser.wishlist, message);

    } catch (error) {
        return handleRouteError(error, "POST /api/v1/user/wishlist");
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            throw new UnauthorizedError("Login required");
        }

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            throw new ValidationError("Product ID is required");
        }

        const user = await User.findOne({ email: session.user.email });

        user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId);

        await user.save();

        const updatedUser = await User.findOne({ email: session.user.email }).populate("wishlist");

        return ApiResponse.success(updatedUser.wishlist, "Removed from wishlist");

    } catch (error) {
        return handleRouteError(error, "DELETE /api/v1/user/wishlist");
    }
}
