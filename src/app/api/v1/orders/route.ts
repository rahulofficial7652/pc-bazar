
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/db/models/user";
import { Order } from "@/lib/db/models/order";
import { ApiResponse } from "@/lib/utils/apiResponse";
import { handleRouteError } from "@/lib/errors/handleRouteError";
import { AppError } from "@/lib/errors/AppError";
import { ERROR_CODES } from "@/lib/errors/errorCodes";

// GET - List orders (Admin sees all, User sees own)
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
             throw new AppError({
                code: ERROR_CODES.UNAUTHORIZED,
                message: "Unauthorized",
                statusCode: 401
            });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "20");
        const page = parseInt(searchParams.get("page") || "1");

        let query = {};
         // @ts-ignore
        if (session.user.role !== "ADMIN") {
             // @ts-ignore
             query = { user: session.user.id };
        }

        const orders = await Order.find(query)
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        
        const total = await Order.countDocuments(query);

        return ApiResponse.success({ orders, total, page, limit });

    } catch (error) {
        return handleRouteError(error, "GetOrders");
    }
}

// POST - Create Order
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
             throw new AppError({
                code: ERROR_CODES.UNAUTHORIZED,
                message: "Unauthorized",
                statusCode: 401
            });
        }

        const body = await req.json();
        const { items, shippingAddress, totalAmount, paymentMethod } = body;

        if (!items || items.length === 0 || !shippingAddress || !totalAmount) {
             throw new AppError({
                code: ERROR_CODES.INVALID_INPUT,
                message: "Invalid order data",
                statusCode: 400
            });
        }

        const order = await Order.create({
            // @ts-ignore
            user: session.user.id,
            items,
            shippingAddress,
            totalAmount,
            paymentMethod,
            status: "PENDING",
            isPaid: false
        });

        return ApiResponse.success(order, "Order placed successfully", 201);

    } catch (error) {
        return handleRouteError(error, "CreateOrder");
    }
}
