import React, { useEffect, useState } from "react";
import Layouts from "../../components/layout/Layouts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Auth check from localStorage
const isAuthenticated = () => {
  const auth = localStorage.getItem("auth");
  return auth && JSON.parse(auth).token;
};

export default function Bidding() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Fetch all bids from backend
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/bidding/all-bids");
      console.log("Fetched bidding data:", data);
      setProducts(data?.biddings || []);
    } catch (error) {
      console.error("Error fetching bidding products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Seller navigation
  const handleBecomeSeller = () => {
    if (isAuthenticated()) {
      navigate("/dashboard/seller");
    } else {
      navigate("/login");
    }
  };

  // Timer display
const calculateRemainingTime = (expireDate) => {
  const now = new Date();
  const end = new Date(expireDate);
  const diff = end - now;

  if (diff <= 0) return "Expired";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""} ${seconds} second${seconds !== 1 ? "s" : ""}`;
};

  // Filter products that are available and not expired
  const filteredProducts = products.filter((p) => {
    const isAvailable = p.status?.toLowerCase() === "available";
    const notExpired = new Date(p.expirationTime) > new Date();
    return isAvailable && notExpired;
  });

  return (
    <Layouts title="Bidding">
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Bidding Products</h2>
          <button className="btn btn-primary" onClick={handleBecomeSeller}>
            Become Seller
          </button>
        </div>

        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={`/api/v1/bidding/bid-photo/${product._id}`}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="mb-1">
                    <strong>Starting Amount:</strong> ${product.startingAmount}
                  </p>
                  <p className="mb-1">
                    <strong>Current Amount:</strong> ${product.currentAmount}
                  </p>
                  <p className="mb-1">
                    <strong>Highest Bidder:</strong>{" "}
                    {product.highestBidderGmail || "No bids yet"}
                  </p>
                  <p className="mb-1">
                    <strong>Time Left:</strong>{" "}
                    {calculateRemainingTime(product.expirationTime)}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span style={{ color: "green" }}>{product.status}</span>
                  </p>
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate(`/bidding/product/${product._id}`)}
                  >
                    Bid Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-muted mt-4">
            No available products for bidding at the moment.
          </p>
        )}
      </div>
    </Layouts>
  );
}
