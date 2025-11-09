import orderModel from "../models/orderModel.js"; // <--- ensure this line is present

export const khaltiPaymentController = async (req, res) => {
  try {
    const { cart, referenceId } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ ok: false, message: "Cart is empty or invalid" });
    }

    if (!referenceId || referenceId.trim() === "") {
      return res.status(400).json({ ok: false, message: "Reference ID is required" });
    }

    // Filter valid product IDs
    const productIds = cart
      .filter(item => item && item._id) // remove invalid items
      .map(item => item._id);

    if (productIds.length === 0) {
      return res.status(400).json({ ok: false, message: "No valid products in cart" });
    }

    // Calculate total
    const totalAmount = cart.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );

    // Save order
    const order = new orderModel({
      products: productIds,
      payment: {
        method: "KHALTI_QR",
        referenceId: referenceId.trim(),
        amount: totalAmount,
        status: "Pending",
      },
      buyer: req.user._id,
      status: "Not Process",
    });

    await order.save();

    return res.json({
      ok: true,
      message: "Order placed successfully. Admin will verify your Khalti payment.",
      order,
    });
  } catch (error) {
    console.error("Khalti payment error:", error);
    return res.status(500).json({ ok: false, message: "Failed to process Khalti payment", error });
  }
};
