import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import mongoose from "mongoose";
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
            throw new UnauthorizedError("Please login to view addresses");
        }

        const userId = (session.user as any).id;

        // DB connection
        await connectDB();

        // If it's a static admin, they don't have addresses in DB
        if (userId === "admin") {
            return Response.json({ addresses: [] }, { status: 200 });
        }

        // Fetch user
        const user = await User.findById(userId).select("addresses");
        if (!user) {
            throw new ResourceNotFoundError("User");
        }

        return Response.json({ addresses: user.addresses || [] }, { status: 200 });
    } catch (error) {
        return handleRouteError(error, "GET /api/user/addresses");
    }
}

export async function POST(req: Request) {
    try {
        // Auth check
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            throw new UnauthorizedError("Please login to add address");
        }

        // Parse and validate input
        const body = await req.json();
        const { type, name, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = body;

        if (!name || !phone || !addressLine1 || !city || !state || !pincode) {
            throw new ValidationError("Missing required address fields", {
                required: ["name", "phone", "addressLine1", "city", "state", "pincode"],
            });
        }

        const userId = (session.user as any).id;

        // DB connection
        await connectDB();

        // Static admin cannot manage DB resources
        if (userId === "admin") {
            throw new ForbiddenError("Static admin cannot manage these resources.");
        }

        // Fetch user
        const user = await User.findById(userId);
        if (!user) {
            throw new ResourceNotFoundError("User");
        }

        // Create new address
        const newAddress = {
            _id: new mongoose.Types.ObjectId(),
            type: type || "home",
            name,
            phone,
            addressLine1,
            addressLine2: addressLine2 || "",
            city,
            state,
            pincode,
            isDefault: isDefault || false,
        };

        // If setting as default, unset other defaults
        if (isDefault && user.addresses && user.addresses.length > 0) {
            user.addresses.forEach((addr: any) => {
                addr.isDefault = false;
            });
        }

        // If this is the first address, make it default automatically
        if (!user.addresses || user.addresses.length === 0) {
            newAddress.isDefault = true;
        }

        user.addresses.push(newAddress);

        // Save with error handling
        try {
            await user.save();
        } catch (dbError) {
            throw new DatabaseError("Failed to save address", { originalError: dbError });
        }

        return Response.json(
            { message: "Address added successfully", address: newAddress },
            { status: 201 }
        );
    } catch (error) {
        return handleRouteError(error, "POST /api/user/addresses");
    }
}

export async function PUT(req: Request) {
    try {
        // Auth check
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            throw new UnauthorizedError("Please login to update address");
        }

        // Parse and validate input
        const body = await req.json();
        const { id, type, name, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = body;

        if (!id) {
            throw new ValidationError("Address ID is required");
        }

        const userId = (session.user as any).id;

        // DB connection
        await connectDB();

        // Static admin cannot manage DB resources
        if (userId === "admin") {
            throw new ForbiddenError("Static admin cannot manage these resources.");
        }

        // Fetch user
        const user = await User.findById(userId);
        if (!user) {
            throw new ResourceNotFoundError("User");
        }

        // Find address
        const addressIndex = user.addresses.findIndex((addr: any) => addr._id.toString() === id);
        if (addressIndex === -1) {
            throw new ResourceNotFoundError("Address");
        }

        // Handle Default Logic
        if (isDefault) {
            user.addresses.forEach((addr: any) => {
                addr.isDefault = false;
            });
        }

        // Update fields
        const updatedAddress = user.addresses[addressIndex];
        if (type) updatedAddress.type = type;
        if (name) updatedAddress.name = name;
        if (phone) updatedAddress.phone = phone;
        if (addressLine1) updatedAddress.addressLine1 = addressLine1;
        if (addressLine2 !== undefined) updatedAddress.addressLine2 = addressLine2;
        if (city) updatedAddress.city = city;
        if (state) updatedAddress.state = state;
        if (pincode) updatedAddress.pincode = pincode;
        if (isDefault !== undefined) updatedAddress.isDefault = isDefault;

        // Save with error handling
        try {
            await user.save();
        } catch (dbError) {
            throw new DatabaseError("Failed to update address", { originalError: dbError });
        }

        return Response.json(
            { message: "Address updated successfully", addresses: user.addresses },
            { status: 200 }
        );
    } catch (error) {
        return handleRouteError(error, "PUT /api/user/addresses");
    }
}

export async function DELETE(req: Request) {
    try {
        // Auth check
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            throw new UnauthorizedError("Please login to delete address");
        }

        // Validate input
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            throw new ValidationError("Address ID is required");
        }

        const userId = (session.user as any).id;

        // DB connection
        await connectDB();

        // Static admin cannot manage DB resources
        if (userId === "admin") {
            throw new ForbiddenError("Static admin cannot manage these resources.");
        }

        // Fetch user
        const user = await User.findById(userId);
        if (!user) {
            throw new ResourceNotFoundError("User");
        }

        // Filter out address
        const initialLength = user.addresses.length;
        user.addresses = user.addresses.filter((addr: any) => addr._id.toString() !== id);

        // Check if address was found
        if (user.addresses.length === initialLength) {
            throw new ResourceNotFoundError("Address");
        }

        // Save with error handling
        try {
            await user.save();
        } catch (dbError) {
            throw new DatabaseError("Failed to delete address", { originalError: dbError });
        }

        return Response.json(
            { message: "Address deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return handleRouteError(error, "DELETE /api/user/addresses");
    }
}
