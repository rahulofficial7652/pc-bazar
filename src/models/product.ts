import mongoose, { Schema, models, model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  stock: { type: Number, required: true, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  brand: { type: String },
  images: [{ type: String }],
  specs: { type: Schema.Types.Mixed },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Product = models.Product || model("Product", productSchema);
