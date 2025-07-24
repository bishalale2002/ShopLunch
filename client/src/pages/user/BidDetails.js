import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layouts from "../../components/layout/Layouts";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../components/context/auth";

// Countdown timer function
const calculateRemainingTime = (expireDate) => {
  const now = new Date();
  const end = new Date(expireDate);
  const diff = end - now;

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export default function BidDetails() {
  const { id } = useParams();
  const [bid, setBid] = useState(null);
  const [timer, setTimer] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth(); // ✅ useAuth hook

  const fetchBid = async () => {
    try {
      const { data } = await axios.get(`/api/v1/bidding/get-bid/${id}`);
      if (data?.bid) {
        setBid(data.bid);
      } else {
        toast.error("Bid not found");
      }
    } catch (err) {
      console.error("Error fetching bid:", err);
      toast.error("Error loading bid");
    }
  };

  useEffect(() => {
    fetchBid();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (bid?.expirationTime) {
        setTimer(calculateRemainingTime(bid.expirationTime));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [bid]);

  const handlePlaceBid = async () => {
    if (!bidAmount || isNaN(bidAmount)) {
      toast.error("Please enter a valid number");
      return;
    }

    const amount = parseFloat(bidAmount);
    const minAllowedBid = bid.currentAmount
      ? bid.currentAmount * 1.05
      : bid.startingAmount * 1.05;

    if (amount < minAllowedBid) {
      toast.error(
        `Bid must be at least 5% higher than the current bid (${minAllowedBid.toFixed(2)})`
      );
      return;
    }

    setLoading(true);

    try {
      const bidderGmail = auth?.user?.email; // ✅ corrected

      const { data } = await axios.post(`/api/v1/bidding/place-bid/${id}`, {
        amount,
        bidderGmail,
      });

      if (data.success) {
        toast.success("Bid placed successfully!");
        setBid(data.bidding);
        setBidAmount("");
      } else {
        toast.error(data.message || "Failed to place bid");
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Error placing bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layouts title="Bid Details">
      <div className="container mt-4 mb-5">
        <h1 className="text-center mb-4">Bid Details</h1>

        {bid ? (
          <div className="row g-4">
            <div className="col-md-6">
              <img
                src={`/api/v1/bidding/bid-photo/${bid._id}`}
                alt={bid.name || "Bid image"}
                className="img-fluid rounded shadow product-image"
                style={{ objectFit: "cover", maxHeight: "400px" }}
              />
            </div>

            <div className="col-md-6 d-flex flex-column">
              <h5 className="mb-3"><strong>Name:</strong> {bid.name}</h5>
              <p className="mb-3"><strong>Description:</strong> {bid.description}</p>
              <p className="mb-3"><strong>Starting Amount:</strong> ${bid.startingAmount}</p>
              <p className="mb-3"><strong>Current Bid:</strong> {bid.currentAmount ? `$${bid.currentAmount}` : "No bids yet"}</p>
              <p className="mb-3"><strong>Status:</strong> {bid.status}</p>
              <p className="mb-3"><strong>Time Remaining:</strong> {timer}</p>
              <p className="mb-3"><strong>Seller:</strong> {bid.sellerGmail}</p>

              <div className="mt-auto">
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={bid.currentAmount ? (bid.currentAmount * 1.05).toFixed(2) : (bid.startingAmount * 1.05).toFixed(2)}
                  step="0.01"
                />
                <button
                  className="btn btn-primary"
                  onClick={handlePlaceBid}
                  disabled={loading}
                >
                  {loading ? "Placing Bid..." : "Place a Bid"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading bid data...</p>
        )}
      </div>
    </Layouts>
  );
}
