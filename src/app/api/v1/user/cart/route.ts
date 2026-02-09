
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

// GET: Fetch user's cart
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            throw new UnauthorizedError("Please login to view your cart");
        }

        const user = await User.findOne({ email: session.user.email }).populate({
            path: "cart.product",
            model: Product
        });

        if (!user) {
            // If user has a session but no DB record (e.g. static admin not yet synced), 
            // return empty cart instead of throwing an error that triggers a toast.
            return ApiResponse.success([], "Cart empty (User record pending)");
        }

        // Filter out any products that might have been deleted but still exist in cart
        const validCart = user.cart.filter((item: any) => item.product != null);

        // Ensure calculations are done (if needed, but frontend can handle totals)
        // If we want to return total price, we can calculate here. 
        // For now, returning the populated cart is sufficient.

        return ApiResponse.success(validCart, "Cart fetched successfully");

    } catch (error) {
        return handleRouteError(error, "GET /api/v1/user/cart");
    }
}

// POST: Add to cart or update quantity
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            throw new UnauthorizedError("Please login to add items to cart");
        }

        const { productId, quantity = 1 } = await req.json();

        if (!productId) {
            throw new ValidationError("Product ID is required");
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            // For POST, we still need the user to exist. 
            // But we should throw a clearer error or handle gracefully.
            throw new UnauthorizedError("User account not found. Please re-login.");
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new ResourceNotFoundError("Product");
        }

        // Check stock
        if (product.stock < quantity) {
            throw new ValidationError(`Only ${product.stock} items left in stock`);
        }

        const cartItemIndex = user.cart.findIndex(
            (item: any) => item.product.toString() === productId
        );

        if (cartItemIndex > -1) {
            // Update quantity
            user.cart[cartItemIndex].quantity += quantity;
        } else {
            // Add new item
            user.cart.push({ product: productId, quantity });
        }

        await user.save();

        // Re-fetch to return populated data if needed, or just return success
        // Returning updated cart is better for UI sync
        const updatedUser = await User.findOne({ email: session.user.email }).populate("cart.product");

        return ApiResponse.success(updatedUser.cart, "Item added to cart");

    } catch (error) {
        return handleRouteError(error, "POST /api/v1/user/cart");
    }
}

// PUT: Update cart item quantity directly (e.g., set specific quantity)
export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            throw new UnauthorizedError("Login required");
        }

        const { productId, quantity } = await req.json();

        if (!productId || quantity === undefined) {
            throw new ValidationError("Product ID and quantity are required");
        }

        if (quantity < 1) {
            // If quantity is 0 or less, consider it a removal request or invalid
            // Let's treat 0 as remove, or throw error. Best to require > 0 here and use DELETE for removal.
            throw new ValidationError("Quantity must be at least 1");
        }

        const user = await User.findOne({ email: session.user.email });

        const cartItemIndex = user.cart.findIndex(
            (item: any) => item.product.toString() === productId
        );

        if (cartItemIndex === -1) {
            throw new ResourceNotFoundError("Item not found in cart");
        }

        // Check stock
        const product = await Product.findById(productId);
        if (product && product.stock < quantity) {
            throw new ValidationError(`Only ${product.stock} items available`);
        }

        user.cart[cartItemIndex].quantity = quantity;
        await user.save(); // Save the updated user document

        const updatedUser = await User.findOne({ email: session.user.email }).populate("cart.product");

        return ApiResponse.success(updatedUser.cart, "Cart updated");

    } catch (error) {
        return handleRouteError(error, "PUT /api/v1/user/cart");
    }
}

// DELETE: Remove item from cart
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            throw new UnauthorizedError("Login required");
        }

        // Assuming productId is passed via query param or body. Query param is standard for DELETE.
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            throw new ValidationError("Product ID is required");
        }

        const user = await User.findOne({ email: session.user.email });

        // Filter out the item
        user.cart = user.cart.filter(
            (item: any) => item.product.toString() !== productId
        );

        await user.save();

        const updatedUser = await User.findOne({ email: session.user.email }).populate("cart.product");

        return ApiResponse.success(updatedUser.cart, "Item removed from cart");

    } catch (error) {
        return handleRouteError(error, "DELETE /api/v1/user/cart");
    }
}
