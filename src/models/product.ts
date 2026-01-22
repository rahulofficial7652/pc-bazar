import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    stock: Number,
    category: String, // "keyboard"
    specs: Object, // 🔥 flexible
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
