import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [{ type: mongoose.ObjectId, ref: "product" }], // Referencing the Product model
    payment: {}, // For dynamic payment method (e.g., Cash on Delivery)
    buyer: { type: mongoose.ObjectId, ref: "User" }, // Referencing the User model
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Delivered", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
