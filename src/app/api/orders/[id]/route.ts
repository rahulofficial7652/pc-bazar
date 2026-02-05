import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/order";
import {
    handleRouteError,
    UnauthorizedError,
    ResourceNotFoundError,
    ForbiddenError,
    DatabaseError,
} from "@/lib/errors";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Auth check
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            throw new UnauthorizedError("Please login to view order");
        }

        // DB connection
        await connectDB();

        // Fetch order
        try {
            const order = await Order.findById(id).populate("user", "name email role");

            if (!order) {
                throw new ResourceNotFoundError("Order");
            }

            // Access Check: Admin or Order Owner
            const userEmail = session.user.email;
            // @ts-ignore - session.user might have role from next-auth
            const userRole = session.user.role;
            const orderOwnerEmail = (order.user as any).email;

            if (userRole !== "ADMIN" && orderOwnerEmail !== userEmail) {
                throw new ForbiddenError("You can only view your own orders");
            }

            return Response.json(order, { status: 200 });
        } catch (dbError) {
            if (dbError instanceof UnauthorizedError || dbError instanceof ForbiddenError || dbError instanceof ResourceNotFoundError) {
                throw dbError;
            }
            throw new DatabaseError("Failed to fetch order", { originalError: dbError });
        }
    } catch (error) {
        return handleRouteError(error, `GET /api/orders/${(await params).id}`);
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Auth check - Admin only
        const session = await getServerSession(authOptions);
        // @ts-ignore
        if (!session || session.user?.role !== "ADMIN") {
            throw new ForbiddenError("Admin access required to update orders");
        }

        // Parse input
        const body = await req.json();
        const { status, paymentStatus } = body;

        // At least one field must be provided
        if (!status && !paymentStatus) {
            throw new ForbiddenError("No update fields provided");
        }

        // DB connection
        await connectDB();

        // Build update data
        const updateData: any = {};
        if (status) updateData.status = status;
        if (paymentStatus) {
            updateData.paymentStatus = paymentStatus;
            if (paymentStatus === "paid") {
                updateData.isPaid = true;
                updateData.paidAt = new Date();
            }
        }

        // Update order
        try {
            const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });

            if (!updatedOrder) {
                throw new ResourceNotFoundError("Order");
            }

            return Response.json(updatedOrder, { status: 200 });
        } catch (dbError) {
            if (dbError instanceof ResourceNotFoundError) {
                throw dbError;
            }
            throw new DatabaseError("Failed to update order", { originalError: dbError });
        }
    } catch (error) {
        return handleRouteError(error, `PATCH /api/orders/${(await params).id}`);
    }
}
