import React, { useEffect, useState } from "react";
import Layouts from "../components/layout/Layouts";
import { useAuth } from "../components/context/auth";
import { useCart } from "../components/context/cart";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [clientToken, setClientToken] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [instance, setInstance] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCart((prevCart) =>
      prevCart.map((item) => ({
        ...item,
        quantity: 1,
      }))
    );
  }, [setCart]);

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveItem = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handlePayments = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const response = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      console.log(response.data);
      setLoading(false);
      navigate("/dashboard/user/orders");
      alert("Payment Successful!");
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Payment Failed. Please try again.");
    }
  };

  const handleQuantityChange = (productId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  return (
    <Layouts>
      <div className="container">
        <div className="row">
          <h2>Hello, {auth?.token && auth?.user?.name}</h2>
          <p>
            Current Address: {auth?.user?.address || "No address available"}
          </p>
          <h4 className="text-center">
            {cart?.length > 0
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
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          objectFit: "cover",
                        }}
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
                              ? item.description.slice(0, 30) + "..."
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
              <div className="border p-3">
                <h4>Cart Summary</h4>
                <p>Total Items: {cart.length}</p>
                <p>
                  Total Price: $
                  {cart
                    .reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </p>

                {clientToken ? (
                  <div className="form-group mb-3">
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: { flow: "vault" },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                      onError={(error) => {
                        console.error("Braintree Error:", error);
                        alert("Please check your card details and try again."); // Custom error message
                      }}
                    />

                    <button
                      className="btn btn-primary"
                      onClick={handlePayments}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing..." : "Make Payment"}
                    </button>
                  </div>
                ) : (
                  <p>Loading payment options...</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center my-5">
            <h5>Your cart is empty.</h5>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/")}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </Layouts>
  );
};

export default CartPage;
