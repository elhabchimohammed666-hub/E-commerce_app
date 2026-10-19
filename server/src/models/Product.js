import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    category: String,
    price: Number,
    compareAt: Number,
    rating: Number,
    reviews: Number,
    sold: Number,
    stock: Number,
    badge: String,
    freeShipping: Boolean,
    colors: [String],
    images: [String],
    description: String,
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
