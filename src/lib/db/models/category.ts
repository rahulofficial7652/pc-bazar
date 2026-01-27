import mongoose, { Schema, models, model } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Category = models.Category || model("Category", categorySchema);
