import React, { useEffect, useState } from "react";
import Layouts from "../components/layout/Layouts";
import { useAuth } from "../components/context/auth";
import { useCart } from "../components/context/cart";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import pp from './pp.JPG';
const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [khaltiRefId, setKhaltiRefId] = useState(""); // reference ID input

  useEffect(() => {
    setCart((prev) => prev.map((item) => ({ ...item, quantity: 1 })));
  }, [setCart]);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleRemoveItem = (productId) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  // Cash on Delivery
  const handleCashOnDelivery = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/v1/product/braintree/payment",
        { nonce: "cash-on-delivery", cart },
        { headers: { Authorization: auth?.token } }
      );

      toast.success(data.message || "Order placed (COD)");
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
    } catch (err) {
      console.error(err);
      toast.error("COD failed");
    } finally {
      setLoading(false);
    }
  };

  // Manual Khalti QR Payment
const handleKhaltiPayment = async () => {
  try {
    setLoading(true);

    
    const { data } = await axios.post(
      "/api/v1/payment/khalti/manual/",
      { cart, referenceId: khaltiRefId.trim() },
      { headers: { Authorization: auth?.token } }
    );

    toast.success(data?.message || "Order placed successfully!");
    localStorage.removeItem("cart");
    setCart([]);
    navigate("/dashboard/user/orders");
  } catch (error) {
    console.error(error.response?.data || error.message);
    toast.error("Khalti payment failed.");
  } finally {
    setLoading(false);
  }
};


  const handlePayment = () => {
    if (paymentMethod === "COD") handleCashOnDelivery();
    else if (paymentMethod === "KHALTI") handleKhaltiPayment();
  };

  const handleQuantityChange = (productId, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item
      )
    );
  };

  return (
    <Layouts>
      <div className="container">
        <div className="row">
          <h2>Hello, {auth?.token && auth.user?.name}</h2>
          <p>Current Address: {auth?.user?.address || "No address available"}</p>
          <h4 className="text-center">
            {cart.length > 0
              ? `You have ${cart.length} items in your cart`
              : "Your cart is empty"}
          </h4>
        </div>

        {cart.length > 0 ? (
          <div className="row">
            <div className="col-md-8">
              {cart.map((item) => (
                <div key={item._id} className="card mb-3 shadow-sm">
                  <div className="row g-0">
                    <div className="col-md-2">
                      <img
                        src={`/api/v1/product/product-photo/${item._id}`}
                        className="img-fluid rounded-start"
                        alt={item.name}
                        style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-md-10">
                      <div className="card-body d-flex align-items-center justify-content-between">
                        <div>
                          <h5 className="card-title">{item.name}</h5>
                          <p className="card-text">Price: ${item.price}</p>
                          <p className="card-text">
                            Description:{" "}
                            {item.description?.length > 30
                              ? item.description.slice(0, 30) + "…"
                              : item.description}
                          </p>
                          <div className="quantity-control d-flex align-items-center">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleQuantityChange(item._id, -1)}
                            >
                              -
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleQuantityChange(item._id, 1)}
                            >
                              +
                            </button>
                          </div>
                          <p className="mt-2">
                            Total: ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-md-4">
              <div className="border p-3 rounded shadow-sm">
                <h4>Cart Summary</h4>
                <p>Total Items: {cart.length}</p>
                <p>Total Price: ${totalAmount.toFixed(2)}</p>

                {!auth?.token && <p className="text-danger mb-2">Please login to pay</p>}

                <div className="mb-3">
                  <h6>Select Payment Method:</h6>
                  <label className="me-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                    />{" "}
                    Cash on Delivery
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="KHALTI"
                      checked={paymentMethod === "KHALTI"}
                      onChange={() => setPaymentMethod("KHALTI")}
                    />{" "}
                    Pay with Khalti (Manual QR)
                  </label>
                </div>

                {/* Show Khalti QR & reference input if selected */}
                {paymentMethod === "KHALTI" && (
                  <div className="mt-3 p-3 border rounded text-center">
                    <h6>Scan this QR to pay via Khalti</h6>
                    <img
                src={pp}
                      alt="Khalti QR"
                      style={{ maxWidth: "250px" }}
                    />
                    <p className="mt-2">After paying, enter the reference ID you received:</p>
                    <input
                      type="text"
                      placeholder="Transaction ID Generated by your Khalti App"
                      className="form-control mb-2"
                      value={khaltiRefId}
                      onChange={(e) => setKhaltiRefId(e.target.value)}
                    />
                  </div>
                )}

                <button
                  className="btn btn-success w-100"
                  onClick={handlePayment}
                  disabled={
                    loading ||
                    !auth?.token ||
                    !auth?.user?.address ||
                    (paymentMethod === "KHALTI" && !khaltiRefId.trim())
                  }
                >
                  {loading
                    ? "Processing…"
                    : paymentMethod === "COD"
                    ? "Place Order (COD)"
                    : "Submit Khalti Payment"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center my-5">
            <h5>Your cart is empty.</h5>
            <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </Layouts>
  );
};

export default CartPage;
