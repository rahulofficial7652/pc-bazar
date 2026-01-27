import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/db/models/order";
import User from "@/lib/db/models/user";
import { Product } from "@/lib/db/models/product";
import { ApiResponse } from "@/lib/utils/apiResponse";
import { handleRouteError } from "@/lib/errors/handleRouteError";
import { AppError } from "@/lib/errors/AppError";
import { ERROR_CODES } from "@/lib/errors/errorCodes";

// GET - Get stats for Admin Dashboard
export async function GET(req: NextRequest) {
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

        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments({ isActive: true });
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: "PENDING" });
        
        // Calculate Total Revenue
        const result = await Order.aggregate([
            { $match: { isPaid: true } }, // Or status delivered
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = result[0]?.total || 0;

        return ApiResponse.success({
            totalUsers,
            totalProducts,
            totalOrders,
            pendingOrders,
            totalRevenue
        });

    } catch (error) {
        return handleRouteError(error, "GetAdminStats");
    }
}
