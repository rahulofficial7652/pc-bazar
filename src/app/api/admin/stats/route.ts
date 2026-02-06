import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/product";
import User from "@/models/user";
import { Order } from "@/models/order";
import { Category } from "@/models/category";
import { ApiResponse } from "@/lib/utils/apiResponse";
import {
    handleRouteError,
    ForbiddenError,
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

        try {
            // 1. Products Stats
            const totalProducts = await Product.countDocuments();
            const activeProducts = await Product.countDocuments({ isActive: true });

            // Aggregation for inventory value
            const inventoryStats = await Product.aggregate([
                {
                    $group: {
                        _id: null,
                        totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
                        outOfStock: { $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] } },
                        lowStock: {
                            $sum: {
                                $cond: [
                                    { $and: [{ $gt: ["$stock", 0] }, { $lt: ["$stock", 10] }] },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]);
            const invData = inventoryStats[0] || { totalValue: 0, outOfStock: 0, lowStock: 0 };

            // 2. Users Stats
            const totalUsers = await User.countDocuments();
            const activeUsers = await User.countDocuments({ isActive: true });

            // 3. Orders Stats
            const totalOrders = await Order.countDocuments();
            const pendingOrders = await Order.countDocuments({ status: "PENDING" });
            const shippedOrders = await Order.countDocuments({ status: "SHIPPED" });
            const deliveredOrders = await Order.countDocuments({ status: "DELIVERED" });

            // Revenue Aggregation
            const revenueStats = await Order.aggregate([
                { $match: { isPaid: true } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$totalAmount" },
                    },
                },
            ]);

            const pendingRevenueStats = await Order.aggregate([
                { $match: { isPaid: false, status: { $ne: "CANCELLED" } } },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$totalAmount" },
                    },
                },
            ]);

            // 4. Categories
            const totalCategories = await Category.countDocuments();

            return ApiResponse.success({
                products: {
                    total: totalProducts,
                    active: activeProducts,
                    inactive: totalProducts - activeProducts,
                    outOfStock: invData.outOfStock,
                    lowStock: invData.lowStock,
                },
                categories: {
                    total: totalCategories,
                },
                inventory: {
                    totalValue: invData.totalValue,
                },
                users: {
                    total: totalUsers,
                    active: activeUsers,
                },
                orders: {
                    total: totalOrders,
                    pending: pendingOrders,
                    shipped: shippedOrders,
                    delivered: deliveredOrders,
                    revenue: revenueStats[0]?.totalRevenue || 0,
                    pendingRevenue: pendingRevenueStats[0]?.totalRevenue || 0,
                },
            });
        } catch (dbError) {
            throw new DatabaseError("Failed to fetch admin statistics", {
                originalError: dbError,
            });
        }
    } catch (error) {
        return handleRouteError(error, "GET /api/admin/stats");
    }
}
