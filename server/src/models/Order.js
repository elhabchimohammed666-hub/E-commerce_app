import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: String,
        title: String,
        image: String,
        color: String,
        price: Number,
        qty: Number,
      },
    ],
    total: Number,
    shipping: Number,
    status: { type: String, default: "confirmée" },
    address: {
      name: String,
      line: String,
      city: String,
      zip: String,
      country: String,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
