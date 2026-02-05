import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/order";
import User from "@/models/user";
import {
    handleRouteError,
    UnauthorizedError,
    ResourceNotFoundError,
    ValidationError,
    DatabaseError,
    ForbiddenError,
} from "@/lib/errors";

export async function GET(req: Request) {
    try {
        // Auth check
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            throw new UnauthorizedError("Please login to view orders");
        }

        // DB connection
        await connectDB();

        // Fetch user
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            throw new ResourceNotFoundError("User");
        }

        // Parse query params
        const { searchParams } = new URL(req.url);
        const limit = searchParams.get("limit");
        const isAdminView = searchParams.get("admin") === "true";

        let query: any = {};

        // If not admin or not requesting admin view, restrict to own orders
        if (isAdminView) {
            if (user.role !== "ADMIN") {
                throw new ForbiddenError("Admin access required to view all orders");
            }
            // Admin can see all orders, no filter
        } else {
            // User can only see their own orders
            query = { user: user._id };
        }

        // Fetch orders
        try {
            const orders = await Order.find(query)
                .populate("user", "name email")
                .sort({ createdAt: -1 })
                .limit(limit ? parseInt(limit, 10) : 0);

            return Response.json({ orders }, { status: 200 });
        } catch (dbError) {
            throw new DatabaseError("Failed to fetch orders", { originalError: dbError });
        }
    } catch (error) {
        return handleRouteError(error, "GET /api/orders");
    }
}

export async function POST(req: Request) {
    try {
        // Auth check
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            throw new UnauthorizedError("Please login to create order");
        }

        // DB connection
        await connectDB();

        // Fetch user
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            throw new ResourceNotFoundError("User");
        }

        // Parse and validate input
        const body = await req.json();
        const { items, totalAmount, shippingAddress, paymentMethod } = body;

        if (!items || items.length === 0) {
            throw new ValidationError("Order must contain at least one item");
        }

        if (!totalAmount || totalAmount <= 0) {
            throw new ValidationError("Invalid total amount");
        }

        if (!shippingAddress || !shippingAddress.fullname || !shippingAddress.address || !shippingAddress.city) {
            throw new ValidationError("Complete shipping address is required", {
                required: ["fullname", "address", "city", "postalCode", "country", "phone"],
            });
        }

        // Create order
        try {
            const newOrder = await Order.create({
                user: user._id,
                items,
                totalAmount,
                shippingAddress,
                paymentMethod: paymentMethod || "COD",
                status: "PENDING",
                isPaid: false,
            });

            return Response.json(
                { message: "Order created successfully", order: newOrder },
                { status: 201 }
            );
        } catch (dbError) {
            throw new DatabaseError("Failed to create order", { originalError: dbError });
        }
    } catch (error) {
        return handleRouteError(error, "POST /api/orders");
    }
}
