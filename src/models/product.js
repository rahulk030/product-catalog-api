import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
    category: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, validate: Number.isInteger },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true, versionKey: false }
);

productSchema.index({ name: "text", description: "text" });

export const Product = mongoose.model("Product", productSchema);
