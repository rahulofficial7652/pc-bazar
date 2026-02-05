import mongoose, { Schema, models, model } from "mongoose";

const productSchema = new Schema({
  // Basic Information
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },

  // Pricing
  price: { type: Number, required: true },
  discountPrice: { type: Number },

  // Inventory
  stock: { type: Number, required: true, default: 0 },

  // Category & Brand
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  brand: { type: String },

  // Media
  images: [{ type: String }],

  // Technical Specifications
  specs: { type: Schema.Types.Mixed },

  // Product Details (E-commerce Style)
  highlights: [{ type: String }], // Key features/bullet points
  features: [{
    title: { type: String },
    description: { type: String }
  }], // Detailed features with title and description

  // Services & Policies
  warranty: {
    duration: { type: String }, // e.g., "1 Year", "2 Years"
    type: { type: String }, // e.g., "Manufacturer Warranty", "Seller Warranty"
    details: { type: String } // Additional warranty information
  },

  returnPolicy: {
    returnable: { type: Boolean, default: true },
    duration: { type: String }, // e.g., "7 Days", "30 Days"
    details: { type: String }
  },

  shippingInfo: {
    freeShipping: { type: Boolean, default: false },
    minOrderForFreeShipping: { type: Number },
    estimatedDelivery: { type: String }, // e.g., "3-5 Business Days"
    details: { type: String }
  },

  // Additional Information
  manufacturerDetails: {
    name: { type: String },
    country: { type: String },
    address: { type: String }
  },

  // SEO & Marketing
  metaTitle: { type: String },
  metaDescription: { type: String },
  tags: [{ type: String }],

  // Status
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

export const Product = models.Product || model("Product", productSchema);
