import mongoose, { Schema, models, model } from "mongoose";

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: { type: String }
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
        default: "PENDING"
    },
    shippingAddress: {
        fullname: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
    },
    paymentMethod: { type: String, default: "COD" }, // Simplified
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
}, { timestamps: true });

export const Order = models.Order || model("Order", orderSchema);
