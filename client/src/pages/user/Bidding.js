import React, { useEffect, useState } from "react";
import Layouts from "../../components/layout/Layouts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Check if user is authenticated
const isAuthenticated = () => {
  const auth = localStorage.getItem("auth");
  return auth && JSON.parse(auth).token;
};

export default function Bidding() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Mask email address for privacy
  const maskEmail = (email) => {
    const [user, domain] = email.split("@");
    if (!user || !domain) return email;

    const maskedUser =
      user.length <= 2
        ? user[0] + "*".repeat(user.length - 1)
        : user[0] + "*".repeat(user.length - 2) + user[user.length - 1];

    return `${maskedUser}@${domain}`;
  };

  // Sync expired bidding statuses with the server
  const syncExpiredStatuses = async () => {
    try {
      await axios.put("/api/v1/bidding/update-expired-status");
    } catch (error) {
      console.error("Error syncing expired statuses:", error);
    }
  };

  // Fetch bidding products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/bidding/all-bids");
      setProducts(data?.biddings || []);
    } catch (error) {
      console.error("Error fetching bidding products:", error);
    }
  };

  // Run sync and fetch on mount
  useEffect(() => {
    syncExpiredStatuses().then(fetchProducts);
  }, []);

  // Redirect seller
  const handleBecomeSeller = () => {
    if (isAuthenticated()) {
      navigate("/dashboard/seller");
    } else {
      navigate("/login");
    }
  };

  // Calculate remaining time for a bid
  const calculateRemainingTime = (expireDate) => {
    const now = new Date();
    const end = new Date(expireDate);
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days} day${days !== 1 ? "s" : ""} ${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""} ${seconds} second${seconds !== 1 ? "s" : ""}`;
  };

  // Filter only available bidding products
  const filteredProducts = products.filter((p) => p.status === "available");

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
          {filteredProducts.length === 0 ? (
            <p className="text-center text-muted mt-4">
              No available products for bidding at the moment.
            </p>
          ) : (
            filteredProducts.map((product) => (
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
                      {product.highestBidderGmail
                        ? maskEmail(product.highestBidderGmail)
                        : "No bids yet"}
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
                      onClick={() => navigate(`/dashboard/bidding/${product._id}`)}
                    >
                      Bid Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layouts>
  );
}
