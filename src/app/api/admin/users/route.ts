import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import {
    handleRouteError,
    ForbiddenError,
    ResourceNotFoundError,
    ValidationError,
    DatabaseError,
} from "@/lib/errors";

export async function GET(req: Request) {
    try {
        // Auth check - Admin only
        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session || session.user?.role !== "ADMIN") {
            throw new ForbiddenError("Admin access required");
        }

        // DB connection
        await connectDB();

        // Fetch users and aggregate their data
        try {
            const users = await User.aggregate([
                {
                    $lookup: {
                        from: "orders",
                        localField: "_id",
                        foreignField: "user",
                        as: "orders",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        role: 1,
                        isActive: 1,
                        image: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        wishlistCount: { $size: { $ifNull: ["$wishlist", []] } },
                        cartCount: { $size: { $ifNull: ["$cart", []] } },
                        ordersCount: { $size: "$orders" },
                        totalSpent: { $sum: "$orders.totalAmount" },
                    },
                },
                { $sort: { createdAt: -1 } },
            ]);

            // Format for frontend compatibility
            const formattedUsers = users.map((u) => ({
                ...u,
                id: u._id.toString(),
                lastLogin: u.updatedAt,
            }));

            return Response.json(formattedUsers, { status: 200 });
        } catch (dbError) {
            throw new DatabaseError("Failed to fetch users", { originalError: dbError });
        }
    } catch (error) {
        return handleRouteError(error, "GET /api/admin/users");
    }
}

export async function PATCH(req: Request) {
    try {
        // Auth check - Admin only
        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session || session.user?.role !== "ADMIN") {
            throw new ForbiddenError("Admin access required");
        }

        // Parse and validate input
        const body = await req.json();
        const { id, isActive, role } = body;

        if (!id) {
            throw new ValidationError("User ID is required");
        }

        if (isActive === undefined && !role) {
            throw new ValidationError("At least one field (isActive or role) must be provided");
        }

        // DB connection
        await connectDB();

        // Build update data
        const updateData: any = {};
        if (typeof isActive === "boolean") updateData.isActive = isActive;
        if (role) updateData.role = role;

        // Update user
        try {
            const updatedUser = await User.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });

            if (!updatedUser) {
                throw new ResourceNotFoundError("User");
            }

            return Response.json(
                { message: "User updated successfully", user: updatedUser },
                { status: 200 }
            );
        } catch (dbError) {
            if (dbError instanceof ResourceNotFoundError) {
                throw dbError;
            }
            throw new DatabaseError("Failed to update user", { originalError: dbError });
        }
    } catch (error) {
        return handleRouteError(error, "PATCH /api/admin/users");
    }
}
