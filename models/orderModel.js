import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [{ type: mongoose.ObjectId, ref: "product" }],
    payment: {
      method: { type: String, default: "COD" },
      referenceId: String, // For manual Khalti QR payments
      amount: Number,
      status: { type: String, default: "Pending" },
    },
    buyer: { type: mongoose.ObjectId, ref: "User" },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Delivered", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
