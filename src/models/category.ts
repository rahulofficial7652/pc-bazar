import mongoose from "mongoose"

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    slug: String, // keyboard, mouse
  },
  { timestamps: true }
)

export const Category =
  mongoose.models.Category ||
  mongoose.model("Category", CategorySchema)
