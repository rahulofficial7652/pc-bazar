import mongoose, { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  role: { type: String, default: "USER", enum: ["USER", "ADMIN"] },
  name: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  phone: { type: String },
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  cart: [{
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 }
  }],
  addresses: [{
    type: { type: String, enum: ["home", "work", "other"], default: "home" },
    name: { type: String },
    phone: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    isDefault: { type: Boolean, default: false }
  }]
}, { timestamps: true });

const User = models.User || model("User", userSchema);
export default User;
