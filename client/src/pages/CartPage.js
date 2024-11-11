import React, { useEffect } from "react";
import Layouts from "../components/layout/Layouts";
import { useAuth } from "../components/context/auth";
import { useCart } from "../components/context/cart";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [auth] = useAuth();

  // Set initial quantity to 1 for every item when the cart is first loaded
  useEffect(() => {
    setCart((prevCart) =>
      prevCart.map((item) => ({
        ...item,
        quantity: 1, // Set to 1 if quantity is not already set
      }))
    );
  }, [setCart]);

  const handleRemoveItem = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== productId);

      // Save the updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      return updatedCart; // Return the updated cart to update the state
    });
  };

  const handleQuantityChange = (productId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) } // Ensure quantity cannot be less than 1
          : item
      )
    );
  };

  return (
    <Layouts>
      <div className="container">
        <div className="row">
          <h2>Hello, {auth?.token && auth?.user?.name}</h2>
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
                          objectFit: "cover", // Ensures image is cropped properly
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
                <button
                  className="btn btn-primary w-100"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </button>
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
